exports.up = async function (knex) {
  await knex.schema.createTable("purchase_orders", (table) => {
    table.increments("po_id").primary();
    table
      .integer("supplier_id")
      .notNullable()
      .references("supplier_id")
      .inTable("suppliers");

    table
      .integer("ordered_by")
      .references("user_id")
      .inTable("users");

    table.timestamp("order_date").defaultTo(knex.fn.now());
    table.string("status", 20).defaultTo("Pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("purchase_order_items", (table) => {
    table.increments("item_id").primary();

    table
      .integer("po_id")
      .notNullable()
      .references("po_id")
      .inTable("purchase_orders")
      .onDelete("CASCADE");

    table
      .integer("medicine_id")
      .notNullable()
      .references("medicine_id")
      .inTable("medicines");

    table.integer("quantity").notNullable();
    table.decimal("unit_price", 12, 2);
    table.decimal("line_total", 12, 2);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("purchase_order_items");
  await knex.schema.dropTableIfExists("purchase_orders");
};