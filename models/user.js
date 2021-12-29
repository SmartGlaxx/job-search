const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname : String,
    lastname : String,
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
    isAdmin : {
        type : Boolean,
        default : false
    },
    description:{
        type : String,
        max : 50
    },
    city:{
        type : String,
        max : 50
    },
    from:{
        type : String,
        max : 50
    },
    employment:{
        type : String,
        enum : [1,2,3]
    }
},
{timestamps : true}
)

module.exports = mongoose.model("User", userSchema)
