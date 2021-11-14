require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const connect = require('./db/connect')
const authRoute  = require('./routes/auth')
const userRoute  = require('./routes/users')
const postRoute  = require('./routes/posts')

app.use(express.json())

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/posts', postRoute)


const start = async()=>{
    await connect(process.env.DB_CONNECTION)
    app.listen(PORT, ()=>console.log('App is ready...'))
}

start()

