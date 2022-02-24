const { logger } = require('../initializers/logger');

module.exports = function errorHandlerMiddleware(errorCodeToStatusMap) {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      logger.error(error, ctx.method, ctx.url);
      const status = errorCodeToStatusMap[error.code];
      const isExpected = status !== undefined;
      ctx.body = { error: isExpected ? error : 'Internal Server Error' };
      ctx.status = isExpected ? status : 500;
    }
  };
};
