var express = require("express");
const {
  addToCart,
  removeFromCart,
  getCartItems,
} = require("../services/cart.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let username = req?.username;
  let response = await getCartItems({ username });
  res.json(response);
});

router.post("/:flowerId", async (req, res) => {
  let { flowerId } = req?.params;
  let username = req?.username;
  let response = await addToCart({ flowerId, username });
  res.json(response);
});

router.delete("/:flowerId", async (req, res) => {
  let { flowerId } = req?.params;
  let username = req?.username;
  let response = await removeFromCart({ flowerId, username });
  res.json(response);
});

module.exports = router;
