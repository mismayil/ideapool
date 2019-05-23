'use strict';

const passport = require('passport');
// const BasicStrategy = require('passport-http').BasicStrategy;
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const config = require('config');

// const User = require(__basedir+'/models/schemas/user');
// const Response = require(__basedir+'/api/response');

// passport.use(new BasicStrategy(
//     async function (email, password, done) {
//         if (!email) return done(Response.errors.EMAIL_REQUIRED);
//         if (!password) return done(Response.errors.PASSWD_REQUIRED);

//         try {
//             let user = await User.findOne({email: email});
//             if (user) {
//                 if (user.isVerified()) {
//                     let isMatch = await user.comparePassword(password);
//                     if (isMatch) return done(null, user);
//                     return done(Response.errors.PASSWORD_MISMATCH);
//                 } else {
//                     return done(Response.errors.EMAIL_UNVERIFIED);
//                 }
//             } else {
//                 return done(Response.errors.USER_NOT_FOUND);
//             }
//         } catch (err) {
//             return done(err);
//         }
//     }
// ));

// passport.use(new JwtStrategy({
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         secretOrKey: config.get('api.SECRET')
//     },
//     async function(payload, done) {
//         try {
//             let user = await User.findById(payload.user.id);
//             if (user) return done(null, user);
//             return done(Response.errors.USER_NOT_FOUND, false);
//         } catch (err) {
//             done(err);
//         }
// }));

module.exports = passport;