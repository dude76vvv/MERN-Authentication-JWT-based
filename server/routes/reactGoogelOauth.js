const express = require("express");
const passport = require("passport");
const {
  googleGetUser,
  googleLoginUser,
} = require("../Controllers/googleOauth");

const router = express.Router();

//frontend will reached here to beegin oauth login
//will reach callback route
router.post("/google", googleGetUser);
router.post("/google/login", googleLoginUser);

module.exports = router;
