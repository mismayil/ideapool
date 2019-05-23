'use strict';

const logger = require(__basedir+'/libs/logger');

let Response = {};

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
    SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};

Response.errors = {

}

Response.isOK = function(status) {
    return status >= 200 && status < 300;
}

Response.handleError = function(err, req, res, next) {
    logger.error(err.stack);
    return res.sendStatus(Response.status.SERVER_ERROR);
}

Response.getData = function(data) {
    return {data: data};
}

Response.getError = function(error) {
    return {error: error};
}

Response.send = function(res, body, status=Response.status.OK) {
    return res.status(status).json(body);
}

Response.sendData = function(res, data) {
    return Response.send(res, Response.getData(data));
}

Response.sendError = function(res, error=Response.errors.UNKNOWN_ERROR, status=Response.status.BAD_REQUEST) {
    return Response.send(res, Response.getError(error), status);
}

Response.sendOK = function(res) {
    return res.sendStatus(Response.status.OK);
}

module.exports = Response;
