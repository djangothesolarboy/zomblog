'use strict';

module.exports = function(app) {
    const userHandlers = require('../controllers/userController.js');
    app.route('/register')
        .post(userHandlers.register);
    app.route('/login')
        .post(userHandlers.login);
}