exports.up = async function (knex) {
  // ============================
  // ENUM TYPES
  // ============================


  // ============================
  // USERS
  // ============================

  await knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary();
    table.string("username", 50).unique().notNullable();
    table.text("password_hash").notNullable();
    table
      .enu("role", ["Owner", "Pharmacist", "Staff"], {
        useNative: true,
        enumName: "user_role",
      })
      .defaultTo("Staff");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // ============================
  // SUPPLIERS
  // ============================

  await knex.schema.createTable("suppliers", (table) => {
    table.increments("supplier_id").primary();
    table.string("supplier_name", 150).notNullable();
    table.string("phone", 20);
    table.string("email", 100);
    table.integer("lead_time_days").defaultTo(3);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // ============================
  // MEDICINES
  // ============================

  await knex.schema.createTable("medicines", (table) => {
    table.increments("medicine_id").primary();
    table.string("name", 100).notNullable();
    table.string("generic_name", 100);
    table.string("atc_code", 15);
    table.string("hsn_code", 12);
    table.decimal("gst_rate", 5, 2).defaultTo(12.0);
    table.integer("target_stock_days").defaultTo(30);
    table.integer("expiry_alert_days").defaultTo(60);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("medicines", (table) => {
    table.index("name", "idx_medicine_name");
  });

  // ============================
  // MEDICINE SUPPLIERS
  // ============================

  await knex.schema.createTable("medicine_suppliers", (table) => {
    table.increments("id").primary();
    table
      .integer("medicine_id")
      .references("medicine_id")
      .inTable("medicines")
      .onDelete("CASCADE")
      .notNullable();
    table
      .integer("supplier_id")
      .references("supplier_id")
      .inTable("suppliers")
      .onDelete("CASCADE")
      .notNullable();
    table.decimal("last_purchase_price", 12, 2);
    table.boolean("is_primary").defaultTo(false);
    table.unique(["medicine_id", "supplier_id"]);
  });

  // ============================
  // STOCK BATCHES
  // ============================

  await knex.schema.createTable("stock_batches", (table) => {
    table.increments("batch_id").primary();
    table
      .integer("medicine_id")
      .references("medicine_id")
      .inTable("medicines")
      .onDelete("CASCADE")
      .notNullable();
    table.string("batch_number", 50).notNullable();
    table.date("mfg_date");
    table.date("expiry_date").notNullable();
    table.integer("quantity").notNullable();
    table.decimal("purchase_price", 12, 2);
    table.decimal("mrp", 12, 2).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["medicine_id", "batch_number"]);
    table.check("quantity >= 0");
    table.check("mrp > 0");
  });

  await knex.schema.alterTable("stock_batches", (table) => {
    table.index("expiry_date", "idx_batch_expiry");
    table.index("medicine_id", "idx_batch_medicine");
  });

  // ============================
  // STOCK MOVEMENTS
  // ============================

  await knex.schema.createTable("stock_movements", (table) => {
    table.increments("movement_id").primary();
    table
      .integer("batch_id")
      .references("batch_id")
      .inTable("stock_batches")
      .onDelete("CASCADE")
      .notNullable();
    table.integer("change_qty").notNullable();
    table
      .enu("reason", ["Sale", "Purchase", "Adjustment", "Expired"], {
        useNative: true,
        enumName: "stock_movement_reason",
      })
      .notNullable();
    table.integer("reference_id");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // ============================
  // SALES MASTER
  // ============================

  await knex.schema.createTable("sales_master", (table) => {
    table.increments("invoice_id").primary();
    table
      .integer("user_id")
      .references("user_id")
      .inTable("users");
    table.timestamp("sale_date").defaultTo(knex.fn.now());
    table.decimal("total_sale_amount", 15, 2).notNullable();
    table.check("total_sale_amount >= 0");
  });

  await knex.schema.alterTable("sales_master", (table) => {
    table.index("sale_date", "idx_sales_date");
  });

  // ============================
  // SALES ITEMS
  // ============================

  await knex.schema.createTable("sales_items", (table) => {
    table.increments("item_id").primary();
    table
      .integer("invoice_id")
      .references("invoice_id")
      .inTable("sales_master")
      .onDelete("CASCADE")
      .notNullable();
    table
      .integer("medicine_id")
      .references("medicine_id")
      .inTable("medicines")
      .notNullable();
    table
      .integer("batch_id")
      .references("batch_id")
      .inTable("stock_batches")
      .notNullable();
    table.integer("quantity").notNullable();
    table.decimal("unit_price", 12, 2).notNullable();
    table.check("quantity > 0");
    table.check("unit_price >= 0");
  });

  // ============================
  // NOTIFICATIONS
  // ============================

  await knex.schema.createTable("notifications", (table) => {
    table.increments("notification_id").primary();
    table
      .integer("medicine_id")
      .references("medicine_id")
      .inTable("medicines")
      .onDelete("CASCADE")
      .notNullable();
    table
      .integer("supplier_id")
      .references("supplier_id")
      .inTable("suppliers");
    table
      .enu("alert_type", ["Low Stock", "Expiry Risk"], {
        useNative: true,
        enumName: "alert_type",
      })
      .notNullable();
    table.decimal("predicted_daily_velocity", 10, 2);
    table.integer("reorder_point");
    table.integer("suggested_quantity");
    table.boolean("is_resolved").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("notifications", (table) => {
    table.index("medicine_id", "idx_notification_medicine");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("notifications");
  await knex.schema.dropTableIfExists("sales_items");
  await knex.schema.dropTableIfExists("sales_master");
  await knex.schema.dropTableIfExists("stock_movements");
  await knex.schema.dropTableIfExists("stock_batches");
  await knex.schema.dropTableIfExists("medicine_suppliers");
  await knex.schema.dropTableIfExists("medicines");
  await knex.schema.dropTableIfExists("suppliers");
  await knex.schema.dropTableIfExists("users");

  await knex.raw(`DROP TYPE IF EXISTS stock_movement_reason;`);
  await knex.raw(`DROP TYPE IF EXISTS alert_type;`);
  await knex.raw(`DROP TYPE IF EXISTS user_role;`);
};