const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.service");

const addBookmark = async ({ shopId, username }) => {
  try {
    let insertBookmark = await MongoDB.db
      .collection(mongoConfig.collections.BOOKMARKS)
      .insertOne({ shopId, username });
    if (insertBookmark.insertedId) {
      let bookmarkResponse = await getBookmarks({ username });
      return {
        status: true,
        message: "Bookmark added Successfully",
        data: bookmarkResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Added to Cart Failed",
    };
  }
};

const removeBookmark = async ({ shopId, username }) => {
  try {
    let removedBookmark = await MongoDB.db
      .collection(mongoConfig.collections.BOOKMARKS)
      .deleteOne({ shopId, username });
    if (removedBookmark?.deletedCount > 0) {
      let bookmarkResponse = await getBookmarks({ username });
      return {
        status: true,
        message: "Bookmark Removed Successfully",
        data: bookmarkResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Bookmark Removed Failed",
    };
  }
};

const getBookmarks = async ({ username }) => {
  try {
    let bookmarks = await MongoDB.db
      .collection(mongoConfig.collections.BOOKMARKS)
      .aggregate([
        {
          $match: {
            username: username,
          },
        },
        {
          $lookup: {
            from: "flower shops",
            localField: "shopId",
            foreignField: "id",
            as: "flower shop",
          },
        },
        {
          $unwind: {
            path: "$flower shop",
          },
        },
      ])
      .toArray();
    if (bookmarks?.length > 0) {
      return {
        status: true,
        message: "Bookmarks fetched Successfully",
        data: bookmarks,
      };
    } else {
      return {
        status: false,
        message: "Bookmarks not found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Bookmarks fetching Failed",
    };
  }
};

module.exports = { addBookmark, removeBookmark, getBookmarks };
