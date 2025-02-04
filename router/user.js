var express = require("express");
var router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", userController.getUser);
router.get("/:id", authMiddleware, userController.getUserById);
router.patch("/:username", userController.changePassword);

module.exports = router;
