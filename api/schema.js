'use strict';

let Schema = {}

Schema.names = {
  SIGNUP: 'signup',
  LOGIN: 'login',
  REFRESH_TOKEN: 'refresh-token',
  IDEA: 'idea'
}

Schema.formats = {
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  SCORE: 'SCORE'
}

module.exports = Schema
