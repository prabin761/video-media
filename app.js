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

//routes declaration
app.use("/api/v1/users",userRouter);

module.exports = app;
