exports.up = async function (knex) {

  await knex.raw(`
    ALTER TYPE purchase_orders_status_enum
    ADD VALUE IF NOT EXISTS 'Partially Delivered'
  `);

};

exports.down = async function () {
  // PostgreSQL cannot easily remove enum values
};