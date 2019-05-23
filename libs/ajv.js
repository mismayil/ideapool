'use strict';

const Ajv = require('ajv')
const { plugin } = require('ajv-moment')
const moment = require('moment')

let ajv = Ajv({ removeAdditional: 'all', $data: true, coerceTypes: true, useDefaults: true })
require('ajv-keywords')(ajv)
plugin({ajv, moment})

module.exports = ajv
