const { tournaments, tournamentsModel } = require("./tournament.model");

module.exports = {
  Query: {
    Tournaments: async (parent, args, ctx, info) => {
      let tournaments, error;
      // get userData from ctx
      const { userData } = ctx;
      await tournamentsModel
        .find()
        .populate("courses")
        .then((tours) => {
          tournaments = tours;
        })
        .catch((err) => {
          error = err;
        });
      return { tournaments, error };
    },

    Tournament: async (parent, { id }, ctx, info) => {
      // get userData from ctx
      const { userData } = ctx;
      let tournament, error;
      try {
        tournament = await tournamentsModel.findById(id);
      } catch (err) {
        error = err;
      }
      return { tournament, error };
    },
  },
  Mutation: {
    AddTournament: async (parent, { data }, ctx, info) => {
      let newTournamentData = { ...data };
      // get userData from ctx
      const { userData } = ctx;

      let error, tournament;
      try {
        tournament = await tournamentsModel.findOne({
          name_lowered: newTournamentData.name.toLowerCase(),
        });

        if (!tournament) {
          let newTournament = new tournamentsModel(newTournamentData);
          newTournament.name_lowered = newTournament.name.toLowerCase();
          await newTournament
            .save()
            .then(async (trn) => {
              tournament = trn;
            })
            .catch((err) => {
              error = err;
            });
        } else {
          console.log("No need, you're already here!");
        }

        return { tournament, error };
      } catch (err) {
        error = err;
        return { tournament, error };
      }
    },

    DeleteTournament: async (parent, { id }, ctx, info) => {
      let deletedTournament, error;
      // get userData from ctx
      const { userData } = ctx;
      try {
        await tournamentsModel
          .findByIdAndDelete(id)
          .populate("courses")
          .then(async (trn) => {
            deletedTournament = trn;
          })
          .catch((err) => {
            error = err;
          });

        return { tournament: deletedTournament, error };
      } catch (err) {
        error = err;
        return { tournament: null, error };
      }
    },

    UpdateTournament: async (parent, { data, id }, ctx, info) => {
      // ctx should contain the logged in user data here, and he's the only one who can update himself.
      // But for now, just accept that it's by id passed in.
      // get userData from ctx
      const { userData } = ctx;
      let error, updatedTournament;
      try {
        let updated = { ...data };
        await tournamentsModel
          .findByIdAndUpdate(id, updated, { new: true })
          .populate("courses")
          .then((updated) => {
            updatedTournament = updated;
          })
          .catch((err) => {
            error = err;
          });

        return { tournament: updatedTournament, error };
      } catch (err) {
        error = err;
        return { tournament: updatedTournament, error };
      }
    },

    DeleteCourses: async (parent, { data }, ctx, info) => {
      //Just a quick clear down of ALL courses, won't be keeping this!

      await tournamentsModel.deleteMany({});

      return "All done...";
    },
  },
};
