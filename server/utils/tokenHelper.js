const Token = require("../models/token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

//possible options to generate tokenString , uuid , crypto
//hashed the token after generating in db too

module.exports = (userId) => {
  const SALT = 10;
  const token = crypto.randomBytes(32).toString("hex");

  return new Promise((resolve, reject) => {
    bcrypt.hash(token, SALT, (error, hashedToken) => {
      if (error) {
        console.log(error);
        res.json({
          status: "unsucess",
          error: "error while hashing token",
        });

        reject(null);
      }

      const newToken = new Token({
        userId,
        token: hashedToken,
        expiresAt: Date.now() + parseInt(process.env.LINK_DURATION),
      });

      //delete all token from previous record, since only 1 record per user should be present
      //in this case, only the newly created should exists

      Token.deleteMany({ userId }).then(() => {
        newToken
          .save()
          .then(() => {
            console.log("token saved to database");
            console.log(token);
            resolve(token);
          })
          .catch((err) => {
            console.log(err);
            res.json({
              status: "unsucess",
              error: "error while saving token",
            });
          });
      });
    });
  });
};
