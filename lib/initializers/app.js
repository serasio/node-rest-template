const Koa = require('koa');
const addExtendedQsParser = require('koa-qs');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const errorHandlerMiddleware = require('../middlewares/errorHandler');
const { initializeOrm } = require('./orm');

function initializeApp({ router, errorCodeToStatusMap, knexfile, passportStrategies = [] } = {}) {
  if (knexfile) initializeOrm({ knexfile });

  const app = new Koa();

  addExtendedQsParser(app);

  app.use(bodyParser());

  if (errorCodeToStatusMap) {
    app.use(errorHandlerMiddleware(errorCodeToStatusMap));
  }

  if (router) {
    app.use(router.routes());
  }

  passportStrategies.forEach((strategy) => passport.use(strategy));

  return app;
}

module.exports = {
  initializeApp,
};
