var express = require("express");
var router = express.Router();
const { Comment, Photo, Notification, User } = require("../models/index");

router.post("/", async (req, res) => {
  const { user_post_id, user_id, photo_id, parent_id, fullname, username, description } = req.body;
  const response = {};

  try {
    const comment = await Comment.create({
      user_id,
      photo_id,
      parent_id: parent_id || null, 
      fullname,
      username,
      description,
      time: new Date(),
      likes: []
    });
    if(user_id !== user_post_id) {
      Notification.create({ user_id: user_post_id, user_work_id: user_id, title: `Comment photo ${fullname}`, message: `${fullname} has commented on your photo`, read: false, created_at: new Date(), photos: [photo_id] });
    }
    Object.assign(response, {
      status: 200,
      message: "Success",
      data: comment,
    });
  } catch (error) {
    Object.assign(response, {
      status: 500,
      message: "Server Error",
      error: error.message
    });
  }

  return res.status(response.status).json(response);
});


router.get("/:photo_id", async (req, res) => {
  try {
    const { photo_id } = req.params;
    const allComments = await Comment.find({ photo_id }).sort({ time: 1 }).lean();
    const buildCommentTree = (parentId = null) => {
      return allComments
        .filter(comment => String(comment.parent_id) === String(parentId))
        .map(comment => ({
          ...comment,
          replies: buildCommentTree(comment._id) 
        }));
    };

    const commentTree = buildCommentTree(null); 
    res.json({ status: 200, message: "Success", data: commentTree });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server Error", error: error.message });
  }
});


router.post("/like/:id", async (req, res) => {
  const { user_id } = req.body;
  const response = {};

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ status: 404, message: "Comment not found" });
    }

    const index = comment.likes.indexOf(user_id);
    if (index === -1) {
      comment.likes.push(user_id);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();

    Object.assign(response, {
      status: 200,
      message: "Success",
      data: comment,
    });
  } catch (error) {
    Object.assign(response, {
      status: 500,
      message: "Server Error",
      error: error.message
    });
  }

  return res.status(response.status).json(response);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const response = {};

  try {
    await Comment.deleteMany({ $or: [{ _id: id }, { parent_id: id }] });

    Object.assign(response, {
      status: 200,
      message: "Comment and replies deleted successfully",
    });
  } catch (error) {
    Object.assign(response, {
      status: 500,
      message: "Server Error",
      error: error.message
    });
  }

  return res.status(response.status).json(response);
});

module.exports = router;
