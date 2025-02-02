const { name } = require('ejs');
const mongoose = require('mongoose');
const { isPassportNumber, isLowercase, trim } = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        minlength:[3,'Name must be atleast 3 characters long']
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:[3,'Username must be atleast 3 characters long']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:[9,'Email must be atleast 9 characters long'],    
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:[5,'Password must be atleast 5 characters long'],
    }
})
const user= mongoose.model('User',userSchema);
module.exports  = user; 