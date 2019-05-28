'use strict';

const passport = require('passport')
const _ = require('lodash')
const validator = require('validator')

const ajv = require(__basedir+'/libs/ajv')
const Response = require(__basedir+'/api/response')
const APISchema = require(__basedir+'/api/schema')
const Validation = require(__basedir+'/libs/validation')

// schemas
const signupSchema = require(__basedir+'/api/schemas/signup')
const refreshTokenSchema = require(__basedir+'/api/schemas/refresh-token')
const loginSchema = require(__basedir+'/api/schemas/login')
const ideaSchema = require(__basedir+'/api/schemas/idea')

let Request = {}

Request.strategies = {
  JWT: 'JWT',
  LOCAL: 'LOCAL'
}

Request.data = {
  PARAMS: 'params',
  BODY: 'body'
}

Request.init = function() {
  // add keywords
  ajv.addKeyword('notEmpty', {
    validate: function (schema, data) {
      return _.isNumber(data) || !_.isEmpty(data)
    },
    errors: false
  })

  ajv.addKeyword('number', {
    validate: function (schema, data) {
      return validator.isNumeric(String(data))
    },
    errors: false
  })

  ajv.addKeyword('integer', {
    validate: function (schema, data) {
      return validator.isInt(String(data))
    },
    errors: false
  })

  // add schemas
  ajv.addSchema(signupSchema, APISchema.names.SIGNUP)
  ajv.addSchema(refreshTokenSchema, APISchema.names.REFRESH_TOKEN)
  ajv.addSchema(loginSchema, APISchema.names.LOGIN)
  ajv.addSchema(ideaSchema, APISchema.names.IDEA)

  // add formats
  ajv.addFormat(APISchema.formats.EMAIL, Validation.isEmail)
  ajv.addFormat(APISchema.formats.PASSWORD, Validation.isPassword)
  ajv.addFormat(APISchema.formats.SCORE, Validation.isScore)
}

Request.authenticateJWT = function(req, res, next) {
  passport.authenticate('jwt', {session: false}, function(err, user) {
    req.user = user
    if (user) return next()
    if (err) return Response.sendError(res, err, Response.status.UNAUTHORIZED)
    Response.sendError(res, Response.errors.UNAUTHORIZED, Response.status.UNAUTHORIZED)
  })(req, res, next)
}

Request.authenticateLocal = function(req, res, next) {
  passport.authenticate('local', {session: false}, function(err, user) {
    if (user) {
      req.user = user
      return next()
    }

    if (err) return Response.sendError(res, err, Response.status.CONFLICT)

    Response.sendError(res, Response.errors.INVALID_LOGIN, Response.status.CONFLICT)
  })(req, res, next)
}

Request.authenticate = function(strategy) {
  switch (strategy) {
    case Request.strategies.JWT: return Request.authenticateJWT
    case Request.strategies.LOCAL: return Request.authenticateLocal
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
            requiredError = property.errors.required
          }

          break
        } else {
          let prop = error.dataPath.substring(1)
          let property = _.get(schema.properties, prop)
          
          if (property && property.errors) {
            if (error.keyword === 'notEmpty' && property.errors.required) {
              requiredError = property.errors.required
              break
            } else if (error.keyword === 'type' && property.errors.type) {
              if (!_.find(validationErrors, err => err.prop === prop)) validationErrors.push({prop: prop, message: property.errors.type})
            } else if (error.keyword === 'number' && property.errors.number) {
              if (!_.find(validationErrors, err => err.prop === prop)) validationErrors.push({prop: prop, message: property.errors.number})
            } else if (error.keyword === 'minimum' && property.errors.minimum) {
              if (!_.find(validationErrors, err => err.prop === prop)) validationErrors.push({prop: prop, message: property.errors.minimum})
            } else if (error.keyword === 'maximum' && property.errors.maximum) {
              if (!_.find(validationErrors, err => err.prop === prop)) validationErrors.push({prop: prop, message: property.errors.maximum})
            } else if (error.keyword === 'integer' && property.errors.integer) {
              if (!_.find(validationErrors, err => err.prop === prop)) validationErrors.push({prop: prop, message: property.errors.integer})
            } else if (property.errors.format) {
              if (!_.find(validationErrors, err => err.prop === prop)) validationErrors.push({prop: prop, message: property.errors.format})
            }
          }
        }
      }

      if (requiredError) return Response.sendError(res, `${Response.errors.REQUIRED}: ${requiredError}`, Response.status.BAD_REQUEST)

      if (!_.isEmpty(validationErrors)) return Response.sendError(res, `${Response.errors.INVALID}: ${validationErrors.map(err => err.message).join(', ')}`, Response.status.UNPROCESSABLE)

      return Response.sendError(res, Response.errors.UNKNOWN)
    }

    return res.sendStatus(Response.status.BAD_REQUEST)
  }
}

Request.validate = function(schemaName) {
  return Request.validateData(Request.data.BODY, schemaName)
}

module.exports = Request
