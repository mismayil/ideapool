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
const Database = require(__basedir+'/db/database')
const Request = require(__basedir+'/api/request')
const Response = require(__basedir+'/api/response')
const authRouter = require(__basedir+'/api/routes/auth.route')
const meRouter = require(__basedir+'/api/routes/me.route')
const userRouter = require(__basedir+'/api/routes/user.route')
const ideaRouter = require(__basedir+'/api/routes/idea.route')
require(__basedir+'/api/passport')

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
app.use('/access-tokens', authRouter)
app.use('/users', userRouter)
app.use('/me', Request.authenticate(Request.strategies.JWT), meRouter)
app.use('/ideas', Request.authenticate(Request.strategies.JWT), ideaRouter)
app.use(Response.handleError)

app.set('init', async function() {
    logger.info('Initializing app...');
    try {
      await Database.init()
      await Request.init()
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
