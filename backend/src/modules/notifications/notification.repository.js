const knex = require("../../config/db");

exports.getAllMedicines = async () => {

    return await knex("medicines")
        .select("medicine_id","name","atc_code","safety_stock","target_stock_days");

};

exports.getPrimarySupplier = async (medicineId) => {

    return await knex("medicine_suppliers")
        .where({
            medicine_id: medicineId,
            is_primary: true
        })
        .first();

};

exports.getTotalStock = async (medicineId) => {

    const result = await knex("stock_batches")
        .sum("quantity as total")
        .where("medicine_id", medicineId)
        .first();

    return result.total || 0;

};

exports.getExpiryRiskBatches = async () => {

    return await knex("stock_batches as sb")
        .join("medicines as m","sb.medicine_id","m.medicine_id")
        .select(
            "sb.batch_id",
            "sb.medicine_id",
            "sb.expiry_date",
            "m.name"
        )
        .whereRaw(
            "sb.expiry_date <= CURRENT_DATE + (m.expiry_alert_days || ' days')::interval"
        );

};

exports.getExpiredBatches = async () => {

    return await knex("stock_batches")
        .select("batch_id","medicine_id","expiry_date")
        .where("expiry_date","<=",knex.fn.now());

};

exports.notificationExists = async (medicineId,type) => {

    const row = await knex("notifications")
        .where({
            medicine_id:medicineId,
            alert_type:type,
            is_resolved:false
        })
        .first();

    return !!row;

};

exports.insertNotification = async (data) => {

    return await knex("notifications").insert(data);

};

exports.getNotifications = async (type) => {

    const query = knex("notifications as n")
        .join("medicines as m","n.medicine_id","m.medicine_id")
        .select(
            "n.notification_id",
            "n.alert_type",
            "n.reorder_point",
            "n.predicted_daily_velocity",
            "n.created_at",
            "m.name as medicine_name"
        )
        .where("n.is_resolved", false) // ⭐ ADD THIS
        .orderBy("n.created_at","desc");

    if(type){
        query.where("n.alert_type",type);
    }

    return await query;

};

exports.resolveNotification = async (notificationId) => {

    // ❗ Edge case: invalid ID
    if (!notificationId) {
        throw new Error("Invalid notification ID");
    }

    // Check if notification exists
    const existing = await knex("notifications")
        .where({ notification_id: notificationId })
        .first();

    if (!existing) {
        return null; // not found
    }

    // If already resolved → do nothing
    if (existing.is_resolved) {
        return { alreadyResolved: true };
    }

    // Update
    await knex("notifications")
        .where({ notification_id: notificationId })
        .update({
            is_resolved: true
        });

    return { success: true };
};

exports.clearAllNotifications = async () => {

    const updated = await knex("notifications")
        .where({ is_resolved: false })
        .update({
            is_resolved: true
        });

    return updated; // number of rows updated
};

exports.getLowStockNotifications = async () => {

    return await knex("notifications as n")
        .join("medicines as m", "n.medicine_id", "m.medicine_id")
        .leftJoin("stock_batches as sb", "m.medicine_id", "sb.medicine_id")

        .where("n.alert_type", "Low Stock")
        .andWhere("n.is_resolved", false)

        .groupBy(
            "n.notification_id",
            "m.name",
            "n.reorder_point",
            "n.created_at"
        )

        .select(
            "n.notification_id",
            "m.name as medicine_name",
            "n.reorder_point",
            "n.created_at",

            // 🔥 THIS IS THE FIX
            knex.raw("COALESCE(SUM(sb.quantity), 0) as current_stock")
        )

        .orderBy("n.created_at", "desc");
};
exports.getExpiryNotifications = async () => {

    return await knex("notifications as n")
        .join("medicines as m", "n.medicine_id", "m.medicine_id")
        .leftJoin("stock_batches as sb", "n.batch_id", "sb.batch_id")
        .select(
            "n.notification_id",
            "n.alert_type",
            "n.created_at",
            "m.name as medicine_name",
            "sb.batch_number",
            "sb.expiry_date"
        )
        .whereIn("n.alert_type", ["Expired", "Expiry Risk"])
        .andWhere("n.is_resolved", false)
        .orderBy("n.created_at", "desc");

};