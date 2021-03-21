const { users, usersModel } = require("./user.model");
const auth = require("../../utils/auth");

module.exports = {
  Query: {
    Users: async (parent, args, ctx, info) => {
      console.log("ctx.req.isLoggedIn: ", ctx.req.isLoggedIn);
      console.log("ctx.req.uData: ", ctx.req.userData);

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

      console.log("cookies: ", ctx.res.cookie);

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

    LoginUser: async (parent, { data }, ctx, info) => {
      //ctx should contain the logged in user data here, and he's the only one who can update himself.
      //But for now, just accept that it's by id passed in.

      let { email, password } = data;
      let error = "";
      let success = false;

      try {
        await usersModel
          .findOne({ email_lowered: email.toLowerCase() })
          .then(async (u) => {
            if (u) {
              console.log("comparing pws");
              let isMatch = await auth.comparePasswords(u.password, password);
              console.log("isMatch is: ", isMatch);
              if (isMatch) {
                try {
                  console.log("creating access token...");
                  let token = auth.createAccessToken(u);

                  console.log("token.access_token is:", token);
                  ctx.res.cookie("access_token", token.access_token, {
                    // secure: true,
                    httpOnly: true,
                  });
                  console.log("creating refresh token...");
                  let refresh_token = auth.createRefreshToken(token);

                  ctx.res.cookie("refresh_token", refresh_token, {
                    // secure: true,
                    httpOnly: true,
                  });

                  ctx.res.cookie(
                    "data",
                    { displayName: u.displayName },
                    {
                      // secure: true,
                      httpOnly: false,
                    }
                  );

                  console.log("Saul Good Man");
                  success = true;
                } catch (err) {
                  error = err.message;
                }
              } else {
                console.log("No match found...");
                throw new Error("unable to login user");
              }
            } else {
              error = "No such user";
            }
          })
          .catch((err) => {
            error += err;
          });
        return { success, error };
      } catch (err) {
        error += err;
        return { success, error };
      }
    },

    DeleteUsers: async (parent, { data }, ctx, info) => {
      //Just a quick clear down of ALL users, won't be keeping this!

      await usersModel.deleteMany({});

      return "All done...";
    },

    ChangePassword: async (parent, { data }, ctx, info) => {
      //ctx should contain the logged in user data here, and he's the only one who can update himself.
      //But for now, just accept that it's by id passed in.
      let { password } = data;
      let error = "";
      let success = false;

      console.log(error);
      console.log(success);

      try {
        await usersModel
          .findById(ctx.usrId)
          //.findOne({ email_lowered: email.toLowerCase() })
          .then((u) => {
            if (u) {
              if (u.password === password) {
                success = true;
              }
            } else {
              error = "No such user";
            }
          })
          .catch((err) => {
            error += err;
          });
        return { success, error };
      } catch (err) {
        error += err;
        return { success, error };
      }
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
