const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

const requireJwtAuth = async (req, res, next) => {
  //examine the cookie, get the jwt token,

  try {
    // const token = req.headers.cookie.split("access-token=").slice(-1)[0];

    const cookie = getCookie(req.headers.cookie, "access-token");
    const token = cookie["access-token"];

    //verify the jwt token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //get user object
    const currUser = await userModel.findById(userId);

    if (!currUser) {
      return res.status(401).json({
        status: "unsuccess",
        error: "Unauthorized user. Pls login to continue",
      });
    }

    // if all passed, pass the user object to the controller using nexts
    // this is when there is cookie and user is not login in,
    // we want to send user object explictly to controller

    req.user = { id: userId, email: currUser.email, name: currUser.name };
    next();
  } catch (error) {
    res.status(401).json({
      status: "unsuccess",
      error: "Unauthorized.Login to continue",
    });
  }
};

//cookie parser to get value is not working, need to look at header to get value
const getCookie = (cookieHeaderValue, cookieName) => {
  const cookieObject = cookieHeaderValue
    .split("; ")
    .map((x) => {
      x.trim();
      return x.split("=");
    })
    .filter((y) => y[0] === cookieName)
    .reduce((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});

  return cookieObject;
};

module.exports = requireJwtAuth;
