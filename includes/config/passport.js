const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Logger = require("../AristosLogger/AristosLogger").Logger;

module.exports = function (passport) {
    passport.use(new localStrategy(function (username, password, done) {

        User.findOne({ username: username }, function (err, user) {
            if (err) { Logger.error(err)};
            if (!user) {
                return done(null, false, { message: "No user found" });
            }

            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) { Logger.error(err) };
                if (isMatch) {
                    Logger.info(user.username + " has Logged in!")
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Wrong password." })
                }
            })
        })
    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id);

    })
    passport.deserializeUser(function (id, done) {
       User.findById(id, function(err, user){
        if (err) { Logger.error(err)};
           done(err, user)
       })

    })
}