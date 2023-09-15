const jwt = require("jsonwebtoken");

const createJwtToken = (_id) => {
  return jwt.sign({ userId: _id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

module.exports = createJwtToken;
