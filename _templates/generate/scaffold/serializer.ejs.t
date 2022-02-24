---
to: src/lib/<%= entities %>/<%= entities %>.serializer.js
---
const { Serializer } = require('../../../lib');

class <%= Entity %>Serializer extends Serializer {
  constructor() {
    super({ collectionName: '<%= entities %>' });

    this.baseFields = [];

    this.meta = {};
  }
}

module.exports = <%= Entity %>Serializer;
