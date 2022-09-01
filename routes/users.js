'use strict';

module.exports = function(app) {
    const userHandlers = require('../controllers/userController.js');
    app.route('/profile')
        .post(userHandlers.loginRequired, userHandlers.profile);
    app.route('/register')
        .post(userHandlers.register);
    app.route('/login')
        .post(userHandlers.login);
}