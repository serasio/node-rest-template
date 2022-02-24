const { pick } = require('../helpers/pick');

const { ValidationError, CategoryNotFound } = require('../../errors');

const { Thing } = require('./things.model');
const { Category } = require('../categories.sample');

const validations = require('./things.validations');

const THING_VALID_PARAMS = ['name', 'category_id'];

const all = ({ pageConfig: { page, pageSize }, ids = null }) => {
  return Thing.query()
    .modify((qb) => {
      if (Array.isArray(ids)) {
        qb.findByIds(ids);
      }
    })
    .modify('active')
    .returning('*')
    .withGraphFetched('category.[things]')
    .page(page, pageSize);
};

const create = async ({ thing }) => {
  if (!thing) {
    throw new ValidationError({ details: `expected valid 'thing' object, got ${thing}` });
  }
  const thingParams = pick(thing, THING_VALID_PARAMS);
  const validationResult = validations.create.validate(thingParams);
  if (validationResult.error) {
    throw new ValidationError({ details: validationResult.error.details });
  }

  const category = await Category.query().findById(thing.category_id);

  if (!category) {
    throw new CategoryNotFound({
      message: 'Category not found', // NOTE: this doesnt appear in the response, only in the logs
      categoryId: thing.category_id,
      details: 'No category was found with the given id',
    });
  }

  return Thing.query()
    .insert(thingParams)
    .returning('*')
    .withGraphFetched('category.[things]');
};

module.exports = { all, create };
