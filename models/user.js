'use strict';

const bcrypt = require('bcryptjs')

const mongoose = require(__basedir+'/libs/mongoose')
const Database = require(__basedir+'/database/database')
const Validation = require(__basedir+'/libs/validation')

let schemaOptions = {
    timestamps: {}
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

let User = mongoose.model(Database.models.User.NAME, userSchema)

module.exports = User