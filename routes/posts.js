const express = require('express');
const Post = require('./../models/post');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('posts/new')
});

router.get('/:id', (req, res) => {

})

router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
    });

    try {
        post = await post.save();
        res.redirect(`/posts/${post.id}`);
    } catch (e) {
        res.render('posts/new', { post: post });
    }
});

module.exports = router;