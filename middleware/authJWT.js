const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db =require('../models');
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: 'no token provided.' });
    }
    jwt.verify(token, config.secret, (e, decoded) => {
        if (e) return res.status(401).send({ message: 'unauthorized.' });
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((e, user) => {
        if (e) {
            res.status(500).send({ message: e });
            return;
        }
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'admin') {
                next();
                return;
            }
        }
        res.status(403).send({ message: 'admin role required.' });
        return;
    });
};

const authJWT = {
    verifyToken,
    isAdmin
};

module.exports = authJWT;