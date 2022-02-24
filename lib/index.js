const passport = require('koa-passport');

const withResponseMiddleware = require('./middlewares/withResponse');
const { initializeApp } = require('./initializers/app');
const { initializeOrm } = require('./initializers/orm');
const { logger } = require('./initializers/logger');
const { Serializer } = require('./serializer');
const helpers = require('./helpers');

module.exports = {
  initializeApp,
  initializeOrm,
  logger,
  Serializer,
  withResponseMiddleware,
  libHelpers: helpers,
  passport,
};
