const mongoose = require('mongoose');

const expiresValue = process.env.DEMO_MODE === 'true' ? 86400 : undefined;

const fileSchema = new mongoose.Schema({   
    path:{
        type:String,
        required:[true,'Path is required']
    }, 
    originalname:{
        type:String,
        required:[true,'Originalname is required']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:[true,'User is required']    
    },
    createdAt: {
        type: Date,
        default: Date.now,
        ...(expiresValue !== undefined ? { expires: expiresValue } : {})
    }
});


const file =mongoose.model('file',fileSchema);

module.exports = file;