'use strict';

const mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = require('../models/user');

// const User = mongoose.model('User');

exports.register = function(req, res) {
    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function (e, user) {
        if (e) {
            return res.status(400).send({
                message: e
            });
        } else {
            user.password = undefined;
            return res.json(user);
        }
    });
};

exports.login = function(req, res) {
    User.findOne({
        email: req.body.email
    }, function (e, user) {
        if (e) throw e;
        if (!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({ message: 'authentication failed. invalid user or password.' });
        }
        return res.json({
            token: jwt.sign({ 
                email: user.email, 
                username: user.username, 
                _id: user._id }, 
            'RESTFULAPIs')});
    });
};

exports.loginRequired = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'unauthorized user' });
    }
};

exports.profile = function(req, res, next) {
    if (req.user) {
        res.send(req.user);
        next();
    } else return res.status(401).json({ message: 'invalid token' });
};