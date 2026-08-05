const express = require("express");
const {registerUser, loginUser, logoutUser, refreshAccessToken} = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");
const { verifyJWT } = require("../middlewares/auth.middlewares.js");

const router = express.Router();

// router.post("/register",registerUser); both are right
router.route("/register").post(
    upload.fields([
        {name: "avatar",maxCount:1,},
        {name: "coverImage", maxCount: 1,}
    ])
    ,registerUser
);

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

module.exports = router;