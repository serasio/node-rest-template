exports.up = (knex) =>
  knex.schema.alterTable('things', (table) => {
    table
      .integer('category_id')
      .unsigned()
      .notNullable();
    table.foreign('category_id').references('categories.id');
  });

exports.down = (knex) =>
  knex.schema.alterTable('things', (table) => {
    table.dropForeign('category_id');
    table.dropColumn('category_id');
  });
