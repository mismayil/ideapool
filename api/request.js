'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');
const passport = require('passport');

const ajv = require(__basedir+'/libs/ajv');
const logger = require(__basedir+'/libs/logger');
const User = require(__basedir+'/models/schemas/user');
const Response = require(__basedir+'/api/response');
const APISchema = require(__basedir+'/api/schema');

let Request = {};

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
  // ajv.addSchema(registerSchema, APISchema.names.REGISTER);
}

Request.verifyJWT = async function(token) {
    try {
        let payload = jwt.verify(token, config.get('api.SECRET'));
        if (payload) {
            let user = await User.findById(payload.user.id);
            if (user) return user;
        }
    } catch (err) {
        logger.error(String(err));
    }

    return null;
}

Request.authenticateJWT = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, function(err, user) {
        req.user = user;
        if (user) return next();
        if (err) return Response.sendError(res, err);
        res.sendStatus(Response.status.UNAUTHORIZED);
    })(req, res, next);
}

Request.authenticateBasic = function(req, res, next) {
    passport.authenticate('basic', {session: false}, function(err, user) {
        if (user) {
            req.user = user;
            return next();
        }

        if (err) return res.status(Response.status.BAD_REQUEST).json({error: err});

        res.sendStatus(Response.status.UNAUTHORIZED);
    })(req, res, next);
}

Request.authenticate = function(strategy) {
    switch (strategy) {
        case Request.strategies.JWT: return Request.authenticateJWT;
        case Request.strategies.BASIC: return Request.authenticateBasic;
    }
    return function() {}
}

Request.validateData = function(obj, schemaName, skipRequired) {
  return function(req, res, next) {
      let data = req[obj];

      if (skipRequired) data.SKIP_REQUIRED = true;

      let valid = ajv.validate(schemaName, data);

      delete data.SKIP_REQUIRED;

      if (valid) return next();

      let schemaObject = ajv.getSchema(schemaName);
      let schema = schemaObject.schema;

      if (!_.isEmpty(ajv.errors)) {
          let error = ajv.errors[0];
          let prop, errorProp;

          if (error.keyword === 'required') {
              prop = error.params.missingProperty;
              let property = schema.properties[prop];
              if (property && property.errors && property.errors.required) {
                  errorProp = property.errors.required;
              }
          }

          if (error.keyword === 'format') {
              prop = error.params.format;
              let property = schema.properties[prop];
              if (property && property.errors && property.errors.format) {
                  errorProp = property.errors.format;
              }
          }

          let status = errorProp && errorProp.status ? errorProp.status : Response.status.BAD_REQUEST;
          let err = errorProp && errorProp.error
                      ? errorProp.error
                      : {code: Response.errors.CUSTOM_ERROR.code, field: error.dataPath, message: error.message};

          return Response.sendError(res, err, status);
      }

      return res.sendStatus(Response.status.BAD_REQUEST);
  }
}

Request.validate = function(schemaName, skipRequired=false) {
  if (schemaName === APISchema.names.TOKEN || schemaName === APISchema.names.MONGO_ID) {
      return Request.validateData(Request.data.PARAMS, schemaName, skipRequired);
  }

  return Request.validateData(Request.data.BODY, schemaName, skipRequired);
}

module.exports = Request;
