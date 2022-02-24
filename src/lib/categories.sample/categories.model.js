const { Model } = require('objection');

class Category extends Model {
  static get tableName() {
    return 'categories';
  }

  static get relationMappings() {
    const { Thing } = require('../things.sample/things.model'); //eslint-disable-line

    return {
      things: {
        relation: Model.HasManyRelation,
        modelClass: Thing,
        join: {
          from: 'categories.id',
          to: 'things.category_id',
        },
      },
    };
  }
}

module.exports = { Category };
