'use strict';

const Response = require(__basedir+'/api/response')

let ideaSchema = {
  '$id': 'http://api-ideapool.herokuapp.com/schemas/idea.json',
  title: 'Idea',
  description: 'Idea Schema',
  type: 'object',
  properties: {
    content: {
      type: 'string',
      notEmpty: true,
      maxLength: 255,
      errors: {
        required: Response.errors.CONTENT_REQUIRED,
        format: Response.errors.CONTENT_TOO_LONG
      }
    },
    impact: {
      anyOf: [
        {type: 'number'},
        {type: 'string'}
      ],
      notEmpty: true,
      number: true,
      integer: true,
      minimum: 1,
      maximum: 10,
      errors: {
        required: Response.errors.IMPACT_REQUIRED,
        type: Response.errors.IMPACT_NAN,
        number: Response.errors.IMPACT_NAN,
        integer: Response.errors.IMPACT_NINT,
        minimum: Response.errors.IMPACT_MIN_0,
        maximum: Response.errors.IMPACT_MAX_10
      }
    },
    ease: {
      anyOf: [
        {type: 'number'},
        {type: 'string'}
      ],
      notEmpty: true,
      number: true,
      integer: true,
      minimum: 1,
      maximum: 10,
      errors: {
        required: Response.errors.EASE_REQUIRED,
        type: Response.errors.EASE_NAN,
        number: Response.errors.EASE_NAN,
        integer: Response.errors.EASE_NINT,
        minimum: Response.errors.EASE_MIN_0,
        maximum: Response.errors.EASE_MAX_10
      }
    },
    confidence: {
      anyOf: [
        {type: 'number'},
        {type: 'string'}
      ],
      notEmpty: true,
      number: true,
      integer: true,
      minimum: 1,
      maximum: 10,
      errors: {
        required: Response.errors.CONFIDENCE_REQUIRED,
        type: Response.errors.CONFIDENCE_NAN,
        number: Response.errors.CONFIDENCE_NAN,
        integer: Response.errors.CONFIDENCE_NINT,
        minimum: Response.errors.CONFIDENCE_MIN_0,
        maximum: Response.errors.CONFIDENCE_MAX_10
      }
    }
  },
  required: ['content', 'impact', 'ease', 'confidence']
}

module.exports = ideaSchema