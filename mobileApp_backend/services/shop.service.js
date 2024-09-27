const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const getAllShops = async () => {
  try {
    let shops = await MongoDB.db
      .collection(mongoConfig.collections.SHOPS)
      .find()
      .toArray();

    if (shops && shops?.length > 0) {
      return {
        status: true,
        message: "Cvjecare pronadjene uspjesno",
        data: shops,
      };
    } else {
      return {
        status: false,
        message: "Cvjecare nisu pronadjene",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Pronalazenje cvjecara nije uspjelo",
      error: `Pronalazenje cvjecara nije uspjelo : ${error?.message}`,
    };
  }
};

const getOneShopById = async (shopId) => {
  try {
    let shop = await MongoDB.db
      .collection(mongoConfig.collections.SHOPS)
      .aggregate([
        {
          $match: {
            id: shopId,
          },
        },
        {
          $lookup: {
            from: "flowers",
            localField: "id",
            foreignField: "shopId",
            as: "flowers",
          },
        },
      ])
      .toArray();
    if (shop && shop?.length > 0) {
      return {
        status: true,
        message: "Cvjećara uspješno pronađena",
        data: shop[0],
      };
    } else {
      return {
        status: false,
        message: "Cvjećara nije pronađena",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Pronalaženje cvjećare nije uspjelo",
      error: `Pronalaženje cvjećare nije uspjelo : ${error?.message}`,
    };
  }
};

module.exports = { getAllShops, getOneShopById };
