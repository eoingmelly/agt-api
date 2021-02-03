const server = require("./server");
const dotenv = require("dotenv");
const path = require("path");

//dev = development; prod = production
const env = "dev";

let environment = dotenv.config({
  path: path.join(__dirname, `/environment/${env}.env`),
});

if (environment.error) {
  throw environment.error;
}
//test it appears on remote server
server.start();
// To use the variables defined in the .env files use: process.env.{variable name}
