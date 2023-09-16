const tokenModel = require("../models/token");
const userModel = require("../models/users");
const bcrypt = require("bcrypt");

//only 1 record for each user should be present
const verifyUser = async (req, res) => {
  //based on  /:uid/verify/:token

  const { uid, token } = req.params;

  try {
    //check if such user exist
    const currUser = await userModel.findById(uid);

    if (!currUser) {
      return res.status(400).json({
        status: "unsuccess",
        error: "User not found",
      });
    }

    //check if verified
    if (currUser.isVerified) {
      return res.status(400).json({
        status: "unsuccess",
        error: "User already verified.please login to continue",
      });
    }

    //check and get token from user
    const currUserToken = await tokenModel.findOne({
      userId: uid,
    });

    if (!currUserToken) {
      return res.status(400).json({
        status: "unsuccess",
        error: "invalid link",
      });
    }

    //compare token
    const validToken = await bcrypt.compare(token, currUserToken.token);

    if (!validToken) {
      return res.status(400).json({
        status: "unsuccess",
        error: "invalid link",
      });
    }

    //check if token expire
    if (Date.now() > currUserToken.expiresAt) {
      return res.status(400).json({
        status: "unsuccess",
        error: "token expires",
      });
    }

    //update user status to be verified
    await userModel.updateOne({ _id: uid }, { isVerified: true });

    //delete all token for user
    await tokenModel.deleteMany({ userId: currUser._id });

    res.status(201).json({
      status: "success",
      msg: "user successful created",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyUser;
