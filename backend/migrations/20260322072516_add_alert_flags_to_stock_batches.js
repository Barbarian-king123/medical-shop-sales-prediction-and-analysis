exports.up = async function (knex) {
    await knex.schema.alterTable("stock_batches", function (table) {
        table.boolean("low_stock_alert_sent").defaultTo(false);
        table.boolean("expiry_risk_alert_sent").defaultTo(false);
        table.boolean("expired_alert_sent").defaultTo(false);
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable("stock_batches", function (table) {
        table.dropColumn("low_stock_alert_sent");
        table.dropColumn("expiry_risk_alert_sent");
        table.dropColumn("expired_alert_sent");
    });
};