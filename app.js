const express = require('express');
const app = express();
const userRouter=require('./routes/user.routes');
const indexRouter=require('./routes/index.routes');


const connectToDB = require('./config/db');
connectToDB();
const cookieParser = require('cookie-parser');  


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));


app.use('/',indexRouter); //checked first
app.use('/user',userRouter); //checked second if not first
app.set('view engine','ejs');
// settted , hence i need to make a folder called `views`
// app.get('/',(req,res)=>{
//     res.render('index')
// })

app.listen(3000,()=>{
    console.log('server is runniing on port 3000');
    
})