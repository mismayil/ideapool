'use strict';

const Response = require(__basedir+'/api/response')

let refreshTokenSchema = {
    '$id': 'http://api-ideapool.herokuapp.com/schemas/refreshToken.json',
    title: 'Refresh Token',
    description: 'Refresh Token Schema',
    type: 'object',
    properties: {
        refresh_token: {
          type: ['string', 'null'],
          notEmpty: true,
          errors: {
            required: Response.errors.REFRESH_TOKEN_REQUIRED
          }
        }
    },
    required: ['refresh_token']
}

module.exports = refreshTokenSchema