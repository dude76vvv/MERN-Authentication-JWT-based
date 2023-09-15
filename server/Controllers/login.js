const userModel = require("../models/users");
const createJwtToken = require("../utils/jwtHelper");
const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
  //joi validation

  try {
    const { email, password } = req.body;

    //check email to determine if user exist
    const currUser = await userModel.findOne({ email });

    if (!currUser) {
      return res.status(400).json({
        status: "unsuccess",
        error: "User does not exist",
      });
    }

    //compare password
    const validPassword = await bcrypt.compare(password, currUser.password);

    if (!validPassword) {
      return res.status(400).json({
        status: "unsuccess",
        error: "Invalid email/password",
      });
    }

    //check if verified
    if (!currUser.isVerified) {
      return res.status(400).json({
        status: "unsuccess",
        error: "Please verify email to continue",
      });
    }

    const jwtToken = createJwtToken(currUser._id);

    //create jwt token and store in cookie !!!
    res.cookie("access-token", jwtToken, {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), //1 day in millisec
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    //create user object to send back
    const userObj = {
      name: currUser.name,
      email,
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
      message: "Internal Server Error",
    });
  }
};

const getUser = async (req, res) => {
  if (req.user) res.status(200).json(req.user);
  else
    res.status(401).json({
      status: "unsuccess",
      error: "Unauthorized. Pls login to continue",
    });
};

module.exports = { loginUser, getUser };
