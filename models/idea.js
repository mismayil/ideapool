'use strict';

const shortid = require('shortid')

const mongoose = require(__basedir+'/libs/mongoose')
const Database = require(__basedir+'/database/database')
const Validation = require(__basedir+'/libs/validation')

let schemaOptions = {
    timestamps: {}
}

schemaOptions.toJSON = {
  versionKey: false,
  transform: function(doc, ret, options) {
      ret.id = ret.key
      delete ret.key
      delete ret.user
      delete ret._id
      return ret;
  }
}

const ideaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Database.models.User.NAME
  },
  key: {
    type: String,
    default: shortid.generate()
  },
  content: {
    type: String,
    maxlength: 255
  },
  impact: {
    type: Number,
    validate: {
      validator: Validation.isScore,
      message: Validation.messages.INVALID_SCORE
    } 
  },
  ease: {
    type: Number,
    validate: {
      validator: Validation.isScore,
      message: Validation.messages.INVALID_SCORE
    }
  },
  confidence: {
    type: Number,
    validate: {
      validator: Validation.isScore,
      message: Validation.messages.INVALID_SCORE
    }
  }
}, schemaOptions)

ideaSchema.methods.getModelName = function() {
    return Database.models.Idea.NAME
}

ideaSchema.methods.getJSON = function() {
  return this.toJSON()
}

let Idea = mongoose.model(Database.models.Idea.NAME, ideaSchema)

module.exports = Idea
