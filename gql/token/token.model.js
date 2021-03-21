const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    access_token: { type: String },

    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

let tokenModel = mongoose.model("Token", tokenSchema);

module.exports = {
  tokens: tokenSchema,
  tokensModel: tokenModel,
};
