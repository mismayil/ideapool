'use strict';

const winston = require('winston');
const config = require('config');

const level = config.get('app.LOG_LEVEL') || 'debug';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      level: level,
      colorize: true,
      json: true,
      timestamp: function () {
        return (new Date()).toISOString();
      }
    })
  ]
});

module.exports = logger;
