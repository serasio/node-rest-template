require('dotenv').config();

const makeConfig = (enviroment) => {
  return {
    client: 'postgresql',
    connection: {
      database: process.env.DATABASE_NAME || `${process.env.DATABASE}_${enviroment}`,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
  };
};

module.exports = {
  development: makeConfig('development'),
  test: makeConfig('test'),
  production: makeConfig('production'),
};
