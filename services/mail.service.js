const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: process.env.ADMIN_EMAIL1,
        pass: process.env.ADMIN_PASSWORD1
    }
});

module.exports.helpEmail = (email, content) =>{
    const options = getMailOptions(email, content);
    sendEmail(options);
};

module.exports.sendToken = (user) =>{    
    const email = user.email;
    const token = user.token;
    const content = `click here to confirm your account <a href="http://localhost:3000/users/confirm/?token=${token}">`;

    const options = getMailOptions(email, content, token);
    sendEmail(options);
};

function getMailOptions(email, content, token){
    if (token) {
        return {
            from: process.env.ADMIN_EMAIL1,
            to: email, 
            subject: `${content}`,
            text: `${email} ${content}`
        };
    } else{
        return {
            from: process.env.ADMIN_EMAIL1,
            to: process.env.ADMIN_EMAIL1, 
            subject: `${content}`,
            text: `${email} ${content}`
        };
    }
}

function sendEmail(options){
    transporter.sendMail(options)
    .then(()=>{
        console.log(`email sent to ${options.to}`);   
    })
    .catch(error =>{
        console.log(error);
    });
}

