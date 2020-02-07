// Database Connection
const environment = process.env.ENV || 'development'
const config = require('../knexfile.js')[environment]

module.exports = require('knex')(config)
