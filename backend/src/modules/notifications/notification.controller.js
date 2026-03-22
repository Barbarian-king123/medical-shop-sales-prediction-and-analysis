const service = require("./notification.service");

/* =============================== */
/* GET ALL / FILTERED NOTIFICATIONS */
/* =============================== */
exports.getNotifications = async (req, res) => {
    try {

        const { type } = req.query;

        const notifications = await service.getNotifications(type);

        return res.status(200).json(notifications);

    } catch (err) {

        console.error("Get notifications error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });

    }
};

/* =============================== */
/* RUN EXPIRY CHECK */
/* =============================== */
exports.runExpiryCheck = async (req, res) => {
    try {

        await service.checkExpiryNotifications();

        return res.status(200).json({
            success: true,
            message: "Expiry notifications generated successfully"
        });

    } catch (err) {

        console.error("Expiry check error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Failed to generate expiry notifications"
        });

    }
};

/* =============================== */
/* RUN LOW STOCK CHECK */
/* =============================== */
exports.runStockCheck = async (req, res) => {
    try {

        await service.checkLowStockNotifications();

        return res.status(200).json({
            success: true,
            message: "Low stock notifications generated successfully"
        });

    } catch (err) {

        console.error("Stock check error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to generate stock notifications"
        });

    }
};

/* =============================== */
/* OPTIONAL: RUN ALL CHECKS 🔥 */
/* =============================== */
exports.runAllChecks = async (req, res) => {
    try {

        await service.checkExpiryNotifications();
        await service.checkLowStockNotifications();

        return res.status(200).json({
            success: true,
            message: "All notifications generated successfully"
        });

    } catch (err) {

        console.error("Run all checks error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to generate notifications"
        });

    }
};

/* =============================== */
/* RESOLVE SINGLE NOTIFICATION */
/* =============================== */
exports.resolveNotification = async (req, res) => {
    try {

        const id = req.params.id;

        const result = await service.resolveNotification(id);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (err) {

        console.error("Resolve notification error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to resolve notification"
        });

    }
};

/* =============================== */
/* CLEAR ALL NOTIFICATIONS */
/* =============================== */
exports.clearAllNotifications = async (req, res) => {
    try {

        const result = await service.clearAllNotifications();

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (err) {

        console.error("Clear all notifications error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to clear notifications"
        });

    }
};

/* =============================== */
/* GET LOW STOCK */
/* =============================== */
exports.getLowStockNotifications = async (req, res) => {
    try {

        const data = await service.getLowStockNotifications();

        return res.status(200).json(data);

    } catch (err) {

        console.error("Low stock fetch error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch low stock notifications"
        });

    }
};

/* =============================== */
/* GET EXPIRY */
/* =============================== */
exports.getExpiryNotifications = async (req, res) => {
    try {

        const data = await service.getExpiryNotifications();

        return res.status(200).json(data);

    } catch (err) {

        console.error("Expiry fetch error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch expiry notifications"
        });

    }
};