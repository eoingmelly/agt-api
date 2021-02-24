const mongoose = require("mongoose");
const { holeScores } = require("./holeScore/holeScore.model");
const Schema = mongoose.Schema;

const roundScoreSchema = new Schema(
  {
    gameType: {
      type: String,
      default: "Strokeplay",
      enum: ["Strokeplay", "Stableford", "Matchplay", "Skins"],
    },
    holesToPlay: { type: Number, default: 18 },

    totalStrokes: { type: Number },
    totalStablefordPoints: { type: Number },
    matchplayHolesUpDown: { type: Number },
    skinsObtained: { type: Number },

    isLive: { type: Boolean },
    holesPlayed: { type: Number },
    holeScores: [holeScores],

    //The course upon which this round is being played.
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    //user playing the round
    user: { type: Schema.Types.ObjectId, ref: "User" },
    //the tournament of which this round is a part
    tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
  },
  { timestamps: true }
);

let roundScoreModel = mongoose.model("RoundScore", roundScoreSchema);

module.exports = {
  roundScoresSchema: roundScoreSchema,
  roundScoresModel: roundScoreModel,
};
