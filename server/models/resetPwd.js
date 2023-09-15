const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetPwdSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user", //based on schema name
    unique: true,
  },

  //for unique link
  uniqueString: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const resetPwdModel = mongoose.model("resetPwd", resetPwdSchema);
module.exports = resetPwdModel;
