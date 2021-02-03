// Database related functions

const chalk = require("chalk");
const mongo = require("mongoose");

module.exports = {
  connect: async () => {
    try {
      await mongo.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      console.log(chalk.cyan.bold("Connection to database established"));
    } catch (err) {
      console.log(chalk.red.bold("Unable to connect to MongoDB"));
      console.trace(chalk.red.bold(err.message));
    }
  },
};
