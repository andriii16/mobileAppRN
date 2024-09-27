const config = require("./package.json").projectConfig;
module.exports = {
  mongoConfig: {
    connectionUrl: config.mongoConnectionUrl,
    database: "ReactNativeAppDatabase",
    collections: {
      USERS: "users",
      SHOPS: "flower shops",
      CARTS: "carts",
      FLOWERS: "flowers",
      BOOKMARKS: "bookmarks",
    },
  },
  serverConfig: {
    ip: config.serverIp,
    port: config.serverPort,
  },
  tokenSecret: "reactNativeAppSecret",
};
