const passport = require('koa-passport');

function createJwtAuthenticator({ ErrorClass, stateKey = 'user' }) {
  return (ctx, next) =>
    passport.authenticate('jwt', { session: false }, (_, jwtPayload) => {
      if (!jwtPayload) {
        throw new ErrorClass({ details: 'Invalid token' });
      }
      ctx.state[stateKey] = jwtPayload;
      return next();
    })(ctx, next);
}

module.exports = { createJwtAuthenticator };
