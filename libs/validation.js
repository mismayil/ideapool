'use strict';

const validator = require('validator')
const passwordValidator = require('password-validator')

let passwordSchema = new passwordValidator()

passwordSchema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()

let Validation = {}

Validation.messages = {
  INVALID_EMAIL: 'Invalid email',
  INVALID_SCORE: 'Invalid score'
}

Validation.isEmail = function(val) {
  return validator.isEmail(val)
}

Validation.isScore = function(val) {
  return validator.isInt(String(val), {min:1, max: 10})
}

Validation.isPassword = function(password) {
  return passwordSchema.validate(password)
}

module.exports = Validation
