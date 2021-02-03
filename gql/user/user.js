const userResolvers = require("./user.resolver");
const utils = require("../../utils/utils");
const userTypeDef = utils.loadGQLFile("user/user.graphql");

module.exports = {
  typeDefs: userTypeDef,
  resolvers: userResolvers,
};
