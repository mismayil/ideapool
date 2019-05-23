'use strict';

const express = require('express')

const Request = require(__basedir+'/api/request')
const APISchema = require(__basedir+'/api/schema')
const UserCtrl = require(__basedir+'/controllers/user.ctrl')

let router = express.Router()

router.post('/',
  Request.validate(APISchema.names.SIGNUP),
  UserCtrl.signup
)

module.exports = router