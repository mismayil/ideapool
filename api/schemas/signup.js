'use strict';

const Response = require(__basedir+'/api/response')
const APISchema = require(__basedir+'/api/schema')

let signupSchema = {
  '$id': 'http://api-ideapool.herokuapp.com/schemas/signup.json',
  title: 'Sign up',
  description: 'User Signup Schema',
  type: 'object',
  properties: {
    email: {
      type: ['string', 'null'],
      format: APISchema.formats.EMAIL,
      notEmpty: true,
      errors: {
        required: Response.errors.EMAIL_REQUIRED,
        format: Response.errors.INVALID_EMAIL
      }
    },
    password: {
      type: ['string', 'null'],
      format: APISchema.formats.PASSWORD,
      notEmpty: true,
      errors: {
        required: Response.errors.PASSWORD_REQUIRED,
        format: Response.errors.INVALID_PASSWORD
      }
    },
    name: {
      type: ['string', 'null'],
      notEmpty: true,
      errors: {
        required: Response.errors.NAME_REQUIRED
      }
    }
  },
  required: ['email', 'password', 'name']
}

module.exports = signupSchema