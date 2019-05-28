'use strict';

const express = require('express')

const Request = require(__basedir+'/api/request')
const APISchema = require(__basedir+'/api/schema')
const IdeaCtrl = require(__basedir+'/controllers/idea.ctrl')

let router = express.Router()

router.post('/',
  Request.validate(APISchema.names.IDEA),
  IdeaCtrl.createIdea
)

router.delete('/:id', IdeaCtrl.deleteIdea)

router.put('/:id', 
  Request.validate(APISchema.names.IDEA),
  IdeaCtrl.updateIdea
)

router.get('/', IdeaCtrl.getIdeas)

module.exports = router