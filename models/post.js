const mongoose = require('mongoose');
const {marked} = require('marked'); // markdown
const slugify = require('slugify'); 
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unqiue: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

postSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }

    next();
});

module.exports = mongoose.model('Post', postSchema);