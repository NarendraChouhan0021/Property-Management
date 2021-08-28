const config = {
  development: {
    database: process.env.DEV_DB_NAME || 'properties',
    username: process.env.DEV_DB_USER || 'root', 
    password: process.env.DEV_DB_PASS || 'password', 
    host: process.env.DEV_DB_HOST || 'localhost',
    dialect: "mysql",
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    database: process.env.PROD_DB_NAME,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASS,
    host: process.env.PROD_DB_HOST,
    dialect: "mysql",
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
};

module.exports = config;