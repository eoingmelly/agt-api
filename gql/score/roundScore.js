const roundScoreResolvers = require("./roundScore.resolver");
const { loadGQLFile } = require("../../utils/utils");
const roundScoreTypeDef = loadGQLFile("score/roundScore.graphql");

module.exports = {
  typeDefs: roundScoreTypeDef,
  resolvers: roundScoreResolvers,
};
