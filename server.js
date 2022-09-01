const express = require('express'),
    cors = require('cors');
    mongoose = require('mongoose'),
    postRouter = require('./routes/posts'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    jsonwebtoken = require('jsonwebtoken'),
    Post = require('./models/post');

let corsOptions = {
    origin: "https://localhost:5000"
};

let app = express();
require('dotenv').config();

mongoose.connect(process.env.DB_URI);

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use('/posts', postRouter);

app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (e, decode) {
            if (e) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
})

const users = require('./routes/users');
users(app);

app.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdOn: 'desc' });
    res.render('posts/index', { posts: posts });
});

app.listen(process.env.DB_PORT);

module.exports = app;