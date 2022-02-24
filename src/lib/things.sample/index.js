const { Thing } = require('./things.model');
const ThingSerializer = require('./things.serializer');
const thingsService = require('./things.service');

module.exports = {
  Thing,
  ThingSerializer,
  ...thingsService,
};
