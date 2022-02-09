const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname : {
        type : String,
        required : true,
    },
    lastname :  {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
        min : 3,
        max : 30,
    },
    email :{
        type : String,
        required : true,
        max : 70,
    },
    emailVerified : {
        type : Boolean,
        default : false
    },
    password : {
        type : String,
        required : true,
        min : 8
    },
    profilePicture : {
        type : String,
        default : "",
    },
    coverPicture : {
        type : String,
        default : "",
    },
    phone:{
        type : String,
        max : 50
    },
    followers : {
        type : Array,
        default : []
    },
    followings : {
        type : Array,
        default : []
    },
    connections :{
        type : Array,
        default : []
    },
    sentConnectionRequests:{
        type : Array,
        default : []
    },
    receivedConnectionRequests:{
        type : Array,
        default : []
    },
    sentMessages : {
        type : Array,
        default : []
    },
    receivedMessages :{
        type : Array,
        default : []
    },
    messageNotifications :{
        type : Array,
        default : []
    },
    newMessageList :{
        type : Array,
        default : []
    },
    aboutMe:{
        type : String,
        max : 50
    },
    country:{
        type : String,
        max : 50
    },
    state:{
        type : String,
        max : 50
    },
    city:{
        type : String,
        max : 50
    },
    employment:{
        type : String
    }
},
{timestamps : true}
)

module.exports = mongoose.model("User", userSchema)
