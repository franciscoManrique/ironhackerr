const User = require('./../models/user.model');
const mongoose = require('mongoose');
const createError = require('http-errors');
const passport = require('passport');

module.exports.create = (req, res, next) => {
    res.render('sessions/create');
};

module.exports.doCreate = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        res.render('sessions/create', {
            user: req.body,
            errors: {
                password: password ? undefined : "Password can't be empty",
                email: email ? undefined : "Email can't be empty" 
            }
        });
    } else {
        passport.authenticate('local-auth', (error, user, validation) => {
            if (error) {
                next(error); 
            } else if(!user){
                res.render('sessions/create', { user: req.body, errors: validation });
            } else {
                req.login(user, (error) => {
                    if (error) {
                        next(error);  
                    } else {                        
                        res.redirect(`/users/${user._id}`);
                    }
                });
            }   
        })(req, res, next);
    }
    
};

module.exports.doDelete = (req, res, next) => {
    console.log('DESTROY');
    req.logout();
    res.redirect('/');
};

