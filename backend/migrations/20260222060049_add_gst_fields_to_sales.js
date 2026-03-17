exports.up = async function (knex) {
  await knex.schema.alterTable("sales_master", (table) => {
    table.decimal("total_taxable_amount", 15, 2).defaultTo(0);
    table.decimal("total_gst_amount", 15, 2).defaultTo(0);
  });

  await knex.schema.alterTable("sales_items", (table) => {
    table.decimal("gst_rate", 5, 2);
    table.decimal("taxable_amount", 12, 2);
    table.decimal("gst_amount", 12, 2);
    table.decimal("line_total", 12, 2);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("sales_master", (table) => {
    table.dropColumn("total_taxable_amount");
    table.dropColumn("total_gst_amount");
  });

  await knex.schema.alterTable("sales_items", (table) => {
    table.dropColumn("gst_rate");
    table.dropColumn("taxable_amount");
    table.dropColumn("gst_amount");
    table.dropColumn("line_total");
  });
};