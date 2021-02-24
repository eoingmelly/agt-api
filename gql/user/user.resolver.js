const { users, usersModel } = require("./user.model");

module.exports = {
  Query: {
    Users: async (parent, args, ctx, info) => {
      let users, error;
      await usersModel
        .find()
        .populate({ path: "societies", populate: { path: "players" } })
        .then((usrs) => {
          users = usrs;
        })
        .catch((err) => {
          error = err;
        });
      return { users, error };
    },

    User: async (parent, { id }, ctx, info) => {
      // // get userData from ctx
      // const { userData } = ctx;
      let user, error;
      await usersModel
        .findOne({ _id: id })
        .then((usr) => {
          user = usr;
        })
        .catch((err) => {
          error = err;
        });

      return { user, error };
    },
  },
  Mutation: {
    RegisterUser: async (parent, { data }, ctx, info) => {
      let newUserData = { ...data };

      let error, user;
      try {
        user = await usersModel.findOne({
          email_lowered: newUserData.email.toLowerCase(),
        });
        if (!user) {
          let newUser = new usersModel(newUserData);
          newUser.email_lowered = newUser.email.toLowerCase();
          await newUser
            .save()
            .then(async (usr) => {
              user = usr;
            })
            .catch((err) => {
              error = err;
            });
        } else {
          console.log("No need, you're already here!");
        }

        return { user, error };
      } catch (err) {
        console.log("AGGGHHH");
        error = err;
        return { user, error };
      }
    },

    DeleteUser: async (parent, { id }, ctx, info) => {
      let deletedUser, error;
      try {
        await usersModel
          .findByIdAndDelete(id)
          .then(async (usr) => {
            deletedUser = usr;
          })
          .catch((err) => {
            error = err;
          });

        return { user: deletedUser, error };
      } catch (err) {
        error = err;
        return { user: null, error };
      }
    },

    UpdateUser: async (parent, { data, id }, ctx, info) => {
      //ctx should contain the logged in user data here, and he's the only one who can update himself.
      //But for now, just accept that it's by id passed in.
      let error, updatedUser;
      try {
        let updated = { ...data };
        await usersModel
          .findByIdAndUpdate(id, updated, { new: true })
          .then((updated) => {
            updatedUser = updated;
          })
          .catch((err) => {
            error = err;
          });

        return { user: updatedUser, error };
      } catch (err) {
        error = err;
        return { user: updatedUser, error };
      }
    },

    DeleteUsers: async (parent, { data }, ctx, info) => {
      //Just a quick clear down of ALL users, won't be keeping this!

      await usersModel.deleteMany({});

      return "All done...";
    },

    // updateUser: async (parent, { id, data }, ctx, info) => {
    //   let { userData } = ctx;

    //   let updatedUser, error;
    //   try {
    //     const hashpassword = await bcrypt.hash(data.password, saltRounds);

    //     let updated = {
    //       ...data,
    //       organisationId: mongoose.mongo.ObjectId(userData.org),
    //       password: hashpassword,
    //     };

    //     await usersModel
    //       .findByIdAndUpdate(id, updated, { new: true })
    //       .then((updated) => {
    //         updatedUser = updated;
    //       })
    //       .catch((err) => {
    //         error = utils.handleMongooseError(err);
    //       });

    //     return { user: updatedUser, error };
    //   } catch (err) {
    //     error = utils.handleMongooseError(err);
    //     return { user: updatedUser, error };
    //   }
    // },
  },
};
