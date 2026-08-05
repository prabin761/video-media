const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "16kb",
  }),
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); //public is public folder
app.use(cookieParser());

//routes
const userRouter = require("./src/routes/user.routes.js");
const User = require("./src/models/user.model.js");

//routes declaration
app.use("/api/v1/users",userRouter);

//get all users
app.get('/all', async(req,res) =>{
  user = await User.find().select("-password")
  res.status(200).json({
    success: true,
    data:user
  })
})

module.exports = app;
