// knex needs dotenv!
require('dotenv').config()

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DB,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      charset: process.env.MYSQL_CHARSET,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: { directory: './db/seeds' },
  },
}
