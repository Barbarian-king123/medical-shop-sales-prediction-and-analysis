const repo = require("./notification.repository");
const { forecast } = require("../../services/mlService");

exports.getNotifications = async (type) => {
    return await repo.getNotifications(type);
};



exports.checkExpiryNotifications = async () => {

    const expired = await repo.getExpiredBatches();

    for (const batch of expired) {

        const exists = await repo.notificationExists(
            batch.medicine_id,
            "Expired"
        );

        if (!exists) {

            await repo.insertNotification({
                medicine_id: batch.medicine_id,
                batch_id: batch.batch_id,
                alert_type: "Expired",
                created_at: new Date()
            });

            console.log("Expired notification created for batch", batch.batch_id);
        }
    }


    const expiryRisk = await repo.getExpiryRiskBatches();

    for (const batch of expiryRisk) {

        const exists = await repo.notificationExists(
            batch.medicine_id,
            "Expiry Risk"
        );

        if (!exists) {

            await repo.insertNotification({
                medicine_id: batch.medicine_id,
                batch_id: batch.batch_id,
                alert_type: "Expiry Risk",
                created_at: new Date()
            });

            console.log("Expiry risk notification created for batch", batch.batch_id);
        }
    }

};




exports.checkLowStockNotifications = async () => {

    const medicines = await repo.getAllMedicines();

    for (const medicine of medicines) {

        console.log("Processing medicine:", medicine.name);

        if (!medicine.atc_code) {
            console.log("Skipping medicine without ATC:", medicine.name);
            continue;
        }

        const supplier = await repo.getPrimarySupplier(
            medicine.medicine_id
        );

        if (!supplier) {
            console.log("No primary supplier for", medicine.name);
            continue;
        }

        const leadTime = Number(supplier.lead_time_days) || 3;

        const currentStock = Number(
            await repo.getTotalStock(medicine.medicine_id)
        ) || 0;

        let forecastResult;

        try {

            forecastResult = await forecast(
                medicine.atc_code,
                leadTime
            );

        } catch (err) {

            console.error(
                "ML Forecast failed for",
                medicine.atc_code,
                err.message
            );

            continue;
        }

        console.log("Forecast Result:", forecastResult);

        const predictedDemand = Number(
            forecastResult?.restock_quantity
        ) || 0;

        const safetyStock = Number(medicine.safety_stock) || 20;

        // FIX: reorder point must be integer
        const reorderPoint = Math.ceil(
            predictedDemand + safetyStock
        );

        console.log({
            medicine: medicine.name,
            leadTime,
            currentStock,
            predictedDemand,
            safetyStock,
            reorderPoint
        });

        if (currentStock < reorderPoint) {

            const exists = await repo.notificationExists(
                medicine.medicine_id,
                "Low Stock"
            );

            if (exists) {
                console.log("Notification already exists for", medicine.name);
                continue;
            }

            // FIX: suggested quantity must be integer
            const suggestedQuantity = Math.ceil(
                Math.max(reorderPoint - currentStock, 0)
            );

            try {

                await repo.insertNotification({

                    medicine_id: medicine.medicine_id,
                    supplier_id: supplier.supplier_id,
                    alert_type: "Low Stock",
                    predicted_daily_velocity: predictedDemand,
                    reorder_point: reorderPoint,
                    suggested_quantity: suggestedQuantity,
                    created_at: new Date()

                });

                console.log(
                    "Low stock notification created for",
                    medicine.name
                );

            } catch (err) {

                console.error(
                    "Failed inserting notification:",
                    err.message
                );

            }

        } else {

            console.log(
                "Stock sufficient for",
                medicine.name
            );

        }

    }

};
exports.resolveNotification = async (notificationId) => {

    try {

        const id = Number(notificationId);

        // ❗ Edge case: invalid ID
        if (!id || isNaN(id)) {
            throw new Error("Invalid notification ID");
        }

        const result = await repo.resolveNotification(id);

        // ❗ Not found
        if (result === null) {
            return {
                success: false,
                message: "Notification not found"
            };
        }

        // ❗ Already resolved
        if (result.alreadyResolved) {
            return {
                success: true,
                message: "Already resolved"
            };
        }

        return {
            success: true,
            message: "Notification resolved successfully"
        };

    } catch (err) {

        console.error("Service resolve error:", err.message);

        return {
            success: false,
            message: "Failed to resolve notification"
        };
    }

};
exports.clearAllNotifications = async () => {

    try {

        const updatedCount = await repo.clearAllNotifications();

        return {
            success: true,
            message: `${updatedCount} notifications cleared`
        };

    } catch (err) {

        console.error("Service clear all error:", err.message);

        return {
            success: false,
            message: "Failed to clear notifications"
        };
    }

};
exports.getLowStockNotifications = async () => {
    return await repo.getLowStockNotifications();
};

exports.getExpiryNotifications = async () => {
    return await repo.getExpiryNotifications();
};