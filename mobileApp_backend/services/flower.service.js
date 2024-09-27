const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getOneFlowerById = async (flowerId) => {
  try {
    let flower = await MongoDB.db
      .collection(mongoConfig.collections.FLOWERS)
      .findOne({ id: flowerId });
    if (flower) {
      return {
        status: true,
        message: "Proizvod pronadjen uspjesno",
        data: flower,
      };
    } else {
      return {
        status: false,
        message: "Proizvod nije pronadjen",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Pronalazenje proizvoda nije uspjelo",
      error: `Pronalazenje proizvoda nije uspjelo : ${error?.message}`,
    };
  }
};

module.exports = { getOneFlowerById };
