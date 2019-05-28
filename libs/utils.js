'use strict';

const uuidv4 = require('uuid/v4')
const jwt = require('jsonwebtoken')
const randtoken = require('rand-token')
const config = require('config')

const TEN_MINS = 10 * 60

let utils = {}

utils.getUUID = function() {
    return uuidv4()
}

utils.normalizePort = function(val) {
    let port = parseInt(val, 10)

    if (isNaN(port)) return val

    if (port >= 0) return port

    return false
}

utils.getBind = function(addr) {
    return typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
}

utils.generateJWT = function(user) {
    return jwt.sign({user: user}, config.get('api.SECRET'), {expiresIn: TEN_MINS})
}

utils.generateToken = function() {
    return randtoken.generate(100)
}

module.exports = utils