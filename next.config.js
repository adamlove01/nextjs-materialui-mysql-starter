// knex needs dotenv!
require('dotenv').config()

exports.default = {
  env: {
    ENV: process.env.ENV,
    API_HOST: process.env.API_HOST,
    AUTH_SECRET: process.env.AUTH_SECRET,
    MYSQL_DB: process.env.MYSQL_DB,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  },
}
