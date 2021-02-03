const express = require("express");
const db = require("./utils/db");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./gql/gqlHandler");

const app = express();

const server = {
  start: async () => {
    // await auth.start();
    await db.connect();
    let loadedSchema = schema;

    //Cors configurations can be added to allow just connections from certan domains.
    var allowedOrigins = [
      //   "http://localhost:8081",
      "http://localhost:9000",
      //   "http://localhost:3000",
      //   "http://my.computer:3000",
      //   process.env.WEBAAPP_DOMAIN,
      //   "https://api.datacapture.ie",
    ];
    app.use(
      cors({
        origin: function (origin, callback) {
          // allow requests with no origin
          // (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
          if (allowedOrigins.indexOf(origin) === -1) {
            var msg =
              "The CORS policy for this site does not " +
              "allow access from the specified Origin.";
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
        credentials: true,
      })
    );
    app.use(
      "/graphql",
      //   cookieParser(),
      //   auth.verifyToken,
      graphqlHTTP({
        schema,
        graphiql: true,
      })
    );
    app.use("*", (req, res) => {
      res.status(404).send("404 Not Found");
    });
    app.listen(process.env.PORT, () => {
      console.info(`Listening on port ${process.env.PORT}`);
    });
  },
};

module.exports = server;
