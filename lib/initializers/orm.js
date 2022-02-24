const knex = require('knex');
const { Model } = require('objection');
const config = require('../config');

let knexConnection;

function initializeOrm({ knexfile }) {
  if (!knexConnection) {
    knexConnection = knex(knexfile[config.NODE_ENV]);
    Model.knex(knexConnection);
  }

  return { knexConnection };
}

module.exports = {
  initializeOrm,
};
