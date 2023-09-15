const mongoose = require("mongoose");
//googleId Or email + verified

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: false,
    },

    profileImageUrl: String,

    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      // allowNull: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024,
    },

    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, //timestamps come with s, will create createdAt and updatedAt
  }
);

//schema name is user
const userModel = mongoose.model("user", userSchema);

//use this model to interact with db eg create new user
module.exports = userModel;
