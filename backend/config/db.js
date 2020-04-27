const config = require('../knexfile.js')
const knex = require('knex') (config)

//Exportando o knex para o index
knex.migrate.latest([config])
module.exports = knex