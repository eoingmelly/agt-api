const mongoose = require("mongoose");
const { societyModel } = require("../society/society.model");
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
  this.societies.forEach((element) => {
    societyModel.findById(element).then((soc) => {
      if (!soc.players.includes(this._id)) {
        soc.players.push(this._id);
      }
      soc.save();
    });
  });
  next();
});

let userModel = mongoose.model("User", userSchema);

module.exports = {
  users: userSchema,
  usersModel: userModel,
};
