const constants = require('../constants');
module.exports = (hbs) => {
    
    hbs.registerHelper('json', function(context){
        return JSON.stringify(context);
    });
    
    hbs.registerHelper('datetime', function(date) { // las fechas las querre poner bonitas
        let objFecha = new Date(date);        
        let opcionesFecha = {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
        let fechaFormateada = objFecha.toLocaleString('en-GB', opcionesFecha);
        
        return date ? fechaFormateada : undefined;// si no recibe fecha el helper da undefined
    });
    
    hbs.registerHelper('isAdmin', (context, options) =>{        
        if (context.role === constants.user.ADMIN) {            
            return options.fn(this);
        } else{            
            return options.inverse(this);
        }
    });
    
    hbs.registerHelper('sliptLastname', (context, options) =>{        
        return context.charAt(0).toUpperCase() + '.';
    });
    
    hbs.registerHelper('capitalize', (context, options) =>{    
        if (context) {
            return context.charAt(0).toUpperCase() + context.slice(1); 
        }
    });
    
    hbs.registerHelper('upperCase', (context, options) =>{    
        if(context){
            return context.toUpperCase();  
        }
    });
    
    hbs.registerHelper('isOwneredByOwnSession', function(user, session, options){     
        if (user && (user.id == session._id)) {                                    
            return options.fn(this);
        } else{                                                
            return options.inverse(this);
        }
    });
    
    hbs.registerHelper('isOwneredByOwnSessionCommentRelated', function(authorOfComment, session, options){  
        if (authorOfComment && (authorOfComment._id.equals(session._id)) || session.role === constants.user.ADMIN) {                                    
            return options.fn(this);
        } else{                                                
            return options.inverse(this);
        }
    });
    
    
    hbs.registerHelper('isNotFriend', function(user, friendships, options){
            const isMyFriend = friendships.some((friendship) => {
                return ((friendship.owner.equals(user._id) || friendship.receiver.equals(user._id)));
            });         
            
            if (!isMyFriend) {
                return options.fn(this);
            } else{                                    
                return options.inverse(this);
            }
    });
    
    hbs.registerHelper('isNotMe', function(owner, session, options) {
        if (owner._id.equals(session._id)) {            
            return options.fn(this);
        } else{            
            return options.inverse(this);
        } 
    });
    
    
    hbs.registerHelper('isYourCommentOverPost', function(comment, post, options) {
        if (comment.post && comment.post._id.equals(post._id)) {
            return options.fn(this);
        } else{
            return options.inverse(this);
        }
    });      

    hbs.registerHelper('datasetForScroll', function(date, options) {
        let objFecha = new Date(date);        
        let opcionesFecha = {day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
        let fechaFormateada = objFecha.toLocaleString('en-GB', opcionesFecha);
        
        return date ? fechaFormateada : undefined;// si no recibe fecha el helper da undefined
    });       
};


