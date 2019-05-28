'use strict'

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const config = require('config')

const User = require(__basedir+'/models/user')
const Response = require(__basedir+'/api/response')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
    let user = await User.findOne({email: email})
    
    if (user) {
      let isMatch = await user.comparePassword(password)
      if (isMatch) return done(null, user)
      return done(Response.errors.INVALID_LOGIN)
    }
    
    return done(Response.errors.INVALID_LOGIN)
  }
))

function extractJWT(req) {
  return req.header('X-Access-Token')
}

passport.use(new JwtStrategy({
    jwtFromRequest: extractJWT,
    secretOrKey: config.get('api.SECRET')
  },
  async function(payload, done) {
    try {
      let user = await User.findById(payload.user)
      if (user) return done(null, user)
      return done(Response.errors.UNAUTHORIZED)
    } catch (err) {
      done(err)
    }
  }
))

module.exports = passport