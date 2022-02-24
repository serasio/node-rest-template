exports.seed = (knex, Promise) =>
  knex('things')
    .del()
    .then(() =>
      knex('things').insert([
        { name: 'name1', active: true,  category_id: 1 },
        { name: 'name2', active: false,  category_id: 1 },
        { name: 'name3', active: true,  category_id: 2 },
      ]),
    );
