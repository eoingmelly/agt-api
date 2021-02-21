const roundScoresModel = require("./roundScore.model");

module.exports = {
  Query: {
    RoundScores: async (parent, args, ctx, info) => {
      let roundScores, error;
      // get userData from ctx
      const { userData } = ctx;
      await roundScoresModel
        .find()
        .then((scrs) => {
          roundScores = scrs;
        })
        .catch((err) => {
          error = err;
        });
      return { roundScores: roundScores, error };
    },

    RoundScore: async (parent, { id }, ctx, info) => {
      // get userData from ctx
      const { userData } = ctx;
      let roundScore, error;
      try {
        roundScore = await roundScoresModel.findById(id);
      } catch (err) {
        error = err;
      }
      return { roundScore: roundScore, error };
    },
  },
  Mutation: {
    AddUpdateRoundScore: async (parent, { id }, ctx, info) => {
      // get userData from ctx
      const { userData } = ctx;
      let roundScore, error;
      try {
        roundScore = await roundScoresModel.findById(id);
      } catch (err) {
        error = err;
      }
      return { roundScore, error };
    },
  },
};
