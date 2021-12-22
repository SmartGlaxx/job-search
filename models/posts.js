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
    img : {
        type : String,
    },
    sharedId : String,
    sharedUsername : String,
    sharedDescription : String,
    shareImg : {
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
