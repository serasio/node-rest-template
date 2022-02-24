const {
  libHelpers: { buildErrorClasses },
} = require('../../lib');

const errorsMap = buildErrorClasses([
  'BadRequest',
  'ValidationError',
  'CategoryNotFound',
  'Unauthorized',
]);

module.exports = errorsMap;
