exports.up = async function (knex) {
  await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'purchase_orders_status_enum') THEN
        CREATE TYPE purchase_orders_status_enum AS ENUM ('Pending', 'Ordered', 'Delivered', 'Cancelled', 'Partially Delivered');
      ELSE
        ALTER TYPE purchase_orders_status_enum ADD VALUE IF NOT EXISTS 'Partially Delivered';
      END IF;
    END $$;
  `);
};

exports.down = async function () {};