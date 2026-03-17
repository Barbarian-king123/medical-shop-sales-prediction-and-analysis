exports.up = async function (knex) {
  await knex.schema.alterTable("suppliers", (table) => {
    table.string("contact_person", 100);
    table.text("address");
    table.string("gst_number", 20);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("suppliers", (table) => {
    table.dropColumn("contact_person");
    table.dropColumn("address");
    table.dropColumn("gst_number");
  });
};