const societyResolvers = require("./society.resolver");
const { loadGQLFile } = require("../../utils/utils");
const societyTypeDef = loadGQLFile("society/society.graphql");

module.exports = {
  typeDefs: societyTypeDef,
  resolvers: societyResolvers,
};
