'use strict';

const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

module.exports = mongoose;