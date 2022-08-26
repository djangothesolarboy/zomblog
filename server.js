const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post');
const postRouter = require('./routes/posts');
const methodOverride = require('method-override');
const app = express();
require('dotenv').config()

mongoose.connect(process.env.DB_URI);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use('/posts', postRouter);

app.get('/', async (req, res) => {
    const posts = await Post.find().sort({ createdOn: 'desc' });
    res.render('posts/index', { posts: posts });
});

app.listen(process.env.DB_PORT);