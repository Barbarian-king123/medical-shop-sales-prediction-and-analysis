const service = require("./notification.service");

// ===============================
// GET NOTIFICATIONS
// ===============================
exports.getNotifications = async (req, res) => {

    try {

        const { type } = req.query;

        const notifications = await service.getNotifications(type);

        res.json(notifications);

    } catch (err) {

        console.error("Get notifications error:", err);

        res.status(500).json({
            message: "Failed to fetch notifications"
        });

    }

};


// ===============================
// RUN EXPIRY CHECK
// ===============================
exports.runExpiryCheck = async (req, res) => {

    try {

        await service.checkExpiryNotifications();

        res.json({
            message: "Expiry notifications generated"
        });

    } catch (err) {

        console.error("Expiry check error:", err);

        res.status(500).json({
            message: err.message
        });

    }

};


// ===============================
// RUN STOCK CHECK
// ===============================
exports.runStockCheck = async (req, res) => {

    try {

        await service.checkLowStockNotifications();

        res.json({
            message: "Low stock notifications generated"
        });

    } catch (err) {

        console.error("Stock check error:", err);

        res.status(500).json({
            message: "Failed to generate stock notifications"
        });

    }

};


// ===============================
// RESOLVE SINGLE NOTIFICATION
// ===============================
exports.resolveNotification = async (req, res) => {

    try {

        const id = req.params.id;

        const result = await service.resolveNotification(id);

        // ❗ Handle failure cases
        if (!result.success) {
            return res.status(400).json({
                message: result.message
            });
        }

        res.json({
            message: result.message
        });

    } catch (err) {

        console.error("Resolve notification error:", err);

        res.status(500).json({
            message: "Failed to resolve notification"
        });

    }

};


// ===============================
// CLEAR ALL NOTIFICATIONS
// ===============================
exports.clearAllNotifications = async (req, res) => {

    try {

        const result = await service.clearAllNotifications();

        if (!result.success) {
            return res.status(500).json({
                message: result.message
            });
        }

        res.json({
            message: result.message
        });

    } catch (err) {

        console.error("Clear all notifications error:", err);

        res.status(500).json({
            message: "Failed to clear notifications"
        });

    }

};
// LOW STOCK
exports.getLowStockNotifications = async (req, res) => {

    try {

        const data = await service.getLowStockNotifications();

        res.json(data);

    } catch (err) {

        console.error("Low stock fetch error:", err);

        res.status(500).json({
            message: "Failed to fetch low stock notifications"
        });

    }

};


// EXPIRY
exports.getExpiryNotifications = async (req, res) => {

    try {

        const data = await service.getExpiryNotifications();

        res.json(data);

    } catch (err) {

        console.error("Expiry fetch error:", err);

        res.status(500).json({
            message: "Failed to fetch expiry notifications"
        });

    }

};