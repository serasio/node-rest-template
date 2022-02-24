const { Serializer } = require('../../../lib');

class ThingSerializer extends Serializer {
  constructor({ categorySerializer = null } = {}) {
    super({ collectionName: 'things' });

    this.baseFields = ['name', 'created_at', 'updated_at'];

    this.meta = {
      // Renamed attribute example
      the_name: Serializer.renamed('name'),
      // Custom attribute that is a function example
      reverseName: Serializer.calculated(ThingSerializer.reverseName),
    };

    if (categorySerializer) {
      // Nested example
      this.meta.category = Serializer.nested('category', categorySerializer);
    }
  }

  // Custom function to be included in the constructor as a custom attribute
  // functions that are used as custom attributes should always receive the
  // entity object as a parameter
  static reverseName(object) {
    return object.name
      .split('')
      .reverse()
      .join('');
  }
}

module.exports = ThingSerializer;
