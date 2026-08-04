const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //get tokens from user
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    //validate token  and get user info from token
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      //something about frontend
      throw new ApiError(401, "invalid access token");
    }

    //adding user to the body params
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

module.exports = { verifyJWT };

//req.header("Authorization") for user token  if user is not from web or simply if we have token from header
