'use strict';

const bluebird = require('bluebird')
const config = require('config')

const mongoose = require(__basedir+'/libs/mongoose')
const logger = require(__basedir+'/libs/logger')

let Database = {}

Database.mongoConnection = null

Database.models = {
    User: {
        NAME: 'User'
    },
    Idea: {
        NAME: 'Idea'
    }
}

Database.init = async function() {
    await Database.connect();
}

Database.connect = async function() {
    const uri = config.get('database.URI')

    let options = {
        promiseLibrary: bluebird,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }

    try {
        Database.mongoConnection = await mongoose.connect(uri, options)
        logger.info('Database init ok')
    } catch (err) {
        logger.error('Database connection failed. %s', err)
        throw err
    }
}

Database.isValidModel = function(model) {
    if (Database.models[model]) return true
    return false
}

module.exports = Database