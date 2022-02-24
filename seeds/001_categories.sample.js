exports.seed = (knex, Promise) =>
  knex('categories')
    .del()
    .then(() => knex('categories').insert([{ name: 'category1' }, { name: 'category2' }]));
