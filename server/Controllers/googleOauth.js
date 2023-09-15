const { OAuth2Client } = require("google-auth-library");
const { default: jwtDecode } = require("jwt-decode");
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const createJwtToken = require("../utils/jwtHelper");

const SALT = 10;

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

const googleGetUser = async (req, res) => {
  try {
    console.log(req.body);

    const { access_token } = req.body.tokenResponse;

    const { tokens } = await oAuth2Client.getToken(req.body.tokenResponse); // exchange code for tokens
    // console.log(tokens);

    //id_token is jwt token containing user information
    const userDetails = jwtDecode(tokens["id_token"]);

    // console.log(userDetails);

    const user = (({ email, name, picture, sub }) => ({
      email,
      name,
      picture,
      sub,
    }))(userDetails);

    // console.log(userInfo);

    //make the changes to  database
    await googleUpdateCreateUser(user);

    //return back to front set values

    res.status(200).json({
      status: "success",
      message: "sign in from google auth success",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: "unsuccess",
      error: "Error! Unable to google login",
    });
  }
};

const googleUpdateCreateUser = async (userInfo) => {
  const { email, name, picture, sub: googleId } = userInfo;

  const existUser = await userModel.findOne({ email: email });

  if (!existUser) {
    const newPassword = googleId + name;
    const hashNewPassword = await bcrypt.hash(newPassword, SALT);

    const newUser = new userModel({
      googleId,
      profileImageUrl: picture,
      name: name,
      email,
      isVerified: true,
      password: hashNewPassword,
    });
    await newUser.save();
  } else {
    //if user exist, update respective object properties if there is

    const changeFlag = false;

    if (!existUser.googleId) {
      changeFlag = true;
      existUser.googleId = googleId;
    }

    if (!existUser.profileImageUrl) {
      changeFlag = true;
      existUser.profileImageUrl = picture;
    }

    if (changeFlag) await existUser.save();
  }
};

// to generate cookie when google sign in user
const googleLoginUser = async (req, res) => {
  try {
    const { email } = req.body.userData;

    const currUser = await userModel.findOne({ email });

    if (!currUser) {
      return res.status(400).json({
        status: "unsuccess",
        error: "Error when signing from goggle",
      });
    }

    const jwtToken = createJwtToken(currUser._id);

    res.cookie("access-token", jwtToken, {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), //1 day in millisec
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const userObj = {
      email: currUser.email,
      name: currUser.name,
      profilePic: currUser.profileImageUrl,
    };

    return res.status(200).json({
      status: "success",
      message: "Success login",
      user: userObj,
      token: jwtToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "unsuccess",
      message: "Internal Server Error.Google sign in",
    });
  }
};

module.exports = { googleGetUser, googleLoginUser };
