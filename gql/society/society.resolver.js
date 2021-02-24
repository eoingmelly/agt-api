const { societyModel } = require("./society.model");

module.exports = {
  Query: {
    Societies: async (parent, args, ctx, info) => {
      let societies, error;
      // get userData from ctx
      const { userData } = ctx;
      await societyModel
        .find()
        .populate("tournaments")
        .populate("players")
        .then((socs) => {
          console.log("socs are: ", socs);
          societies = socs;
        })
        .catch((err) => {
          error = err;
        });
      return { societies, error };
    },

    Society: async (parent, { id }, ctx, info) => {
      // get userData from ctx
      const { userData } = ctx;
      let society, error;
      try {
        society = await societyModel
          .findById(id)
          .populate("tournaments players");
      } catch (err) {
        error = err;
      }
      return { society: society, error };
    },
  },
  Mutation: {
    AddSociety: async (parent, { data }, ctx, info) => {
      let newSocietyData = { ...data };
      // get userData from ctx
      const { userData } = ctx;

      let error, society;
      try {
        society = await societyModel.findOne({
          name_lowered: newSocietyData.name.toLowerCase(),
        });

        if (!society) {
          let newSociety = new societyModel(newSocietyData);
          newSociety.name_lowered = newSociety.name.toLowerCase();
          await newSociety
            .save()
            .then(async (soc) => {
              society = soc;
            })
            .catch((err) => {
              error = err;
            });
        } else {
          console.log("No need, you're already here!");
        }

        return { society, error };
      } catch (err) {
        error = err;
        return { society, error };
      }
    },

    DeleteSociety: async (parent, { id }, ctx, info) => {
      let deletedSociety, error;
      // get userData from ctx
      const { userData } = ctx;
      try {
        await societyModel
          .findByIdAndUpdate(id, { active: false }, { new: true })
          .populate("tournaments")
          .populate("players")
          .then(async (soc) => {
            deletedSociety = soc;
          })
          .catch((err) => {
            error = err;
          });

        return { society: deletedSociety, error };
      } catch (err) {
        error = err;
        return { society: null, error };
      }
    },

    UpdateSociety: async (parent, { data, id }, ctx, info) => {
      // ctx should contain the logged in user data here, and he's the only one who can update himself.
      // But for now, just accept that it's by id passed in.
      // get userData from ctx
      const { userData } = ctx;
      let error, updatedSociety;
      try {
        let updated = { ...data };
        await societyModel
          .findByIdAndUpdate(id, updated, { new: true })
          .populate("tournaments")
          .populate("players")
          .then((updated) => {
            updatedSociety = updated;
          })
          .catch((err) => {
            error = err;
          });

        return { society: updatedSociety, error };
      } catch (err) {
        error = err;
        return { society: updatedSociety, error };
      }
    },

    //    AddUserToSociety(socId: ID, userId: ID): SocietyPayload!

    AddUserToSociety: async (parent, { socId, userId }, ctx, info) => {
      const { userData } = ctx;
      let error, updatedSociety;

      let update = { $push: { players: userId } };

      updatedSociety = await societyModel
        .findOneAndUpdate({ id: socId }, update, { new: true })
        .catch((err) => {
          error = err;
        });

      return { society: updatedSociety, error };
    },

    //  AddTournamentToSociety(socId: ID, tourID: ID): SocietyPayload!
    AddTournamentToSociety: async (parent, { socId, tourId }, ctx, info) => {
      const { userData } = ctx;
      let error, updatedSociety;

      let update = { $push: { tournaments: tourId } };

      updatedSociety = await societyModel
        .findOneAndUpdate({ id: socId }, update, { new: true })
        .catch((err) => {
          error = err;
        });

      return { society: updatedSociety, error };
    },
  },
};
