const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");
const uploadOnCloudinary = require("../utils/fileUpload.js");

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

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  return res.status(201).json({
    success: true,
    data: user,
  });
});

module.exports = {
  registerUser,
};
