const tokenModel = require("../models/token");
const userModel = require("../models/users");

const otpModel = require("../models/otp");
const resetPwdModel = require("../models/resetPwd");

const bcrypt = require("bcrypt");
const generateOtp = require("../utils/otpHelper");
const { v4: uuidv4 } = require("uuid");
const sendVerificationEmail = require("../utils/emailHelper");

const SALT = 10;

const forgotPassword_email_send = async (req, res) => {
  //check if user exist based on email
  //generate otp
  //hashed the otp
  //generate uuid for uniqueString
  //delete all current user document user otp and reset
  //save otp and send to email
  //return reposonse to fronted for it to navigate

  try {
    const { email } = req.body;

    const existUser = await userModel.findOne({ email: email });

    if (!existUser) {
      return res.status(400).json({
        status: "unsuccess",
        error: "User does not exist",
      });
    }

    const currToken = await tokenModel.findById(existUser._id);

    const otp = generateOtp().toString();

    const uniqueString = uuidv4();

    //this method of bcrypt-hash does not return promise,
    //to use await, need to surround in promise
    // or use newer method of brcypt

    bcrypt.hash(otp, SALT, (error, otpHashed) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          status: "unsuccess",
          error: "Error while hashing OTP",
        });
      }

      const newOtp = new otpModel({
        userId: existUser._id,
        otp: otpHashed,
        uniqueString: uniqueString,
        expiresAt: Date.now() + parseInt(process.env.LINK_DURATION),
      });

      resetPwdModel.deleteMany({ userId: existUser._id }).then(() => {
        otpModel
          .deleteMany({ userId: existUser._id })
          .then(() => {
            newOtp.save();
          })
          .then(() => {
            sendVerificationEmail(email, "VERIFY OTP", otp, "otp");
          })
          .then(() => {
            console.log("eveything is ok ");
          })
          .then(() => {
            console.log("email sent!!!");

            return res.status(200).json({
              status: "success",
              message: "OTP eamil sent",
              userId: existUser._id,
              uniqueString,
            });
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).json({
              status: "unsuccess",
              error: "OTP generation failed",
            });
          });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyOtp = async (req, res) => {
  //verify link
  //verify the otp
  //verify if otp expire
  //generate unqiue
  //return response to frontend to navigate
  try {
    const { uid, unique } = req.params;

    const { otp } = req.body;

    const currOtp = await otpModel.findOne({
      userId: uid,
      uniqueString: unique,
    });

    if (!currOtp) {
      return res.status(500).json({
        status: "unsuccess",
        error: "Invalid link",
      });
    }

    if (currOtp.expiresAt < Date.now()) {
      return res.status(500).json({
        status: "unsuccess",
        error: "OTP expire.Pls request a new one",
      });
    }

    const validOtp = await bcrypt.compare(otp, currOtp.otp);

    if (!validOtp) {
      return res.status(400).json({
        status: "unsuccess",
        error: "Invalid OTP",
      });
    }

    const newUniqueString = uuidv4();

    const newResetPwd = new resetPwdModel({
      userId: uid,
      uniqueString: newUniqueString,
      expiresAt: Date.now() + parseInt(process.env.LINK_DURATION),
    });

    await newResetPwd.save();

    console.log("unqiueString generated.Ready to update password");

    return res.status(200).json({
      status: "success",
      message: "Ready to update password",
      userId: uid,
      uniqueString: newUniqueString,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "unsuccess",
      error: "Failed to verify OTP",
    });
  }
};

const resetPassword = async (req, res) => {
  //verify link
  //hashed password in db and save
  //delete all the otp and resetPwd document of current user
  //return response to frontend
  try {
    const { uid, unique } = req.params;

    const { password } = req.body;

    const resetTarget = await resetPwdModel.findOne({
      userId: uid,
      uniqueString: unique,
    });

    if (!resetTarget) {
      return res.status(500).json({
        status: "unsuccess",
        error: "Invalid link",
      });
    }

    if (resetTarget.expiresAt < Date.now()) {
      return res.status(500).json({
        status: "unsuccess",
        error: "Period to reset expired.Pls retry again",
      });
    }

    const newHashedPassword = await bcrypt.hash(password, SALT);

    //update userModel with new password
    await userModel.findByIdAndUpdate(uid, { password: newHashedPassword });

    await otpModel.deleteMany({ userId: uid });
    await resetPwdModel.deleteMany({ userId: uid });

    return res.status(200).json({
      status: "success",
      message: "password updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "unsuccess",
      error: "Password failed to update",
    });
  }
};

module.exports = { resetPassword, verifyOtp, forgotPassword_email_send };
