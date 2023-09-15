const express = require("express");

const { validationMiddleware } = require("../validations/authValidation");

const {
  forgotPassword_email_send,
  verifyOtp,
  resetPassword,
} = require("../Controllers/forgotPassword");
const { newPwdSchema } = require("../validations/authValidation");
const { resetPwdSchema } = require("../validations/authValidation");

const router = express.Router();

//resetPassword
router.post(
  "/forgotpassword",
  validationMiddleware(resetPwdSchema),
  forgotPassword_email_send
);

router.post("/verifyotp/user/:uid/:unique", verifyOtp);

router.put(
  "/resetnewpassword/user/:uid/:unique",
  validationMiddleware(newPwdSchema),
  resetPassword
);

module.exports = router;
