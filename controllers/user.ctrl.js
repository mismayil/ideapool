'use strict';

const _ = require('lodash')

const utils = require(__basedir+'/libs/utils')
const logger = require(__basedir+'/libs/logger')
const User = require(__basedir+'/models/user')
const Response = require(__basedir+'/api/response')

let UserCtrl = {}

UserCtrl.signup = async function(req, res, next) {
  try {
    const {email, password, name} = req.body

    let user = await User.findOne({email: _.trim(email)})

    if (user) return Response.sendError(res, `${Response.errors.INVALID}: ${Response.errors.EMAIL_TAKEN}`, Response.status.UNPROCESSABLE)

    const token = utils.generateToken()
    user = new User({email, password, name, token})
    
    await user.save()

    const jwt = utils.generateJWT(user.id)

    return Response.sendData(res, {jwt: jwt, refresh_token: token})
  } catch (err) {
    return next(err)
  }
}

UserCtrl.getMe = async function(req, res, next) {
  try {
    const user = req.user
    return Response.sendData(res, user.getJSON(), Response.status.OK)
  } catch (err) {
    return next(err)
  }
}

module.exports = UserCtrl