'use strict';

const _ = require('lodash')

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
    if (idea.user != user.id) return Response.sendError(res, Response.errors.UNAUTHORIZED_DELETE, Response.status.CONFLICT)

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
    let idea = await Idea.findOne({key: key})

    if (!idea) return Response.sendError(res, Response.errors.IDEA_NOT_FOUND(key), Response.status.CONFLICT)
    if (idea.user != user.id) return Response.sendError(res, Response.errors.UNAUTHORIZED_UPDATE, Response.status.CONFLICT)

    idea = await Idea.findByIdAndUpdate(idea.id, {content, impact, ease, confidence}, {new: true})

    return Response.sendData(res, idea.getJSON(), Response.status.OK)
  } catch (err) {
    return next(err)
  }
}

IdeaCtrl.getIdeas = async function(req, res, next) {
  try {
    const user = req.user
    let {page = 1} = req.query
    page = _.toInteger(page)
    
    if (page < 1) return Response.sendError(res, Response.errors.INVALID_PAGE, Response.status.CONFLICT)

    let ideas = await Idea.find({user: user.id})
    ideas = ideas.map(idea => idea.getJSON())

    ideas.sort((a, b) => b.average_score - a.average_score)

    return Response.sendData(res, _.slice(ideas, (page-1) * 10 + 1, page * 10 + 1), Response.status.OK)
  } catch (err) {
    return next(err)
  }
}

module.exports = IdeaCtrl