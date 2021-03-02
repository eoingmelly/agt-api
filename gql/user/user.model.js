const mongoose = require("mongoose");

const { hashPassword, updateSocieties } = require("./user.privateMethods");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    displayName: { type: String },
    email: { type: String },
    email_lowered: { type: String },
    description: { type: String },
    handicap: { type: Number },
    image: { type: String },
    societies: [{ type: Schema.Types.ObjectId, ref: "Society" }],
    password: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  updateSocieties(this);
  hashPassword(this);
  next();
});

userSchema.post("save", function (next) {
  updateSocieties(this);
  console.log("post everything: ", this);
  next();
});

let userModel = mongoose.model("User", userSchema);

module.exports = {
  users: userSchema,
  usersModel: userModel,
};
