const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware'); 
const notificationController = require('../controllers/notification.controller');

router.get("/:user_id", authMiddleware, notificationController.getNotificationByUserId);

module.exports = router;