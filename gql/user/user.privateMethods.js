const bcrypt = require("bcrypt");
const { societyModel } = require("../society/society.model");
const saltRounds = 10;

const updateSocieties = (thisUser) => {
  console.log("updating societies, this is:", thisUser);
  thisUser.societies.forEach((element) => {
    societyModel.findById(element).then((soc) => {
      console.log("updating, this is:", thisUser);
      if (!soc.players.includes(thisUser._id)) {
        soc.players.push(thisUser._id);
      }
      soc.save();
    });
  });
};

const hashPassword = async (thisUser) => {
  if (thisUser.password) {
    if (thisUser.password.length < 25) {
      console.log("users password has been hashed in pre save hook");
      const hashpassword = await bcrypt.hash(thisUser.password, saltRounds);
      thisUser.password = hashpassword;
      thisUser.save();
    }
  }
};

module.exports = { updateSocieties, hashPassword };
