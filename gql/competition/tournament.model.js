const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tournamentSchema = new Schema(
  {
    name: { type: String },
    competition_type: { type: String },
    //courses: { type: String },
    description: { type: String },
    handicap: { type: Number },
    image: { type: String },
  },
  { timestamps: true }
);

let tournamentModel = mongoose.model("Tournament", tournamentSchema);

module.exports = {
  tournaments: tournamentSchema,
  tournamentsModel: tournamentModel,
};
