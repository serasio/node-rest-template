const thing1 = {
  name: 'thing1 name',
  created_at: new Date('2019-07-19T00:00:00.000Z'),
  updated_at: new Date('2019-07-19T00:00:00.000Z'),
  category_id: 1,
};

const thing2 = {
  ...thing1,
  name: 'thing2 name',
};

module.exports = {
  thing1,
  thing2,
};
