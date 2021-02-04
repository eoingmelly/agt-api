const courseResolvers = require("./course.resolver");
const utils = require("../../utils/utils");
const courseTypeDef = utils.loadGQLFile("course/course.graphql");

module.exports = {
  typeDefs: courseTypeDef,
  resolvers: courseResolvers,
};
