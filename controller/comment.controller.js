const constants = require("../constants");
const mongoose = require("mongoose");
const createError = require("http-errors");
const Post = require("../models/posts.model");
const Comment = require("../models/comments.model");
const User = require("../models/user.model");

module.exports.doCreate = (req, res, next) =>{
    const userId = req.params.userId;
    const postId = req.params.postId;
    const creatorOfPost = req.user._id.toString();
    
    User.findById(userId)
    .then(user =>{        
        if (user) {
            const comment = new Comment({text: req.body.text, post: postId, author: creatorOfPost});
            return comment.save()
            .then(comment =>{                
                console.log('COMMENT FROM => ' + creatorOfPost + ' TO POST => ' + postId);
                res.redirect(`/users/${userId}`);
            });
        } else{            
            next(createError(404, 'user does not exist'));
        }
    })
    .catch(error =>{
        if(error instanceof mongoose.Error.CastError){
            next(createError(404));
        } else if(error instanceof mongoose.Error.ValidationError){
            //necesito poneer 4 promesas??? VER FLASH
            res.redirect(`/users/${userId}`);
        } else{
            next(error)
        }
    });
};

module.exports.doDelete = (req, res, next) =>{
    
    Comment.findById(req.params.commentId)
    .populate('author')
    .then(comment =>{
        if (req.user._id.equals(comment.author._id)|| req.user.role === 'ADMIN') {
            return comment.remove()
            .then(()=>{
                console.log('COMMENT REMOVED BY OWNER OR ADMIN');
                res.redirect(`/users/${req.params.userId}`);
            });
        } else{
            console.log('INSUFFICIENT PRIVILAGES BUDDY');
            next(createError(403, `insufficient privilages ${req.user.name}`));
        }
    })
    .catch(error =>{
        if (error instanceof mongoose.Error.CastError) {
            next(createError(404));
        } else{
            next(error);
        }
    });
    
    
    // if (req.user._id.equals()) {
    
    // }
    
    // Comment.findByIdAndRemove(req.params.commentId)
    // .then(()=>{
    //     console.log('COMMENT DELETED');
    //     res.redirect(`/users/${req.params.userId}`);
    // })
    // .catch(error =>{
    //     if(error instanceof mongoose.Error.CastError){
    //         next(createError(404));
    //     } else{
    //         next(error);
    //     }
    // })
};
