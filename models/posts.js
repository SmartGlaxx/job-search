const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        max : 500
    },
    sharerId : String,
    sharerUsername : String,
    sharerDescription : String,
    img : {
        type : String,
    },
    likes : {
        type : Array,
        default : []
    }
},
{timestamps : true}
)

module.exports = mongoose.model("Post", postSchema)