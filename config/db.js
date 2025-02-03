const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// to fill the dotenv file with the data from the .env file

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log('connected to db, DB:',mongoose.connection.name," on ",mongoose.connection.host);
    })
}
module.exports = connectToDB;