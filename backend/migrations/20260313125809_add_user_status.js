exports.up = function(knex) {

  return knex.schema.alterTable("users", function(table){

    table
      .boolean("is_active")
      .notNullable()
      .defaultTo(true);

  });

};

exports.down = function(knex) {

  return knex.schema.alterTable("users", function(table){

    table.dropColumn("is_active");

  });

};