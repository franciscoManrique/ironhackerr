const constants = require("../constants");
const mongoose = require("mongoose");
const createError = require("http-errors");
const mail = require("../services/mail.service");
const User = require("./../models/user.model");
const Post = require("./../models/posts.model");
const Friendship = require("./../models/frienship.model");
const Comment = require("../models/comments.model");


module.exports.create = (req, res, next) => {
  res.render("users/create");
};

module.exports.doCreate = (req, res, next) => {
  
  User.findOne({ email: req.body.email })
  .then(user => {
    if (user) {
      res.render("users/create", { user: req.body, errors: { email: "user exists" } });
    } else {
      user = new User(req.body);
      return user.save()
      .then(user => {
        
        mail.sendToken(user);
        
        console.log("USER SAVED");
        res.redirect("/sessions/create");
      });
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404, "cast error"));
    } else if (error instanceof mongoose.Error.ValidationError) {
      res.render("users/create", {
        user: req.body,
        errors: error.errors
      });
    } else {
      next(error);
    }
  });
};



// module.exports.profile = (req, res, next) => {
//   Promise.all([
//     User.findById(req.params.id),
//     Post.find({ author: req.params.id }),
//     Comment.find({author: req.params.id}).populate('author').populate('post')
//   ])
//   .then(([user, posts, comments]) => { //destructor 
//         console.log(comments);

//     if (!user) {
//       next(createError(404));
//     } else {
//       return Friendship.findOne({$and:[{$or:[{owner: req.user._id, receiver: req.params.id}, {owner: req.params.id, receiver: req.user._id}]},{status:'FRIENDS'}]})
//       .then(friendship =>{
//         if (friendship || req.user._id.equals(req.params.id)) {
//           console.log('IS YOU or IS YOUR FRIEND');
//           res.render("users/profile", { user, posts, comments});
//         } else{      
//           console.log('YOU ARE NOT FRIENDS');  
//           res.render("users/profile", { user, error: {notFriend: 'You are not friends yet'} });
//         }
//       });
//     }
//   })
//   .catch(error => {
//     if (error instanceof mongoose.Error.CastError) {      
//       next(createError(404));
//     } else {      
//       next(error);
//     }
//   });
// };


module.exports.profile = (req, res, next) => {
  
  Promise.all([
    User.findById(req.params.id),
    Post.find({ author: req.params.id })
    .populate('author')
  ])
  .then(([user, posts]) => { //destructor  
    
    return Comment.find({post: {$in:posts}})
    .populate('author')
    .populate('post')
    .then(comments =>{      
      
      if (!user) {
        next(createError(404));
      } else {
        return Friendship.findOne({$and:[{$or:[{owner: req.user._id, receiver: req.params.id}, {owner: req.params.id, receiver: req.user._id}]},{status:'FRIENDS'}]})
        .then(friendship =>{
          if (friendship || req.user._id.equals(req.params.id)) {
            console.log('IS YOU or IS YOUR FRIEND');            
            res.render("users/profile", { user, posts, comments});
          } else{
            console.log('YOU ARE NOT FRIENDS');  
            res.render("users/profile", { user, error: {notFriend: 'You are not friends yet'} });
          }
        });
      }
    });
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {            
      next(createError(404));
    } else {            
      next(error);
    }
  });
};


module.exports.list = (req, res, next) => {
  //ME QUITO ASI NO SALGO YO
  const criteria = {'_id': { $ne: req.user._id }};
  
  if (req.query.name) {
    criteria.name = req.query.name;
  }
  
  let page = 0;
  if (req.query.page) {
    page = Number(req.query.page) || 0;
    console.log(page);
  }
  
  User.find(criteria)
  // .limit(5)
  .skip(5 * page) 
  .sort({'name': 1})
  .then(users => {
    if (users.length === 0) {
      res.render("users/list", { errors: 'No users found'});
    } else{
      
      Friendship.find({ $or: [{ owner: req.user._id }, { receiver: req.user._id  } ]})
      .then(friendships =>{
        if (friendships) {
          res.render("users/list", { users, friendships });
        } else{          
          res.render("users/list", { users });
        }
      })
      .catch(error =>{        
        next(error);
      });
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404, `user not found`));
    }
  });
};


module.exports.update = (req, res, next) => {
  console.log("UPDATE");
  const id = req.params.id;
  User.findById(id)
  .then(user => {
    if (user) {
      res.render("users/edit", { user });
    } else {
      next(createError(404, "User not found"));
    }
  })
  .catch(error => {
    next(error);
  });
};

module.exports.doUpdate = (req, res, next) => {
  console.log('DO UPDATE');
  console.log(req.file);
  
  const id = req.params.id;
  
  const criteria = {
    $set:req.body
  };
  
  if (req.file) {
    criteria.image = req.file.filename;
  }
  
  
  delete req.body.password;
  if (req.user.role !== constants.user.ADMIN) {
    delete req.body.role;
    // req.body.role = 'GUEST';
  }
  
  User.findByIdAndUpdate(id,criteria,{ runValidators: true, new: true })
  .then(user => {
    if (user) {
      console.log(user);
      
      console.log("USER UPDATED");
      res.redirect(`/users/${id}/`);
    } else {
      next(createError(404, "User not found"));
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      req.body.id = id; // en el momento de haber error ya no hay id en body asique lo reasigno
      res.render("users/edit", { user: req.body, errors: error.errors });
    } else {
      next(error);
    }
  });
};

module.exports.confirm = (req, res, next) => {
  const tokenUser = req.query.token;
  
  User.findOne({ token: tokenUser })
  .then(user => {
    if (user) {
      user.active = true;
      return user.save()
      .then(user => {
        res.redirect("/sessions/create");
      });
    } else {
      next(createError(404));
    }
  })
  .catch(error => {
    next(error);
  });
};


module.exports.friendList = (req, res, next) => {
  const friendId = req.params.id;
  
  Friendship.find({$and:[{$or:[{owner: req.params.id}, {receiver: req.params.id}]},{status:'FRIENDS'}]})
  .populate('users')
  .populate('owner')
  .populate('receiver')
  .then(friendships =>{
    if (friendships.length > 0) {
      
      const friendsArray = friendships.map(element=>{
        return element.users.filter(el=>{
          return !el.equals(friendId);
        })
      })
      
      const friends = friendsArray.map(elem =>{
        return elem[0];
      })
      
      res.render('friends/list', {friends, friendId});
      
      
      // const friendsArray = friendships.map(element=>{
      //   if (!req.user._id.equals(element.owner._id) && !req.user._id.equals(element.receiver._id)) {          
      //     next(createError(403, `Insufficient privilages STALKER ${req.user.name}`));
      //   } else{          
      //     return element.users.filter(el=>{            
      //       return !el.equals(friendId);
      //     });          
      //     const friends = friendsArray.map(elem =>{
      //       console.log(elem);
      
      //       return elem[0]; 
      //     }) 
      //     res.render('friends/list', {friends, friendId});
      //   }
      // })
      
    } else{
      res.render('friends/list', {error: {noFriends: 'You dont have friends LOSER!'}});
    }
    
  })
  .catch(error => {
    if (error instanceof mongoose.Error.CastError) {
      next(createError(404));
    } else{
      next(error);
    }
  });
};

module.exports.showGallery = (req, res, next) => {


};

module.exports.doDelete = (req, res, next) => {
  
  Promise.all([
    Friendship.deleteMany({ $or: [{ owner: req.params.id }, { receiver: req.params.id } ]}),
    User.findByIdAndRemove(req.params.id),
    Post.find({author: req.params.id}),
  ])
  .then(([friendships, users, posts])=>{ 
    
    return Comment.deleteMany({post:posts})
    .then((comments) =>{      
      return Post.deleteMany({author: req.params.id})
      .then((posts)=>{
        res.redirect('/users/list');
      })
    })
  }) 
  .catch(error =>{
    console.log(error);
  })
};
