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
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.societies.forEach((element) => {
    societyModel.findById(element).then((soc) => {
      console.log("e: ", element);
      console.log("soc: ", soc);
      console.log("my id is ", this._id);

      if (!soc.players.includes(this._id)) {
        soc.players.push(this._id);

        console.log("we added it again anyway!");
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
