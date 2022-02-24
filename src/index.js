require('dotenv').config();

const constants = require('./constants');

const { initializeApp } = require('../lib');

const router = require('./web');
const errorCodeToStatusMap = require('./config/errorCodeToStatusMap');
const knexfile = require('../knexfile');
const passportStrategies = require('./passport/strategies');

const app = initializeApp({
  router,
  errorCodeToStatusMap,
  knexfile,
  passportStrategies,
});

app.listen(constants.PORT);
