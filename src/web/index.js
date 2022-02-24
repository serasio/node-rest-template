const Router = require('koa-router');
const thingsRouter = require('./things.router.sample'); // bin/cleanup mark

const apiRouter = new Router({ prefix: '/api' });

apiRouter.get('/', (ctx) => {
  ctx.body = { hello: 'World' };
});
apiRouter.use('/things', thingsRouter.routes()); // bin/cleanup mark

module.exports = apiRouter;
