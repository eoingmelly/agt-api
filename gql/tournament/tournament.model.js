const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tournamentSchema = new Schema(
  {
    competition_type: { type: String },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    image: { type: String },
    name: { type: String },
    preview_description: { type: String },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

let tournamentModel = mongoose.model("Tournament", tournamentSchema);

module.exports = {
  tournaments: tournamentSchema,
  tournamentsModel: tournamentModel,
};
