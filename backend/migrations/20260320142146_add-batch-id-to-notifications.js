exports.up = async function(knex) {
    await knex.schema.alterTable("notifications", (table) => {
        table.integer("batch_id").nullable();

        // Optional FK (recommended)
        table
            .foreign("batch_id")
            .references("batch_id")
            .inTable("stock_batches")
            .onDelete("SET NULL");
    });
};

exports.down = async function(knex) {
    await knex.schema.alterTable("notifications", (table) => {
        table.dropColumn("batch_id");
    });
};