exports.up = async function (knex) {
  await knex.schema.alterTable("stock_batches", (table) => {
    table
      .integer("supplier_id")
      .references("supplier_id")
      .inTable("suppliers")
      .onDelete("SET NULL");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("stock_batches", (table) => {
    table.dropColumn("supplier_id");
  });
};