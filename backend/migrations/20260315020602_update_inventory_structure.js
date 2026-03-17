exports.up = async function(knex) {

  // 1️⃣ Remove lead_time_days from suppliers
  await knex.schema.alterTable("suppliers", (table) => {
    table.dropColumn("lead_time_days");
  });

  // 2️⃣ Add lead_time_days to medicine_suppliers
  await knex.schema.alterTable("medicine_suppliers", (table) => {
    table.integer("lead_time_days").notNullable().defaultTo(3);
  });

  // 3️⃣ Add safety_stock to medicines
  await knex.schema.alterTable("medicines", (table) => {
    table.integer("safety_stock").notNullable().defaultTo(10);
  });

};

exports.down = async function(knex) {

  // rollback safety_stock
  await knex.schema.alterTable("medicines", (table) => {
    table.dropColumn("safety_stock");
  });

  // rollback lead_time_days in medicine_suppliers
  await knex.schema.alterTable("medicine_suppliers", (table) => {
    table.dropColumn("lead_time_days");
  });

  // restore lead_time_days in suppliers
  await knex.schema.alterTable("suppliers", (table) => {
    table.integer("lead_time_days").defaultTo(3);
  });

};