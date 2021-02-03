const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    displayName: { type: String },
    email: { type: String },
    email_lowered: { type: String },
    description: { type: String },
    handicap: { type: Number },
    image: { type: String },
  },
  { timestamps: true }
);

let userModel = mongoose.model("User", userSchema);

module.exports = {
  users: userSchema,
  usersModel: userModel,
};
