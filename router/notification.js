const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware'); 
const notificationController = require('../controllers/notification.controller');

router.get("/:user_id", authMiddleware, notificationController.getNotificationByUserId);
router.get("/unread/:user_id", authMiddleware, notificationController.getNotiByUserIdUnRead);
router.post("/mark-as-read/:id", authMiddleware, notificationController.markAsRead);
router.post("/mark-as-read-all/:user_id", authMiddleware, notificationController.markAsReadAll);
module.exports = router;