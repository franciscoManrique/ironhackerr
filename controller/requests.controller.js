// const User = require('./../models/user.model');
// const Friendship = require('./../models/frienship.model');
// const mongoose = require('mongoose');
// const createError = require('http-errors');

// module.exports.list = (req, res, next) => {
//   const me = req.user._id;  
  
//   Friendship.findOne({ friendship: { $in: [me] } })
//   // .populate('friendship')
//   .then(friendship => {
//     if (friendship) {    
      
//       let friendId = friendship.friendship.filter(f => !f.equals(me))[0];
      
//       //EL POPULATE NOS AHORRA ESTO!!!  
//       User.findById(friendId)
//       .then(friend =>{
        
//           res.render("users/friendRequest", {friend, friendship, me});      
//       })
//       .catch(error =>{
//         if (error instanceof mongoose.Error.CastError) {
//           next(createError(404, 'FRIENDSHIP NOT FOUND'));
//         } else{
//           next(error);
//         }
//       });   
//     } else{
//       res.render("users/friendRequest", {error: 'You dont have requests'});
//     }
//   })
//   .catch(error => {
//     if (error instanceof mongoose.Error.CastError) {
//       next(createError(404, `friendshipw not found`));
//     } else{
//       next(error);
//     }
//   });
// };

