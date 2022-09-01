'use strict';
const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unqiue: true,
        min: 3,
        max: 30
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unqiue: true
    },
    hash_password: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
}, { timestamps: true });

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
}

module.exports = mongoose.model('User', userSchema);