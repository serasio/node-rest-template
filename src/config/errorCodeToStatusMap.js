const { ValidationError, CategoryNotFound, Unauthorized } = require('../errors');

const errorCodeToStatusMap = {
  [ValidationError.code]: 400,
  [CategoryNotFound.code]: 404,
  [Unauthorized.code]: 401,
};

module.exports = errorCodeToStatusMap;
