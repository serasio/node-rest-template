### withResponseMiddleware

##### Paging

Set the paged option to true:

```js
withResponseMiddleware(serializer, (ctx) => thingsService.all(ctx.state.pageConfig), {
  paged: true,
  defaultPageSize: 20,
});
```

The middleware looks in the query string for `page` and `pageSize`:

- If `page` is given and valid, it will be stored in `ctx.state.pageConfig.page` as an integer
- If `page` is not given or its invalid, `ctx.state.pageConfig.page` will default to `0`
- If `pageSize` is given and valid, it will be stored in `ctx.state.pageConfig.pageSize` as an integer
- If `pageSize` is not given or its invalid, `ctx.state.pageConfig.page` will default to `defaultPageSize`

In the service, the objection page modifier can be used

```js
// caveat: sometimes Objection paging cant be used.
// See https://vincit.github.io/objection.js/recipes/paging.html
const all = ({ page, pageSize }) =>
  Thing.query()
    .returning('*')
    .withGraphFetched('category.[things]')
    .page(page, pageSize);
```

Request:

`http GET http://localhost:3000/api/things?pageSize=2&page=0`

- Notice that the index of the first page is 0. This is the same in objection

Response:

```js
{
    "pageData": {
        "page": 0,
        "pageSize": 2,
        "total": 5
    },
    "things": [/* ...first two of the five things */]
}
```

- Notice the `pageData` key has been added. It has data of interest related to pagination.
