const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const uploadOnCloudinary = require("../utils/fileUpload.js");

//generate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    //saving the refresh token in the database
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message ||" token generation gone wrong");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user details
  //validate user input - not empty
  //check if user already exists: username, email
  // check for images, check for avatar
  //upload images to cloudinary, avatar(upload check on cloudinary)
  //create user object - create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  //get user details
  const { fullName, email, username, password } = req.body;

  //validate user input - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields required");
  }

  //check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with username and email exists");
  }

  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar figure is required");
  }

  //upload images to cloudinary, avatar(upload check on cloudinary)
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar picture is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //finding the user that has been created with id and removing password and refresh tokens from this created user refrence
  //so we dont share directly password and refresh tokens in response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wron while registering user");
  }

  return res.status(201).json({
    success: true,
    data: createdUser,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  //get username and password from req body
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!password) {
    throw new ApiError(400, "please provide your password");
  }

  //find the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user does not exists");
  }
  //check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  //for updating user(database) with user that we have already got from database and updating that user
  // user.refreshToken = refreshToken;
  // for updating user(database) with generated refresh token
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  //send tokens in coookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  //with that options cookies only can modified from server

  //send response successful
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user loggedIn successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //clear refresh token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));

  //reset  tokens
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
