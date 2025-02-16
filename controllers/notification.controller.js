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
};