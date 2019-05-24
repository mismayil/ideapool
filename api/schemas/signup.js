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
      type: 'string',
      format: APISchema.formats.EMAIL,
      default: '',
      minLength: 1,
      errors: {
        required: {
          error: Response.errors.EMAIL_REQUIRED
        },
        format: {
          error: Response.errors.INVALID_EMAIL
        }
      }
    },
    password: {
      type: 'string',
      format: APISchema.formats.PASSWORD,
      minLength: 1,
      default: '',
      errors: {
        required: {
          error: Response.errors.PASSWORD_REQUIRED
        },
        format: {
          error: Response.errors.INVALID_PASSWORD
        }
      }
    },
    name: {
      type: 'string',
      minLength: 1,
      default: '',
      errors: {
        required: {
          error: Response.errors.NAME_REQUIRED
        }
      }
    }
  },
  required: ['email', 'password', 'name']
}

module.exports = signupSchema