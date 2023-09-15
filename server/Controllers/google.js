const passport = require("passport");

const googleFail = (req, res) => {
  res.status(401).json({
    status: unsuccess,
    error: "Log in failure",
  });
};

const googleSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      status: success,
      message: "Log in success",
      user: req.user,
    });
  } else {
    res.status(401).json({
      status: "unsuccess",
      error: "Not found?",
    });
  }
};

const googleLogout = (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_BASE_URL);
};

module.exports = {
  googleLogout,
  googleFail,
  googleSuccess,
};
