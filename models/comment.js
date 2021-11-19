const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    postId : {
        type : String,
        required : true,
    },
    userId : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
    },
    comment : {
        type : String,
        required : true,
    }
},
{timestamps : true}
)

module.exports = mongoose.model("Comment", commentSchema)