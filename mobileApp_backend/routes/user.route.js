var express = require("express");
const { getUserData } = require("../services/user.service");
const MongoDB = require("../services/mongodb.service");
const { mongoConfig } = require("../config");
var router = express.Router();

router.get("/get-user", async (req, res) => {
  let username = req?.username;
  let response = await getUserData(username);
  res.json(response);
});

router.post("/update-profile-image", async (req, res) => {
  try {
    const { imageUri } = req.body;
    const { username } = req;

    if (!imageUri) {
      return res.status(400).json({
        status: false,
        message: "Image URI is required",
      });
    }

    const updateResult = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .updateOne({ username: username }, { $set: { profileImage: imageUri } });

    if (updateResult.modifiedCount > 0) {
      res.json({
        status: true,
        message: "Profile image updated successfully",
      });
    } else {
      res.json({
        status: false,
        message: "Profile image update failed",
      });
    }
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
