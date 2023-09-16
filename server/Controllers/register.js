const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/tokenHelper");
const sendVerificationEmail = require("../utils/emailHelper");

const registerUser = async (req, res) => {
  try {
    //joi middleware already did the verification

    const { name, email, password } = req.body;

    const existUser = await userModel.findOne({ email: email });

    if (existUser) {
      return res.json({
        status: "unsuccess",
        error: "User already exists",
      });
    }

    //hashed password,
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user in db but not verified
    const newUser = userModel({ ...req.body, password: hashedPassword });
    await newUser.save();

    //to return new
    const tokenString = await generateToken(newUser._id);

    if (!tokenString) {
      return res.status(500).json({
        status: "unsuccess",
        msg: "Unable to generate token",
      });
    }

    //created url link to frontend for email verification
    //frontend useeffect will call backend to verify
    const URL = `${process.env.CLIENT_BASE_URL}/user/${newUser._id}/verify/${tokenString}`;

    //nodemailer
    await sendVerificationEmail(newUser.email, "VERIFY EMAIL", URL, "email");
    console.log("email sent");

    //send email with link for user to verufy
    res.status(200).json({
      status: "success",
      msg: "Email sent. Pls verify to continue",
      url: URL,
    });
  } catch (error) {
    res.status(400).json({ status: "unsuccess", error: error.message });
  }
};

module.exports = registerUser;
