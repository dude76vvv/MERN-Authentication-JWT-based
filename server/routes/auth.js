const express = require("express");
const registerUser = require("../Controllers/register");
const verifyUser = require("../Controllers/verify");

const {
  validationMiddleware,
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");
const { loginUser, getUser } = require("../Controllers/login");
const requireJwtAuth = require("../middleware/authMiddleware");
const logoutUser = require("../Controllers/logout");
const router = express.Router();

//register
router.post("/register", validationMiddleware(registerSchema), registerUser);

//verifiction
router.get("/:uid/verify/:token", verifyUser);

//login
router.post("/login", validationMiddleware(loginSchema), loginUser);

//get current user
router.post("/currentuser", requireJwtAuth, getUser);

//logout
router.post("/logout", logoutUser);

module.exports = router;
