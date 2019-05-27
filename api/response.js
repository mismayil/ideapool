'use strict';

const logger = require(__basedir+'/libs/logger')

let Response = {}

Response.status = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
}

Response.errors = {
  UNKNOWN: 'Unknown error',
  REQUIRED: 'param is missing or the value is empty',
  INVALID: 'Validation failed',
  EMAIL_REQUIRED: 'email',
  PASSWORD_REQUIRED: 'password',
  NAME_REQUIRED: 'name',
  INVALID_EMAIL: 'Email is invalid',
  INVALID_PASSWORD: 'Password at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number',
  EMAIL_TAKEN: 'Email has already been taken',
  REFRESH_TOKEN_REQUIRED: 'refresh_token',
  REFRESH_TOKEN_NOT_FOUND: 'refresh token not found',
  INVALID_LOGIN: 'Either email or password is incorrect',
  UNAUTHORIZED: 'you can not pass!',
  CONTENT_REQUIRED: 'content',
  IMPACT_REQUIRED: 'impact',
  EASE_REQUIRED: 'ease',
  CONFIDENCE_REQUIRED: 'confidence',
  CONTENT_TOO_LONG: 'Content is too long (maximum is 255 characters)',
  IMPACT_NAN: 'Impact is not a number',
  EASE_NAN: 'Ease is not a number',
  CONFIDENCE_NAN: 'Confidence is not a number',
  IMPACT_NINT: 'Impact must be an integer',
  EASE_NINT: 'Ease must be an integer',
  CONFIDENCE_NINT: 'Confidence must be an integer',
  IMPACT_MAX_10: 'Impact must be less than or equal to 10',
  EASE_MAX_10: 'Ease must be less than or equal to 10',
  CONFIDENCE_MAX_10: 'Confidence must be less than or equal to 10',
  IMPACT_MIN_0: 'Impact must be greater than 0',
  EASE_MIN_0: 'Ease must be greater than 0',
  CONFIDENCE_MIN_0: 'Confidence must be greater than 0',
  IDEA_NOT_FOUND: key => `idea of id ${key} can not be found`,
  UNAUTHORIZED_DELETE: "You don't have permission to delete this idea",
  UNAUTHORIZED_UPDATE: "You don't have permission to update this idea"
}

Response.isOK = function(status) {
  return status >= 200 && status < 300
}

Response.handleError = function(err, req, res, next) {
  logger.error(err.stack)
  return res.sendStatus(Response.status.SERVER_ERROR)
}

Response.send = function(res, body, status=Response.status.CREATED) {
  return res.status(status).json(body)
}

Response.sendData = function(res, data, status) {
  return Response.send(res, data, status)
}

Response.sendError = function(res, error=Response.errors.UNKNOWN_ERROR, status=Response.status.BAD_REQUEST) {
  return Response.send(res, {reason: error}, status)
}

Response.sendOK = function(res) {
  return res.sendStatus(Response.status.CREATED)
}

module.exports = Response
