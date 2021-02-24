const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const societySchema = new Schema(
  {
    name: { type: String },
    name_lowered: { type: String },
    description: { type: String },
    players: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tournaments: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

let societyModel = mongoose.model("Society", societySchema);

module.exports = {
  societySchema: societySchema,
  societyModel: societyModel,
};
