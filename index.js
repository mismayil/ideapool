#!/usr/bin/env node

'use strict';

const path = require('path');
global.__basedir = path.resolve(__dirname);

const config = require('config');
const http = require('http');
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const morgan = require('morgan')

const utils = require(__basedir+'/libs/utils');
const logger = require(__basedir+'/libs/logger')
// require(__basedir+'/api/passport')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize())

app.use(morgan('combined', {
    skip: function (req, res, next) {
        return res.statusCode < 400
    }, stream: process.stderr
}))

app.use(morgan('combined', {
    skip: function (req, res, next) {
        return res.statusCode >= 400
    }, stream: process.stdout
}))

// routers
app.use('/static', express.static('public'))
// app.use(Response.handleError)

app.set('init', async function() {
    logger.info('Initializing app...');
    try {
      logger.info('App initialized')
    } catch (err) {
        logger.error('App initialization failed. %s', err)
    }
})

let port = utils.normalizePort(config.get('server.PORT'));
app.set('port', port);

let server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') throw error;

    let addr = server.address()
    let bind = utils.getBind(addr);

    switch (error.code) {
        case 'EACCES':
          logger.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = utils.getBind(addr);
    logger.info('Listening on ' + bind);
    let init = app.get('init');
    init();
}

module.exports = app
