var express = require("express");
var router = express.Router();
const { Photo } = require("../models/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  const response = {};
  const token = req.get("Authorization")?.split(" ")[1];
  const { JWT_SECRET } = process.env;
  const { userId } = jwt.verify(token, JWT_SECRET);
  if (!req.file?.filename) {
    return res.status(500).json({ status: 500, message: "Server Error" });
  }
  const body = {
    user_id: userId,
    img: req.file?.filename,
  };
  await Photo.create(body)
    .then((res) => {
      Object.assign(response, {
        status: 200,
        message: "Upload Success",
        data: res,
      });
    })
    .catch((e) => {
      Object.assign(response, {
        status: 500,
        message: "Upload failed! Server Error!",
      });
    });
  return res.status(response.status).json(response);
});

router.delete("/:id", async (req, res) => {
  const response = {};
  const { id } = req.params;
  try {
    await Photo.deleteOne({ _id: id });
    Object.assign(response, {
      status: 200,
      message: "Delete Success",
    });
  } catch {
    Object.assign(response, {
      status: 500,
      message: "Server Error!",
    });
  }
  return res.status(response.status).json(response);
});

module.exports = router;
