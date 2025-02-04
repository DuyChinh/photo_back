var express = require("express");
var router = express.Router();
const { Comment } = require("../models/index");

router.post("/", async (req, res) => {
  const body = req.body;
  const response = {};
  try {
    const comment = await Comment.create(body);
    Object.assign(response, {
      status: 200,
      message: "Success",
      data: comment,
    });
  } catch {
    Object.assign(response, {
      status: 500,
      message: "Server Error",
    });
  }
  return res.status(response.status).json(response);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response = {};
  try {
    const comments = await Comment.find({ photo_id: id });
    Object.assign(response, {
      status: 200,
      message: "Success",
      data: comments,
    });
  } catch {
    Object.assign(response, {
      status: 500,
      message: "Server Error",
    });
  }
  return res.status(response.status).json(response);
});

module.exports = router;
