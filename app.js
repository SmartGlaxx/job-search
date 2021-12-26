require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const connect = require('./db/connect')
const authRoute  = require('./routes/auth')
const userRoute  = require('./routes/users')
const postRoute  = require('./routes/posts')
const commentRoute  = require('./routes/comments')
const messageRoute  = require('./routes/messages')
const fileupload = require("express-fileupload")
const cloudinary = require("cloudinary").v2

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key : process.env.API_KEY,
	api_secret : process.env.API_SECRET
})  

app.use(express.static('public'))
app.use(express.json())
app.use(fileupload({useTempFiles : true}))

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, Content, Accept, Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
}); 

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/posts', postRoute)
app.use('/api/v1/comments', commentRoute)
app.use('/api/v1/messages', messageRoute)

const start = async()=>{
    await connect(process.env.DB_CONNECTION)
    app.listen(PORT, ()=>console.log('App is ready...'))
}

start()

