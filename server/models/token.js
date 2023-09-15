const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user", //based on schema name
    unique: true,
  },
  token: { type: String, required: true },
  //   createdAt: { type: Date, default: Date.now, expires: 3600 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const tokenModel = mongoose.model("token", tokenSchema);
module.exports = tokenModel;
