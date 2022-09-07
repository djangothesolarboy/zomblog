const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUser = (req, res, next) => {
    // username
    User.findOne({
        username: req.body.username
    }).exec((e, user) => {
        if (e) {
            res.status(500).send({ message: e });
            return;
        }
        if (user) {
            res.status(400).send({ message: 'username is already in use' });
            return;
        }
        User.findOne({
            email: req.body.email
        }).exec((e, user) => {
            if (e) {
                res.satus(500).send({ message: e });
                return;
            }
            if (user) {
                res.status(400).send({ message: 'email is already in use' });
                return;
            }
            next();
        });
    });
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `role ${req.body.roles[i]} does not exist.`
                });
                return;
            }
        }
    }
    next();
}

const verifyRegister = {
    checkDuplicateUser,
    checkRolesExisted
};

module.exports= verifyRegister;