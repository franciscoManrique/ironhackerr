const constants = require("../constants");
const mongoose = require("mongoose");
const createError = require("http-errors");
const mail = require("../services/mail.service");
const User = require("./../models/user.model");
const Post = require("./../models/posts.model");
const Comment = require("./../models/comments.model");

module.exports.doCreate = (req, res, next) => {
  const userId = req.params.userId;
  console.log(req.body);
  console.log(req.file);
  
  
  const criteria = {title: req.body.title, text: req.body.text, author: userId};
  
  if (req.file) {
    criteria.image = req.file.filename;
  }
  
  User.findById(userId)
  .then(user => {
    if (user) {
      
      const post = new Post(criteria);
      
      post.save()
      .then(post => {
        console.log('POST CREATED');
        res.redirect(`/${user._id}`);
      }) //NO PUEDO PONER ESTE ERROR ABAJO COMPARTIDO YA QUE USER NO EXISTIRIA
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          Post.find({ author: userId })
          .then(posts => {
            res.render("users/profile", { user: user, posts:posts, errors: error.errors });
          });
        } else {
          next(error);
        }
      });
    } else{
      next(createError(404, 'user not found'));
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404, 'cast error'));
    } else {
      next(error);
    }
  });
  
  
};


module.exports.doDelete = (req, res, next) => {
  const postId = req.params.postId;
  Promise.all([
    Post.findByIdAndRemove(postId),
    Comment.deleteMany({post:postId})
  ])
  .then(()=>{ 
    console.log("DELETED POST AND COMMENTS ON THIS POST");    
    res.redirect(`/${req.params.userId}`);
  })
  .catch(error =>{
    if(error instanceof mongoose.Error.CastError){
      next(createError(404));
    } else{
      next(error);
    }
  });
};



module.exports.doUpdate = (req, res, next) => {
  likesCounter++;
  const id = req.params.id;
  
  Post.findByIdAndUpdate(id, {$set:{likes:likesCounter}}, { runValidators: true, new: true })
  .then(post =>{
    
    if (post) {
      console.log("POST UPDATED");
      res.redirect(`/${id}`);
    } else {     
      next(createError(404, "Post not updated"));
    }
  })
  .catch(error => {    
    next(error);
  });
  
};
