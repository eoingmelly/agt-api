const express = require("express");
const db = require("./utils/db");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./gql/gqlHandler");
const auth = require("./utils/auth");
var cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

require("./utils/socketNotifications")(io);
// io.on("connection", (socket) => {
//   console.log("a user has connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });

//   socket.on("chat message", (msg) => {
//     io.emit("chat message", msg);
//   });
// });

const setIOInReq = (req, res, next) => {
  if (!req.io) {
    console.log("IO set in req", req.io);
    req.io = io;
  } else {
    console.log("IO is already set...", req.io);
  }
  next();
};

const server = {
  start: async () => {
    await auth.start();
    await db.connect();
    let loadedSchema = schema;

    //Cors configurations can be added to allow just connections from certan domains.
    var allowedOrigins = ["http://localhost:9000"];

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
      }),
      setIOInReq
    );

    app.use(
      "/graphql",
      cookieParser(),
      auth.verifyToken,
      graphqlHTTP((req, res, graphQLParams) => {
        return { schema, graphiql: true, context: { req, res } };
      })
    );

    app.use("/socketTest", (req, res) => {
      res.sendFile(path.join(__dirname, "socketTest.html"));
    });

    app.use("*", (req, res) => {
      res.send("404 Not Found");
    });

    http.listen(process.env.PORT, () => {
      console.info(`Listening on port ${process.env.PORT}`);
    });
  },
};

module.exports = server;
