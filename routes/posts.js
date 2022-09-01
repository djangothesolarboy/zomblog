const express = require('express');
const Post = require('./../models/post');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('posts/new', { post: new Post() });
});

router.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post: post });
});

router.get('/:slug', async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug });
    if (post == null) res.redirect('/');
    res.render('posts/view', { post: post});
});

router.post('/', async (req, res, next) => {
    req.post = new Post();
    next();
}, redirectOnSavedPost('new'));

router.put('/:id', async (req, res, next) => {
    req.post = await Post.findById(req.params.id);
    next();
}, redirectOnSavedPost('edit'));

router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

function redirectOnSavedPost(path) {
    return async (req, res) => {
        let post = req.post;
        post.title = req.body.title;
        post.username = req.body.username;
        post.description = req.body.description;
        post.markdown = req.body.markdown;
        
        if (post) {
            post = await post.save();
            res.redirect(`/posts/${post.slug}`);
        } else {
            res.render(`posts/${path}`, { post: post });
        }

    }
}

module.exports = router;