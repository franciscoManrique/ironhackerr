const mongoose = require('mongoose');
const DB_NAME = 'facebook';
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(()=>{
    console.log(`connected to database: ${MONGO_URI}`);   
})
.catch(error =>{
    console.log(error);
});
