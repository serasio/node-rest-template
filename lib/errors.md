# Error handling middleware

The error handling middleware will be used if the `errorCodeToStatusMap` option of `initializeApp` is provided.

### Throwing expected custom errors

#### Background

We want our `services` folder to be at least somewhat independent from the REST api itself and
from the logic to send http responses (what status code, what body, etc), while being as convenient
as possible.

To accomplish this, we expose the possible errors codes that our services can throw with,
and provide `errorCodeToStatusMap`, a plain JS object that maps each error code to an http status code.

To have an error instance `err` be considered *expected* when thrown:
- `err.code` must be defined,
- `err.code` must be included in the keys of `errorCodeToStatusMap`.

For *UNexpected* errors:
- The middleware catches them, and responds with this body: `{ error: 'Internal Server Error' }`
- The middleware catches them, and responds with this http status code: `500`

For *expected* errors:
- The middleware catches them, and responds with this body: `{ error: err }`
- The middleware catches them, and responds with this http status code: `errorCodeToStatusMap[err.code]`

_Important:_ when sending `{ error: err }` as a response, koa only sends the enumerable properties of
the object. This means it only sends the properties the user defined manually,
and ignores stack, arguments, type and message.

##### 1) Use the provided helper to create error classes

We provide a helper that can be used to create several custom Error classes easily.

The created classes have a constructor that accepts an object and merges it into the error.
This allows the user to add extra data for context or for rendering a response.

The classes also have their `code` already exposed in a static field, as a `Symbol` to ensure uniqueness

```js
// src/errors/index.js
const {
  libHelpers: { buildErrorClasses },
} = require('../../lib');

const errorsMap = buildErrorClasses(['ValidationError', 'Unauthorized']);

module.exports = errorsMap;

// USAGE EXAMPLE:

console.log(errorsMap);
// -> { ValidationError: [Function: ValidationError],
//      Unauthorized: [Function: Unauthorized] }

const { ValidationError } = errorsMap;
console.log(ValidationError.code);
// -> Symbol(ValidationError)

// example using JSON.parse + JSON.stringify to get only the enumerable properties,
// similar to how koa renders an object in a response
console.log(JSON.parse(JSON.stringify(new ValidationError({ details: 'some details' }))));
// -> { details: 'some details' }
```

##### 2) Specify expected errors and status codes

```js
// src/config/errorCodeToStatusMap.js
const { ValidationError, Unauthorized } = require('../errors');

const errorCodeToStatusMap = {
  [ValidationError.code]: 400,
  [Unauthorized.code]: 401,
};

module.exports = errorCodeToStatusMap;
```

##### 3) Enable the middleware

Pass it to `initializeApp`:

```js
// src/index.js
const { initializeApp } = require('../lib');

const errorCodeToStatusMap = require('./config/errorCodeToStatusMap');

/* some other setup here */

const app = initializeApp({
  ...otherConfig,
  errorCodeToStatusMap,
});

/* some other setup here */
```

##### 4) Usage: Throwing errors

As mentioned above, koa only sends enumerable properties of an object/Error in the response body.

Assuming we have the following function in a service:

```js
const { ValidationError } = require('../errors');

function validate(thing) {
  if (!thing.name) {
    throw new ValidationError({ details: 'Name is required' })
  }
}
```

Lets say some route calls the `validate` function with `{}` as the `thing` parameter.  We will get a `ValidationError` in this case. It is an expected error.

Given that:
- `ValidationError` has been created with the provided `buildErrorClasses` helper
- `[ValidationError.code]: 400` in the `errorCodeToStatusMap`

The API will:
- Respond with this body: `{ error: { details: 'Name is required' } }`
- Respond with an http status of `400`

Now, lets say some route calls the `validate` function with `undefined` as the `thing` parameter.
We will get a `TypeError` in this case. It is _not_ an expected error.

The API will:
- Respond with this body: `{ error: 'Internal Server Error' }`
- Respond with an http status of `500`
