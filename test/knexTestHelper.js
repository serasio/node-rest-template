const knexCleaner = require('knex-cleaner');

const { initializeOrm } = require('../lib');

const knexfile = require('../knexfile');

const { knexConnection } = initializeOrm({ knexfile });

beforeEach(() => knexCleaner.clean(knexConnection, { ignoreTables: ['knex_migrations'] }));

afterAll(() => knexConnection.destroy());

module.exports = { knexConnection };
