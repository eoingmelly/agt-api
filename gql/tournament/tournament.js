const tournamentResolvers = require("./tournament.resolver");
const { loadGQLFile } = require("../../utils/utils");
const tournamentTypeDef = loadGQLFile("tournament/tournament.graphql");

module.exports = {
  typeDefs: tournamentTypeDef,
  resolvers: tournamentResolvers,
};
