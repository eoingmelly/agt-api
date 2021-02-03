const { loadFilesSync } = require("@graphql-tools/load-files");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const utils = {
  // This function can be also modified to load all .graphql files at once
  // and return the array to merge later.
  loadGQLFile: (name, folder = "gql") => {
    let schema = loadFilesSync(path.join(process.cwd(), folder, name), {
      extensions: ["graphql"],
    });
    return schema[0];
  },
  // Load file can be used to load any kind of file, but by default
  // it will load files on the "gql" folder
  loadFile: (name, folder = "gql") => {
    const filePath = path.join(process.cwd(), folder, name);
    return fs.readFileSync(filePath, "utf-8");
  },
  getDateInNumbers: () => {
    const date = new Date();
    return Date.parse(date);
  },
};

module.exports = utils;
