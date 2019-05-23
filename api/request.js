'use strict';

const jwt = require('jsonwebtoken')
const config = require('config')
const passport = require('passport')
const _ = require('lodash')

const ajv = require(__basedir+'/libs/ajv')
const logger = require(__basedir+'/libs/logger')
// const User = require(__basedir+'/models/schemas/user')
const Response = require(__basedir+'/api/response')
const APISchema = require(__basedir+'/api/schema')
const Validation = require(__basedir+'/libs/validation')

// schemas
const idSchema = require(__basedir+'/api/schemas/id')
const signupSchema = require(__basedir+'/api/schemas/signup')

let Request = {}

Request.strategies = {
    JWT: 'JWT',
    BASIC: 'BASIC'
}

Request.data = {
  PARAMS: 'params',
  BODY: 'body'
}

Request.init = function() {
  // add schemas
  ajv.addSchema(idSchema, APISchema.names.ID)
  ajv.addSchema(signupSchema, APISchema.names.SIGNUP)

  // add formats
  ajv.addFormat(APISchema.formats.ID, Validation.isID)
  ajv.addFormat(APISchema.formats.EMAIL, Validation.isEmail)
  ajv.addFormat(APISchema.formats.PASSWORD, Validation.isPassword)
}

Request.verifyJWT = async function(token) {
    try {
        let payload = jwt.verify(token, config.get('api.SECRET'))
        if (payload) {
            let user = await User.findById(payload.user.id)
            if (user) return user
        }
    } catch (err) {
        logger.error(String(err))
    }

    return null
}

Request.authenticateJWT = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, function(err, user) {
        req.user = user
        if (user) return next()
        if (err) return Response.sendError(res, err)
        res.sendStatus(Response.status.UNAUTHORIZED)
    })(req, res, next)
}

Request.authenticateBasic = function(req, res, next) {
    passport.authenticate('basic', {session: false}, function(err, user) {
        if (user) {
            req.user = user
            return next()
        }

        if (err) return res.status(Response.status.BAD_REQUEST).json({error: err})

        res.sendStatus(Response.status.UNAUTHORIZED)
    })(req, res, next)
}

Request.authenticate = function(strategy) {
    switch (strategy) {
        case Request.strategies.JWT: return Request.authenticateJWT
        case Request.strategies.BASIC: return Request.authenticateBasic
    }
    return function() {}
}

Request.validateData = function(obj, schemaName) {
  return function(req, res, next) {
    let data = req[obj]

    let valid = ajv.validate(schemaName, data)

    if (valid) return next()

    let schemaObject = ajv.getSchema(schemaName)
    let schema = schemaObject.schema

    if (!_.isEmpty(ajv.errors)) {
      let requiredError = null
      let validationErrors = []

      for (let error of ajv.errors) {
        if (error.keyword === 'required') {
          let prop = error.params.missingProperty
          let property = schema.properties[prop]
          
          if (property && property.errors && property.errors.required) {
            requiredError = property.errors.required.error
          }

          break
        }

        if (error.keyword === 'format' || error.keyword === 'minLength') {
          let prop = error.dataPath.substring(1)
          let property = _.get(schema.properties, prop)
          
          if (property && property.errors) {
            if (error.keyword === 'minLength' && property.errors.required) {
              requiredError = property.errors.required.error
              break
            } else if (property.errors.format) validationErrors.push(property.errors.format.error)
          }
        }
      }

      if (requiredError) return Response.sendError(res, `${Response.errors.REQUIRED}: ${requiredError}`, Response.status.BAD_REQUEST)

      if (!_.isEmpty(validationErrors)) return Response.sendError(res, `${Response.errors.INVALID}: ${validationErrors.join(', ')}`, Response.status.UNPROCESSABLE)

      return Response.sendError(res, Response.errors.UNKNOWN)
    }

    return res.sendStatus(Response.status.BAD_REQUEST)
  }
}

Request.validate = function(schemaName) {
  if (schemaName === APISchema.names.ID) {
    return Request.validateData(Request.data.PARAMS, schemaName)
  }

  return Request.validateData(Request.data.BODY, schemaName)
}

module.exports = Request
