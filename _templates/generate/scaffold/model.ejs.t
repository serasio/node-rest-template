---
to: src/lib/<%= entities %>/<%= entities %>.model.js
---
const { Model } = require('objection');

class <%= Entity %> extends Model {
  static get tableName() {
    return '<%= tableName %>';
  }

  static get relationMappings() {
    return {};
  }
}

module.exports = { <%= Entity %> };
