const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const url = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://localhost/seraquepresta'
module.exports = mongoose.connect(url, { useMongoClient: true })

//const config = require('../knexfile.js')
//const knex = require('knex') (config)

//Exportando o knex para o index
knex.migrate.latest([config])
module.exports = knex