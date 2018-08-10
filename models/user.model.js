const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const constants = require('../constants');
const emails = process.env.ADMIN_EMAILS;

const ADMIN_EMAIL1 = process.env.ADMIN_EMAIL1;
const ADMIN_EMAIL2 = process.env.ADMIN_EMAIL2;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required'        
    },
    lastname: {
        type: String,
        required: 'Last name is required'        
    },
    email: {
        type: String,
        required: 'Email is required',
        unique: 'Email already registered',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: 'password is required'
    },
    image: {
        type: String,
        path: String,
        originalName: String,
        default: 'avatar.png'
    },
    background: {
        type: String,
        path: String,
        originalName: String,
        default: 'background.jpg'
    },
    career:{
        type: String,
        maxlength: 40
    },
    hobbies:String, 
    // requests: [String],
    numberOfFriends: {
        type: Number,
        default: 0
    },
    havePendingRequests:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: [constants.user.ADMIN, constants.user.GUEST],
        default: constants.user.GUEST
    },
    token: String,
    active: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

function generateToken() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}


userSchema.pre("save", function(next) {

    // TODO: refactor with ADMIN_EMAILS 
    if (this.email === ADMIN_EMAIL1 || this.email === ADMIN_EMAIL2) {
        this.role = constants.user.ADMIN;
    }
    
    if (this.isNew) {
        this.token = generateToken();
    }
    
    if (this.isModified('password')) {
        console.log('PASSWORD MODIFIED');
        
        bcrypt.genSalt(saltRounds)
        .then(saltValue => {
            return bcrypt.hash(this.password, saltValue);
        })
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(() => {
            this.password = null;
            next();
        });
    } else {
        console.log('PASSWORD NOT MODIFIED');     
        next();
    }
});

userSchema.methods.checkPassword = function(passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password); 
};

const User = mongoose.model('User', userSchema);

module.exports = User;
