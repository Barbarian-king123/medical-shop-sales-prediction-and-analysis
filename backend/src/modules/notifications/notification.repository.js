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
        .orderBy("n.created_at","desc");

    if(type){
        query.where("n.alert_type",type);
    }

    return await query;

};