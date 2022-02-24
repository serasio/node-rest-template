# Getting the token

### 1) Define the local strategy

```js
// src/passport/strategies.js
const { Strategy: LocalStrategy } = require('passport-local');

const localStrategy = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  (email, password, done) => {
    // here you would verify the user and password
    // (for example using a db that contains the user,
    // their *hashed* password and an admin flag)
    if (email === 'sample@email.com' && password === 'sample-password') {
      done(null, { email, isAdmin: false });
    } else if (email === 'admin@email.com' && password === 'admin-password') {
      done(null, { email, isAdmin: true });
    } else {
      done(new Error('User not found'), null);
    }
  },
);

module.exports = [localStrategy];
```

### 2) Pass the local strategy to initializeApp

```js
// src/index.js
const { initializeApp } = require('../lib');

const passportStrategies = require('./passport/strategies');

/* some other setup here */

const app = initializeApp({
  ...otherConfig,
  passportStrategies,
});

/* some other setup here */
```

### 3) Set an env variable for the jwt secret

```js
// src/constants.js
module.exports = {
  ...otherConstants,
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-key',
};
```

### 4) Expose a login route

##### It should:

- use the local strategy defined above to validate the user
- sign the validated user data
- return the signed jwt

```js
// src/web/auth.router.js
const Router = require('koa-router');
const jwt = require('jsonwebtoken');

const constants = require('../constants');
const { passport } = require('../../lib');
const { Unauthorized } = require('../errors');

const router = new Router();

function localAuthenticator(ctx) {
  return passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      throw new Unauthorized({ details: 'Invalid credentials' });
    }

    const { email, isAdmin } = user;
    const token = jwt.sign({ email, isAdmin }, constants.JWT_SECRET);
    ctx.body = { token };
  })(ctx);
}

router.post('/login', localAuthenticator);

module.exports = router;
```

Here, `passport.authenticate('local', ...)` uses the local strategy defined above

Notice that the last argument of `passport.authenticate` (the callback) is actually being passed as the `done` argument for the `LocalStrategy` callback

Assuming this route is exposed at `/api/auth/login`; the following request should return the token (using [httpie](https://httpie.org)):

```sh
http POST localhost:3000/api/auth/login email=sample@email.com password=sample-password
```

# Using the token

### 1) Define the jwt strategy

```js
// src/passport/strategies.js

/* local strategy code */

const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const constants = require('../constants');

const jwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JwtStrategy(jwtStrategyOptions, (jwtPayload, done) => {
  done(null, jwtPayload);
});

module.exports = [localStrategy, jwtStrategy];
```

- Make sure its being passed to `initializeApp`

### 2) Create the jwtAuthenticator middleware

```js
// src/middlewares/jwtAuthenticator.js
const { createJwtAuthenticator } = require('../../lib/middlewares/authMiddlewares');

const { Unauthorized } = require('../errors');

const jwtAuthenticator = createJwtAuthenticator({ ErrorClass: Unauthorized });

module.exports = jwtAuthenticator;
```

- In case of an invalid/missing jwt, an error of type ErrorClass will be thown.
- This middleware assumes that the jwt strategy was added through `initializeApp` in the previous step, since `jwtAuthenticator` calls `passport.authenticate('jwt', ...)` when applied.
- It is convenient to have this in its own file, to allow for easy composing with other auth-related middleware.

### 3) Add to desired routers/routes

The `jwtAuthenticator` middleware ensures that the request comes with a valid token.

```js
const Router = require('koa-router');

const jwtAuthenticator = require('../middlewares/jwtAuthenticator');

const authRouter = require('./auth');
const protectedThingsRouter = require('./protected-things');

// public route: allows all requests
router.use('/auth', authRouter.routes());
// protected route: only allows requests with a valid jwt
router.use('/protected-things', jwtAuthenticator, protectedThingsRouter.routes());
```

If the token is missing/invalid, the protected route will throw an error.

If the token is valid, the middleware will populate `ctx.state.user` with the jwt payload:

```js
// in any route of protectedThingsRouter
console.log(ctx.state.user);
// -> { email: 'admin@email.com', isAdmin: true, iat: 1565158636 }
```

If the `ctx.state.user` key is in use or not desired, it can be overriden via the `stateKey` option in `createJwtAuthenticator`:

```js
createJwtAuthenticator({ ErrorClass: Unauthorized, stateKey: 'employee' });
```

### 4) Send the request

Where to actually find the token in the request is specified with the `jwtFromRequest` option in the strategy.
In the above example it is being obtained from the Authorization header as bearer, `ExtractJwt.fromAuthHeaderAsBearerToken()`. [This can be changed if desired.](https://github.com/mikenicholson/passport-jwt#extracting-the-jwt-from-the-request)

Assuming that "Authorization header as bearer" is kept and that the protected route is exposed at `/api/protected-things`; the following request should return the protected resource (using [httpie](https://httpie.org)):

```sh
http GET localhost:3000/api/protected-things Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbXBsZUBlbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTY1MTU3MTAxfQ.YpepF-vOKYw5ahizVJmN5vhN45ipTeq_26OfkuSWZBQ'
```

Make sure to get a valid token first, and set it.

# Extra

### Composing auth middlewares (Example)

To add extra restrictions, compose with jwtAuthenticator to fit your permissions model:

```js
// src/middlewares/requireAdmin.js
const compose = require('koa-compose');

const { Unauthorized } = require('../errors');

const jwtAuthenticator = require('./jwtAuthenticator');

const requireAdmin = compose([
  jwtAuthenticator,
  (ctx, next) => {
    if (ctx.state.user.isAdmin !== true) {
      throw new Unauthorized({ details: 'You are not an admin' });
    }
    return next();
  },
]);

module.exports = requireAdmin;
```

Example route, only accessible if isAdmin === true:

```js
// src/web/admin.router.js
const Router = require('koa-router');

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = { message: 'Hello admin: *Secret admin message*' };
});

module.exports = router;
```

Use the composed middleware in the admin routes:

```js
// src/web/index.js
const Router = require('koa-router');

const requireAdmin = require('../middlewares/requireAdmin');

const adminRouter = require('./admin.router');

const apiRouter = new Router({ prefix: '/api' });

// requires a valid jwt with isAdmin === true
apiRouter.use('/admin', requireAdmin, adminRouter.routes());

module.exports = apiRouter;
```
