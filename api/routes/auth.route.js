'use strict';

const express = require('express')

const Request = require(__basedir+'/api/request')
const APISchema = require(__basedir+'/api/schema')
const AuthCtrl = require(__basedir+'/controllers/auth.ctrl')

let router = express.Router()

router.post('/refresh',
  Request.validate(APISchema.names.REFRESH_TOKEN),
  AuthCtrl.refreshToken
)

router.post('/',
  Request.validate(APISchema.names.LOGIN),
  Request.authenticate(Request.strategies.LOCAL),
  AuthCtrl.login
)

router.delete('/',
  Request.authenticate(Request.strategies.JWT),
  Request.validate(APISchema.names.REFRESH_TOKEN),
  AuthCtrl.logout
)

module.exports = router