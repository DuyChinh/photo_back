var express = require("express");
var router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.patch("/:username", authController.changePassword);
router.get("/profile", authMiddleware, authController.profile);
router.post("/logout", authMiddleware, authController.logout);
router.post("/google/signin", authController.googleSignIn);

module.exports = router;
