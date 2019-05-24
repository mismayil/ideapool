'use strict';

const _ = require('lodash')

const utils = require(__basedir+'/libs/utils')
const logger = require(__basedir+'/libs/logger')
const User = require(__basedir+'/models/user')
const Response = require(__basedir+'/api/response')

let AuthCtrl = {}

AuthCtrl.refreshToken = async function(req, res, next) {
  try {
    const {refresh_token: token} = req.body

    const user = await User.findOne({token: token})

    if (user) return Response.sendData(res, {jwt: utils.generateJWT(user.id)}, Response.status.OK)

    return Response.sendError(res, Response.errors.REFRESH_TOKEN_NOT_FOUND, Response.status.CONFLICT)
  } catch (err) {
    return next(err)
  }
}

AuthCtrl.login = async function(req, res, next) {
  try {
    const user = req.user
    const token = utils.generateToken()
    const jwt = utils.generateJWT(user.id)

    await User.findByIdAndUpdate(user.id, {token: token})

    return Response.sendData(res, {jwt: jwt, refresh_token: token})
  } catch (err) {
    return next(err)
  }
}

AuthCtrl.logout = async function(req, res, next) {
  try {
    const user = req.user
    const {refresh_token: token} = req.body

    await User.findOneAndUpdate({_id: user.id, token: token}, {token: null})

    return res.sendStatus(Response.status.NO_CONTENT)
  } catch (err) {
    return next(err)
  }
}

module.exports = AuthCtrl