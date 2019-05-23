'use strict';

const APISchema = require(__basedir+'/api/schema')

let idSchema = {
    '$id': 'http://api-ideapool.herokuapp.com/schemas/id.json',
    title: 'ID',
    description: 'ID Schema',
    type: 'object',
    properties: {
        id: {
          type: 'string',
          format: APISchema.formats.ID
        }
    },
    required: ['id']
}

module.exports = idSchema