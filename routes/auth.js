const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// register
router.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    try {
        console.log(`salt: ${salt}, pass: ${req.body.password}`);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const savedUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        });

        try {
            const resultUser = await savedUser.save();
            res.status(200).json(resultUser);
        } catch (e) {
            res.json(e);
        }
    } catch (e) {
        res.status(500).json(e);
    }
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

// login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    console.log('success')
    if (user) {
        !user && res.status(400).json('wrong username');
        
        const validate = await bcrypt.compare(req.body.password, user.password);
        !validate && res.status(400).json('wrong password');
        
        const { password, ...others } = user._doc;
        res.render('users/login', { user: user });
        res.status(200).json(others);
    } else {
        res.status(500).json(e);
    }
});

router.get('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    res.render('users/login', { user: user });
});

module.exports = router;