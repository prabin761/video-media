const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //for the enabling optimise searching
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      url: String,//cloudinary url
      pubclic_id:String
    },
    coverImage: {
      url: String,//cloudinary url
      pubclic_id:String
    },
    watchHistory : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
      type: String,
      required : [true, 'password is required']
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save",async function (){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
});

//custom methods in mongoose
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password);//gives results on boolean (true and false)
}

userSchema.methods.generateAccessToken = function() {
   return jwt.sign({
        _id: this._id,
        email: this.email,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
)
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {_id: this._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
};

const User = mongoose.model("User", userSchema);

module.exports = User;
