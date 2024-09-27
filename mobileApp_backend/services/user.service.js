const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getUserData = async (username) => {
  try {
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .findOne({ username });

    if (userObject) {
      return {
        status: true,
        message: "Korisnik je uspješno pronađen",
        data: userObject,
      };
    } else {
      return {
        status: false,
        message: "Korisnik nije pronađen",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Nešto nije u redu.",
      error: `Pronalaženje korisnika nije uspjelo : ${error?.message}`,
    };
  }
};

module.exports = { getUserData };
