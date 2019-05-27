'use strict';

const bcrypt = require('bcryptjs')
const md5 = require('md5')
const _ = require('lodash')

const mongoose = require(__basedir+'/libs/mongoose')
const Database = require(__basedir+'/db/database')
const Validation = require(__basedir+'/libs/validation')

let schemaOptions = {
    timestamps: {}
}

schemaOptions.toJSON = {
    versionKey: false,
    transform: function(doc, ret, options) {
        delete ret._id
        delete ret.password
        delete ret.token
        delete ret.createdAt
        delete ret.updatedAt
        ret.avatar_url = `https://www.gravatar.com/avatar/${md5(_.toLower(_.trim(ret.email)))}?d=mm&s=200`
        return ret
    }
  }

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true,
        validate: {
            validator: Validation.isEmail,
            message: Validation.messages.INVALID_EMAIL
        }
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    token: String
}, schemaOptions)

userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password') || this.isNew) {
            let salt = await bcrypt.genSalt(10)
            this.password = await bcrypt.hash(this.password, salt)
            return next()
        }
    } catch (err) {
        return next(err)
    }
})

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
}

userSchema.methods.getModelName = function() {
    return Database.models.User.NAME
}

userSchema.methods.getJSON = function() {
    return this.toJSON()
  }

let User = mongoose.model(Database.models.User.NAME, userSchema)

module.exports = User