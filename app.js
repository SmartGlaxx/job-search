require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const connect = require('./db/connect')
const authRoute  = require('./routes/auth')
const userRoute  = require('./routes/users')
const postRoute  = require('./routes/posts')
const commentRoute  = require('./routes/comments')

app.use(express.json())

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

const start = async()=>{
    await connect(process.env.DB_CONNECTION)
    app.listen(PORT, ()=>console.log('App is ready...'))
}

start()

