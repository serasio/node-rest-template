const { Serializer } = require('../../../lib');

class CategorySerializer extends Serializer {
  constructor({ thingSerializer = null } = {}) {
    super({ collectionName: 'categories' });
    this.baseFields = ['name', 'created_at', 'updated_at'];

    this.meta = {};
    if (thingSerializer) {
      this.meta.things = Serializer.nested('things', thingSerializer);
    }
  }
}

module.exports = CategorySerializer;
