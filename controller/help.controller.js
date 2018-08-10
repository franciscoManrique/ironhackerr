const mail = require('../services/mail.service');

module.exports.create = (req, res, next) =>{
    res.render('help/create');
};

module.exports.doCreate = (req, res, next) =>{
    const email = req.body.email;
    const content = req.body.content;

    mail.helpEmail(email, content);
    res.render('help/create', {message: 'email sent'});
};

