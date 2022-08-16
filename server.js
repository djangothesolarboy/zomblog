const express = require('express');
const mongoose = require('mongoose');
const postRouter = require('./routes/posts');
const app = express();

mongoose.connect('mongodb://localhost/blog');

app.set('view engine', 'ejs');
app.use('/posts', postRouter);
app.get('/', (req, res) => {
    const posts = [{
        title: 'test',
        createdOn: new Date(),
        description: 'lorem ipsum dolor sit amet, consectetur adip',
    }, 
    {
        title: 'test2',
        createdOn: new Date(),
        description: 'lorem ipsum dolor sit amet, consectetur adip',
    }]
    res.render('posts/index', { posts: posts });
});

app.listen(5000);