'use strict';

const uuidv4 = require('uuid/v4');

let utils = {}

utils.getUUID = function() {
    return uuidv4();
}

utils.normalizePort = function(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) return val;

    if (port >= 0) return port;

    return false;
}

utils.getBind = function(addr) {
    return typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
}

module.exports = utils;