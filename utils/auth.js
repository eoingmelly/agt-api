//TODO Handle token generation, verification and validation in here.
const auth = {
  userHasPermissions: () => (next) => async (root, args, context, info) => {
    if (!context.isLogged) {
      throw new GraphQLError("You are not authorized!");
    }

    return next(root, args, context, info);
  },
};

module.exports = auth;
