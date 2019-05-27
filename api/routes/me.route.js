'use strict';

const express = require('express')
const UserCtrl = require(__basedir+'/controllers/user.ctrl')

let router = express.Router()

router.get('/', UserCtrl.getMe)

module.exports = router