'use strict';

const Response = require(__basedir+'/api/response')
const APISchema = require(__basedir+'/api/schema')

let loginSchema = {
  '$id': 'http://api-ideapool.herokuapp.com/schemas/login.json',
  title: 'Login',
  description: 'User Login Schema',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      notEmpty: true,
      errors: {
        required: {
          error: Response.errors.EMAIL_REQUIRED
        }
      }
    },
    password: {
      type: 'string',
      notEmpty: true,
      errors: {
        required: {
          error: Response.errors.PASSWORD_REQUIRED
        }
      }
    }
  },
  required: ['email', 'password']
}

module.exports = loginSchema