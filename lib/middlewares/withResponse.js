const Joi = require('@hapi/joi');
const { logger } = require('../initializers/logger');

const pagedValidation = Joi.object().keys({
  page: Joi.number()
    .min(0)
    .optional(),
  pageSize: Joi.number()
    .min(1)
    .optional(),
});

module.exports = function withResponseMiddleware(
  serializer,
  flow,
  { paged = false, defaultPageSize = 10 } = {},
) {
  return async (ctx) => {
    if (paged) {
      const validationResult = pagedValidation.validate(ctx.query);

      ctx.state.pageConfig = {
        page: validationResult.value.page || 0,
        pageSize: validationResult.value.pageSize || defaultPageSize,
      };
    }

    const flowResult = await flow(ctx);
    const resource = paged ? flowResult.results : flowResult;
    const serializedResults = serializer.serialize(resource);
    logger.debug(serializedResults, ctx.method, ctx.url);

    if (paged) {
      serializedResults.pageData = {
        total: flowResult.total,
        ...ctx.state.pageConfig,
      };
    }

    ctx.body = serializedResults;
  };
};
