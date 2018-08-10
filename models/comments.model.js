const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
    text: {
        type: String,
        required: 'Comment is required'
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    likes: Number,

}, {timestamps: true});

const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;





