var express = require("express");
var router = express.Router();
const photoController = require("../controllers/photo.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, photoController.getPhotoByUserId);
router.get("/:id", authMiddleware, photoController.getPhotoById);

module.exports = router;
