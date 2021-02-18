const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var holeScoreSchema = new Schema({
  holeNumber: Number,
  stableFordScore: { type: Number, default: 0 },
  strokesScore: { type: Number, default: 0 },
  matchPlayHoleWon: { type: Boolean },

  holePar: Number,
});

const HoleScore = mongoose.model("HoleScore", holeScoreSchema);

module.exports = {
  holeScores: holeScoreSchema,
  HoleScoreModel: HoleScore,
};
