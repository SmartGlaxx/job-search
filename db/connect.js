const mongoose  = require("mongoose")

const connect = (url)=>{
    return mongoose.connect(url, {
        useUnifiedTopology : true,
        useNewUrlParser : true
    })
}

module.exports = connect