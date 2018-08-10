require('dotenv').config(); //SI NO PONGO ESTO NO PODRE ACCEDER A .ENV URI DE MONGO

require('../configs/db.config');

const mongoose = require('mongoose');
const express = require('express');
const User = require("../models/user.model");
const users = require('../data/users');
const postsController = require('../controller/posts.controller');

User.insertMany(users)
.then(users=>{  
    console.log(`${users.length} inserted`);
})
.catch(error =>{
    console.log(error);
});


