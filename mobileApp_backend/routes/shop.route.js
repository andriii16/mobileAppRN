var express = require("express");
const { getAllShops, getOneShopById } = require("../services/shop.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let response = await getAllShops();
  res.json(response);
});

router.get("/:shopId", async (req, res) => {
  let shopId = req?.params?.shopId;
  let response = await getOneShopById(shopId);
  res.json(response);
});

module.exports = router;
