'use strict';

const Ajv = require('ajv')
const { plugin } = require('ajv-moment')
const moment = require('moment')

let ajv = Ajv({ allErrors: true, removeAdditional: 'all', $data: true, useDefaults: 'empty', coerceTypes: true })
require('ajv-keywords')(ajv)
plugin({ajv, moment})

module.exports = ajv
