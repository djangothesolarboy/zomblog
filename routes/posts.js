const express = require('express');
const Post = require('./../models/post');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('posts/new', { post: new Post() })
});

router.get('/:slug', async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug });
    if (post == null) res.redirect('/');
    res.render('posts/view', { post: post});
})

router.post('/', async (req, res) => {
    let post = new Post({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
    });

    try {
        post = await post.save();
        res.redirect(`/posts/${post.slug}`);
    } catch (e) {
        res.render('posts/new', { post: post });
    }
});

router.delete('/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

module.exports = router;