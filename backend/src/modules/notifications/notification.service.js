const repo = require("./notification.repository");
const { forecast } = require("../../services/mlService");

/* ================= GET ================= */

exports.getNotifications = async (type) => {
    return await repo.getNotifications(type);
};

/* ================= EXPIRY ================= */

exports.checkExpiryNotifications = async () => {

    // 🔥 1. EXPIRED
    const expired = await repo.getExpiredBatches();

    for (const batch of expired) {

        await repo.insertNotification({
            medicine_id: batch.medicine_id,
            batch_id: batch.batch_id,
            alert_type: "Expired",
            is_resolved: false,
            created_at: new Date()
        });

        await repo.markExpiredAlertSent(batch.batch_id);

        console.log("✅ Expired notification created:", batch.batch_id);
    }

    // ⚠️ 2. EXPIRY RISK
    const expiryRisk = await repo.getExpiryRiskBatches();

    for (const batch of expiryRisk) {

        await repo.insertNotification({
            medicine_id: batch.medicine_id,
            batch_id: batch.batch_id,
            alert_type: "Expiry Risk",
            is_resolved: false,
            created_at: new Date()
        });

        await repo.markExpiryRiskAlertSent(batch.batch_id);

        console.log("⚠️ Expiry risk notification created:", batch.batch_id);
    }
};

/* ================= LOW STOCK ================= */

exports.checkLowStockNotifications = async () => {

    const medicines = await repo.getMedicinesWithStock();

    for (const med of medicines) {
        
        

        if (!med.atc_code) {
            console.log("Skipping (no ATC):", med.medicine_id);
            continue;
        }

        const supplier = await repo.getPrimarySupplier(med.medicine_id);

        if (!supplier) {
            console.log("No supplier:", med.medicine_id);
            continue;
        }

        const leadTime = Number(supplier.lead_time_days) || 3;

        let forecastResult;

        try {
            forecastResult = await forecast(
                med.atc_code,
                leadTime
            );
        } catch (err) {
            console.error("Forecast failed:", err.message);
            continue;
        }

        const predictedDemand =
            Number(forecastResult?.restock_quantity) || 0;

        const safetyStock = Number(med.safety_stock) || 20;

        const reorderPoint = Math.ceil(
            predictedDemand + safetyStock
        );

        const currentStock = Number(med.total_stock) || 0;

        // ✅ MAIN CONDITION
        if (currentStock < reorderPoint) {
            // 🔍 Check if already exists
            const existing = await repo.getExistingLowStockNotification(
                med.medicine_id
            );

            if (existing) {
                console.log("⚠️ Already exists, skipping:", med.name);
                continue;
            }

            const suggestedQuantity = Math.ceil(
                reorderPoint - currentStock
            );
            

            await repo.insertNotification({
                medicine_id: med.medicine_id,
                supplier_id: supplier.supplier_id,
                alert_type: "Low Stock",
                predicted_daily_velocity: predictedDemand,
                reorder_point: reorderPoint,
                suggested_quantity: suggestedQuantity,
                is_resolved: false,
                created_at: new Date()
            });

            console.log("📉 Low stock (medicine-level):", med.name);

        } else {
            console.log("✅ Stock OK:", med.name);
        }
    }
};

/* ================= RESOLVE ================= */

exports.resolveNotification = async (notificationId) => {

    try {

        const id = Number(notificationId);

        if (!id || isNaN(id)) {
            throw new Error("Invalid notification ID");
        }

        const result = await repo.resolveNotification(id);

        if (result === null) {
            return {
                success: false,
                message: "Notification not found"
            };
        }

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

        console.error("Resolve error:", err.message);

        return {
            success: false,
            message: "Failed to resolve notification"
        };
    }
};

/* ================= CLEAR ================= */

exports.clearAllNotifications = async () => {

    try {

        const updatedCount = await repo.clearAllNotifications();

        return {
            success: true,
            message: `${updatedCount} notifications cleared`
        };

    } catch (err) {

        console.error("Clear all error:", err.message);

        return {
            success: false,
            message: "Failed to clear notifications"
        };
    }
};

/* ================= FETCH ================= */

exports.getLowStockNotifications = async () => {
    return await repo.getLowStockNotifications();
};

exports.getExpiryNotifications = async () => {
    return await repo.getExpiryNotifications();
};