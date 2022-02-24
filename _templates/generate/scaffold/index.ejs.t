---
to: src/lib/<%= entities %>/index.js
---
const { <%= Entity %> } = require('./<%= entities %>.model');
const <%= Entity %>Serializer = require('./<%= entities %>.serializer');
const <%= entities %>Service = require('./<%= entities %>.service');

module.exports = {
  <%= Entity %>,
  <%= Entity %>Serializer,
  ...<%= entities %>Service,
};
