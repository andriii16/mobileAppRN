var express = require("express");
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
} = require("../services/bookmark.service");
var router = express.Router();

router.get("/", async (req, res) => {
  let username = req?.username;
  let response = await getBookmarks({ username });
  res.json(response);
});

router.post("/:shopId", async (req, res) => {
  let { shopId } = req?.params;
  let username = req?.username;
  let response = await addBookmark({ shopId, username });
  res.json(response);
});

router.delete("/:shopId", async (req, res) => {
  let { shopId } = req?.params;
  let username = req?.username;
  let response = await removeBookmark({ shopId, username });
  res.json(response);
});

module.exports = router;
