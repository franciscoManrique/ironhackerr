const constants = require('../constants');
const Friendship = require('../models/frienship.model');
const createError = require('http-errors');

module.exports.auth = (req, res, next) =>{    
    if (req.isAuthenticated()) {        
        next();
    } else{                
        res.status(401).redirect('/sessions/create');
    }
};

module.exports.notAuth = (req, res, next) =>{
    if (req.isAuthenticated()) {
        res.redirect(`/${req.user._id}`);
    } else {
        next();
    }
};

module.exports.isOwneredByOwnSession = (req, res, next) =>{
    if (req.isAuthenticated() && (req.params.userId == req.user._id || req.params.id == req.user._id || req.user.role === constants.user.ADMIN)) {
        console.log('OWNER IS LOGGED AND CONFIRMED IDENTIITY');
        next();     
    } else{
        console.log('NOT PRIVILAGES TO UPDATE');
        next(createError(403, `insufficient privilages ${req.user.name}`));    
    }
};


module.exports.checkRole = role =>{
    return(req, res, next) =>{
        if (req.user.role === role) {
            next();
            console.log('PASSED MIDDLEWARE TO DELETE USER');   
        } else{
            console.log('NOT PRIVILAGES  TO DELETE');
            next(createError(403, `insufficient privilages ${req.user.name}`));    
        }
    };
};




// const exists = (users, ownerId) => {
//     for (let i = -1; ++i < users.length;) {
//         if (users[i].equals(ownerId)) return true;        
//     }
//     return false;
// };

// // transducers siguen iterando despues de tener un return excepto el for 

// const isOwner = (ownerId, users) => exists(users, ownerId);
// const isPartner = (visiting, users) => exists(users, visiting);

module.exports.blockFriendList = (req, res, next) =>{
    const ownerId = req.user._id;
    const visiting = req.params.id;
    
    Friendship.findOne({
        $and: [
            {$or: [{ owner: ownerId }, { receiver: ownerId }]},
            {$or: [{ owner: visiting }, { receiver: visiting }]}
        ]
    })
    .then(friendship => {
        
        if (friendship || ownerId.equals(visiting)) {
            next();
        } else {
            next(createError(403, 'insufficient privilages'));
        }
    })
    .catch(error =>{
        console.log(error);  
    });    
};

