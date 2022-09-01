const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// register
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const savedUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        const resultUser = await savedUser.save();
        res.status(200).json(resultUser);
    } catch (e) {
        res.status(500).json(e);
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(400).json('wrong username');

        const validate = await bcrypt.compare(req.body.password, user.password);
        !validate && res.status(400).json('wrong password');

        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;