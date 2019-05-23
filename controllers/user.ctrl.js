'use strict';

const logger = require(__basedir+'/libs/logger')

let UserCtrl = {}

UserCtrl.signup = async function(req, res, next) {
  try {
    logger.info('signed up')
  } catch (err) {
    return next(err)
  }
}

module.exports = UserCtrl