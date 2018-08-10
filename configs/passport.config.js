const User = require("../models/user.model");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const constants = require('../constants');

module.exports.setup = passport => {
    passport.serializeUser((user, next) => {
        next(null, user._id);
    });
    
    passport.deserializeUser((id, next) => {
        User.findById(id)
        .then(user => {
            next(null, user);
        })
        .catch(error => {
            next(error);
        });
    });
    
    passport.use("local-auth", new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },(email, password, next) => {
        User.findOne({ email: email, active: true}) //si no esta activado no funcionara
        .then(user=>{
            if (user) {
                return user.checkPassword(password)
                .then(match =>{
                    if (match) {
                        next(null, user);
                        console.log('CORRECT PASSWORD');
                    } else{
                        next(null, null, {password:'Invalid email or password'});
                        console.log('INCORRECT PASSWORD');
                    }
                });
            } else {                
                next(null, null, {password:'invalid email or password'});
            }
        })
        .catch(error => {             
            next(error);
        });
    }));
};

