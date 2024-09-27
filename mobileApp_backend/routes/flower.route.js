var express = require("express");
const { getOneFlowerById } = require("../services/flower.service");
var router = express.Router();

router.get("/:flowerId", async (req, res) => {
  let flowerId = req?.params?.flowerId;
  let response = await getOneFlowerById(flowerId);
  res.json(response);
});

module.exports = router;
