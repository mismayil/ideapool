'use strict';

const _ = require('lodash')

const utils = require(__basedir+'/libs/utils')
const logger = require(__basedir+'/libs/logger')
const User = require(__basedir+'/models/user')
const Idea = require(__basedir+'/models/idea')
const Response = require(__basedir+'/api/response')

let IdeaCtrl = {}

IdeaCtrl.createIdea = async function(req, res, next) {
  try {
    const {content, impact, ease, confidence} = req.body
    const user = req.user

    let idea = new Idea({user: user.id, content, impact, ease, confidence})
    idea = await idea.save()

    return Response.sendData(res, idea.getJSON())
  } catch (err) {
    return next(err)
  }
}

IdeaCtrl.deleteIdea = async function(req, res, next) {
  try {
    const key = req.params.id
    const user = req.user
    const idea = await Idea.findOne({key: key})

    if (!idea) return Response.sendError(res, Response.errors.IDEA_NOT_FOUND(key), Response.status.CONFLICT)
    if (idea.user !== user.id) return Response.sendError(res, Response.errors.UNAUTHORIZED_DELETE)

    await Idea.findByIdAndDelete(idea.id)

    return res.sendStatus(Response.status.NO_CONTENT)
  } catch (err) {
    return next(err)
  }
}

IdeaCtrl.updateIdea = async function(req, res, next) {
  try { 
    const key = req.params.id
    const {content, impact, ease, confidence} = req.body
    const user = req.user
    const idea = await Idea.findOne({key: key})

    if (!idea) return Response.sendError(res, Response.errors.IDEA_NOT_FOUND(key), Response.status.CONFLICT)
    if (idea.user !== user.id) return Response.sendError(res, Response.errors.UNAUTHORIZED_UPDATE)

    await Idea.findByIdAndUpdate(idea.id, {content, impact, ease, confidence})

    return Response.sendData(res, idea.getJSON())
  } catch (err) {
    return next(err)
  }
}

module.exports = IdeaCtrl