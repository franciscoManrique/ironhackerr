const mongoose = require('mongoose');
const constants = require('../constants');

const friendsSchema = mongoose.Schema({
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    
    status: {
        type: String,
        enum: [constants.status.PENDING, constants.status.FRIENDS, constants.status.BLOCKED],
        default: constants.status.PENDING
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} 
}, {timestamps: true});

const Friendship = mongoose.model('Friendship', friendsSchema);

module.exports = Friendship;

