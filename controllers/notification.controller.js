const { Notification } = require('../models');

module.exports = {
    getNotificationByUserId: async (req, res) => {
        const { user_id } = req.params;
        try {
            const notifications = await Notification.find({ user_id }).sort({ created_at: -1 });
            return res.status(200).json({
                status: 200,
                message: "Notifications retrieved successfully",
                data: notifications,
              });
        } catch (error) {
            return res.status(200).json({
                status: 200,
                message: "Notifications retrieved successfully",
                data: notifications,
              });
        }
    },   
    
    getNotiByUserIdUnRead: async (req, res) => {
        const { user_id } = req.params;
        try {
            const notifications = await Notification.find({ user_id, read: false }).sort({ created_at: -1 });
            return res.status(200).json({
                status: 200,
                message: "Notifications retrieved successfully",
                data: notifications,
              });
        } catch (error) {
            return res.status(200).json({
                status: 200,
                message: "Notifications retrieved successfully",
                data: notifications,
              });
        }
    },

    markAsRead: async (req, res) => {
        const { id } = req.params;
        try {
            const notification = await Notification.findById(id);
            notification.read = true;
            await notification.save();
            return res.status(200).json({
                status: 200,
                message: "Notification marked as read successfully",
              });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: "Error marking notification as read",
              });
        }
    },

    markAsReadAll: async (req, res) => {
        const { user_id } = req.params;
        try {
            const notifications = await Notification.find({ user_id, read: false });
            notifications.forEach(async (notification) => {
                notification.read = true;
                await notification.save();
            });
            return res.status(200).json({
                status: 200,
                message: "All notifications marked as read successfully",
              });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: "Error marking all notifications as read",
              });
        }
    }
};