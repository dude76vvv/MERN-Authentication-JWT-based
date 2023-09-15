const express = require("express");
const passport = require("passport");

const {
  googleLogout,
  googleFail,
  googleSuccess,
} = require("../Controllers/google");

const router = express.Router();

const successUrl = `${process.env.CLIENT_BASE_URL}/home2`;
const failUrl = `${process.env.CLIENT_BASE_URL}`;

//frontend will reached here to begin pasport oauth login

router.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//redirect/callback to do authentication
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failUrl,
    failureMessage: true,
    session: false,
  }),
  function (req, res) {
    res.redirect(successUrl);
  }
);

//for front end to check login
router.get("/google/fail", googleFail);

//for front end to check login
router.get("/google/success", googleSuccess);

//logout
router.get("google/logout", googleLogout);

module.exports = router;
