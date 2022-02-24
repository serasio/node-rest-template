const Router = require('koa-router');
const thingsLib = require('../lib/things.sample');
const categoriesLib = require('../lib/categories.sample');
const { withResponseMiddleware } = require('../../lib');

const { ThingSerializer } = thingsLib;
const { CategorySerializer } = categoriesLib;

const router = new Router();

const thingsIndexSerializer = new ThingSerializer();

router.get(
  '/',
  withResponseMiddleware(
    thingsIndexSerializer,
    (ctx) => {
      return thingsLib.all({ pageConfig: ctx.state.pageConfig, ids: ctx.query.ids });
    },
    {
      paged: true,
      defaultPageSize: 20,
    },
  ),
);

const thingsShowSerializer = new ThingSerializer({
  categorySerializer: new CategorySerializer({
    thingSerializer: new ThingSerializer(),
  }),
});

router.post(
  '/',
  withResponseMiddleware(thingsShowSerializer, (ctx) => thingsLib.create(ctx.request.body)),
);

module.exports = router;
