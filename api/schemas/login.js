'use strict';

const Response = require(__basedir+'/api/response')

let loginSchema = {
  '$id': 'http://api-ideapool.herokuapp.com/schemas/login.json',
  title: 'Login',
  description: 'User Login Schema',
  type: 'object',
  properties: {
    email: {
      type: ['string', 'null'],
      notEmpty: true,
      errors: {
        required: Response.errors.EMAIL_REQUIRED
      }
    },
    password: {
      type: ['string', 'null'],
      notEmpty: true,
      errors: {
        required: Response.errors.PASSWORD_REQUIRED
      }
    }
  },
  required: ['email', 'password']
}

module.exports = loginSchema