const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user", //based on schema name
    unique: true,
  },

  //hash the otp
  otp: { type: String, required: true },

  //for unique link
  uniqueString: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
