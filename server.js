const express = require('express'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    postRouter = require('./routes/posts'),
    userRouter = require('./routes/auth'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    jsonwebtoken = require('jsonwebtoken'),
    Role = require('./models/role.model'),
    Post = require('./models/post');

let corsOptions = {
    origin: "https://localhost:5000"
};

let app = express();
require('dotenv').config();

mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('connected', () => console.log('database connected.'));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use('/posts', postRouter);
app.use('/users', userRouter);

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
});

function initial() {
    Role.estimatedDocumentCount((e, count) => {
        if (!e && count === 0) {
            new Role({
                name: 'user'
            }).save(e => {
                if (e) { 
                    console.log('error', e);
                } 
                console.log('added "user" to roles');''
            });
            new Role({
                name: 'admin'
            }).save(e => {
                if (e) {
                    console.log('error', e);
                }
                console.log('added "admin" to roles');
            })
        }
    })
}

const users = require('./routes/users');
users(app);

app.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdOn: 'desc' });
    res.render('posts/index', { posts: posts });
});

app.listen(process.env.DB_PORT);

module.exports = app;