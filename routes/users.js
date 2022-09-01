'use strict';

module.exports = function(app) {
    const userHandlers = require('../controllers/userController.js');
    app.route('/auth/register')
        .post(userHandlers.register);
    app.route('/auth/login')
        .post(userHandlers.login);
}