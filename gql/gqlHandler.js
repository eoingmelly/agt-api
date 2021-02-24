// GraphQL merger file, all types, resolvers and contexts are merged here.
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { print } = require("graphql");
const auth = require("../utils/auth");
const { composeResolvers } = require("@graphql-tools/resolvers-composition");

////// GraphQL Schemas
const user = require("./user/user");
const course = require("./course/course");
const tournament = require("./tournament/tournament");
const roundScore = require("./score/roundScore");
const society = require("./society/society");

// const organisation = require("./organisation/organisation");
// const folder = require("./folder/folder");
// const folderField = require("./folder/folderFields/folderField");
// const record = require("./record/record");
// const note = require("./note/note");
// const processPath = require("./folder/processPath/processPath");
// const aws = require("./aws/aws");
////// GraphQL Schemas

// This is pretty much like before, you add all the typeDefs in the
// "types" array and all the resolvers in the "resolvers" array.
const types = [
  user.typeDefs,
  course.typeDefs,
  tournament.typeDefs,
  roundScore.typeDefs,
  society.typeDefs,
  //   organisation.typeDefs,
  //   processPath.typeDefs,
  //   record.typeDefs,
  //   folder.typeDefs,
  //   folderField.typeDefs,
  //   note.typeDefs,
];
const resolvers = [
  user.resolvers,
  course.resolvers,
  tournament.resolvers,
  roundScore.resolvers,
  society.resolvers,
  //   organisation.resolvers,
  //   processPath.resolvers,
  //   record.resolvers,
  //   folder.resolvers,
  //   folderField.resolvers,
  //   note.resolvers,
];

// Merging the typeDefs and the Resolvers
console.log("about to merge type defs...");

mergedTypes = mergeTypeDefs(types, { all: true });

mergedRes = mergeResolvers(resolvers, { all: true });

// This can also be saved as a file for easier loading later on when the
// schemas are mostly done, this will save a tiny bit of memory since we won't need
// to load all the files for the typesDefs but rather just one.
const printedTypeDefs = print(mergedTypes);

//Here you can set the queries that will need Authorization
const resolversComposition = {
  "Query.User": auth.userHasPermissions(),
  //   "Query.Organisation": auth.userHasPermissions(),
  //   "Query.Organisations": auth.userHasPermissions(),
  //   //"Query.OrganisationByOrg": auth.userIsSuperUser(),
  //"Query.Users": auth.userHasPermissions(),
  //   "Mutation.createUser": auth.userHasPermissions(),
  //   "Query.Folders": auth.userHasPermissions(),
  //   "Mutation.createFolder": auth.userHasPermissions(),
  //   "Mutation.updateFolder": auth.userHasPermissions(),
  //   "Mutation.deleteFolder": auth.userHasPermissions(),
  //   //"Mutation.createFolderOnOrg": auth.userIsSuperUser(),
  //   //"Query.FoldersByOrg": auth.userIsSuperUser(),
  //   //"Query.FolderByOrg": auth.userIsSuperUser(),
  //   "Query.Records": auth.userHasPermissions(),
  //   "Query.Record": auth.userHasPermissions(),
  //   "Query.RecordsStats": auth.userHasPermissions(),
  //   "Query.RecordsByFolder": auth.userHasPermissions(),
  //   "Query.GenerateGetURL": auth.userHasPermissions(),
  //   //"Query.RecordsByOrg": auth.userIsSuperUser(),
  //   //"Query.RecordsByOrgStats": auth.userIsSuperUser(),
  //   "Query.FolderFields": auth.userHasPermissions(),
  //   //"Query.FolderFields": auth.userIsSuperUser(),
  //   "Mutation.updateFolderField": auth.userHasPermissions(),
  //   "Mutation.deleteFolderField": auth.userHasPermissions(),
};
// Here we add the auth.userHasPermissions function to the resolvers added
// in the object above.
const composedResolvers = composeResolvers(mergedRes, resolversComposition);

const mergedSchema = makeExecutableSchema({
  typeDefs: printedTypeDefs,
  resolvers: composedResolvers,
});

module.exports = mergedSchema;
