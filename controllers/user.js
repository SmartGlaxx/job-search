const User = require('../models/user')
const bcrypt = require('bcrypt')

//get users (for development)
const getUsers = async(req, res)=>{
    try{ 
     const usersData = await User.find({})
     return res.status(200).json({response : "Success", count: usersData.length ,usersData})
     }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured fetching users"})
     }
 }
 
//GET USER
const getUser = async(req,res)=>{
    const {id, username} = req.params
    try{
        const userData = await User.findOne({_id : id , username : username}).select({password : 0})
        res.status(200).json({response : "Success", data : userData})
    }catch(error){
        return res.status(200).json({response : "Fail", message : 'An error occuered fetching your account'})
    }
}

//UPDATE
const updateUser = async(req, res)=>{
    const {id, username} = req.params
    if(req.body.userId === req.params.id ||  req.body.isAdmin){
        try{ 
            if(req.body.password){
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }
            const userData = await User.findOne({_id : id, username : username})
            if(!userData){
                return res.status(200).json({response : "Fail", message : 'User with given id or username not found'})
            }
            const userUpdate = await User.findOneAndUpdate({_id : id}, req.body, {
                runValidators : true,
                new : true
            })
            res.status(200).json({response : "Success", message : userUpdate})
        }catch(error){
            res.status(200).json({response : "Fail", message: "An error occured updating your account"})
        }
    }else{
        return res.status(200).json({response : "Fail", message : 'Action not allowed'})
    }
}


//DELETE
const deleteUser = async(req, res)=>{
    const {id, username} = req.params
    if(req.body.userId === req.params.id ||  req.body.isAdmin){
        try{ 
            const userData = await User.findOne({_id : id, username : username})
            if(!userData){
                return res.status(200).json({response : "Fail", message : 'User with given id or username not found.'})
            }
            const userdeleted = await User.findOneAndDelete({_id : id})
            res.status(200).json({response : "Success", message : userdeleted})
        }catch(error){
            res.status(200).json({error})
     }
    }else{
        return res.status(200).json({response : "Fail", message : 'Action not allowed'})
    }

}

//FOLLOW
const followUser = async(req, res)=>{
    const {id, username} = req.params
    const {userId, username : userUsername} = req.body
    try{
        if(userId === id){
            return res.status(200).json({response : "Fail", message : 'Action not allowed'})
        }else{
            const user = await User.findOne({_id : id, username : username})
            const currentUser = await User.findOne({_id : userId, username : userUsername})
            
            if(!user || !currentUser){
                return res.status(200).json({response : "Fail", message : 'User not found. Please try again'})
            }else{
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push : {followers : req.body.userId}})
                    await currentUser.updateOne({$push : {followings : req.params.id}})
                    res.status(200).json({response : "Success",  data : currentUser})
                }else{
                    return res.status(200).json({response : "Fail", message : 'You already follow this user'})
                }

            }
        }
    }catch(error){
        return res.status(200).json({response : "Fail", message : 'An error occured'})
    }
}

//UNFOLLOW
const unfollowUser = async(req,res)=>{
    const {id, username} = req.params
    const {userId, userUsername} = req.body
    try{
        if(userId === id){
            return res.status(200).json({message : 'Action not allowed'})
        }else{
            const user = await User.findOne({_id : id, username : username})
            const currentUser =await  User.findOne({_id : userId, username : userUsername})
            if(!user || !currentUser){
                return res.status(200).json({message : 'User not found. Please try again'})
            }else{
                if(user.followers.includes(req.body.userId)){
                    await user.updateOne({$pull : {followers : req.body.userId}})
                    const newCurrentUser = await currentUser.updateOne({$pull : {followings : req.params.id}})
                    return res.status(200).json({response : "Success", data : newCurrentUser})
                }else{
                    return res.status(200).json({message : 'You do not follow this user'})
                }
            }
         }
        t
    }catch(error){
        return res.status(200).json({response : "Fail", message : 'An error occured'})
    }
}


//new addition Connections
//MAKE / CANCELL CONNECTION REQUEST
const connectRequest = async(req,res)=>{
    const {id, username} = req.params
    const {userId, username : userUsername} = req.body
    try{
        if(userId === id){
            return res.status(200).json({response : "Fail", message : 'Action not allowed'})
        }else{
            const user = await User.findOne({_id : id, username : username})
            const currentUser = await User.findOne({_id : userId, username : userUsername})
            
            if(!user || !currentUser){
                return res.status(200).json({response : "Fail", message : 'User not found. Please try again'})
            }else{
                if(!user.connections.includes(req.body.userId)){
                    if(!user.receivedConnectionRequests.includes(req.body.userId) && !currentUser.sentConnectionRequests.includes(req.body.id)){
                        await user.updateOne({$push : {receivedConnectionRequests : req.body.userId}})
                        await currentUser.updateOne({$push : {sentConnectionRequests : req.params.id}})
                        res.status(200).json({response : "Success",  data : currentUser})
                    }else if(user.receivedConnectionRequests.includes(req.body.userId) && currentUser.sentConnectionRequests.includes(req.body.id)){
                        res.status(200).json({ ans : "ANSWER lev 5"})
//                         await user.updateOne({$pull : {receivedConnectionRequests : req.body.userId}})
//                         await currentUser.updateOne({$pull : {sentConnectionRequests : req.params.id}})
//                         res.status(200).json({response : "Success",  data : currentUser})
                    }
                }else{
                    return res.status(200).json({response : "Fail", message : 'You are already connected to this user'})
                }



            }
        }
    }catch(error){
        return res.status(200).json({response : "Fail", message : 'An error occured'})
    }
    
}

//ACCEPT CONNECTION REQUEST
const acceptConnectRequest = async(req,res)=>{
    const {id, username} = req.params
    const {userId, username : userUsername} = req.body
    try{
        if(userId === id){
            return res.status(200).json({response : "Fail", message : 'Action not allowed'})
        }else{
            const user = await User.findOne({_id : id, username : username})
            const currentUser = await User.findOne({_id : userId, username : userUsername})
            
            if(!user || !currentUser){
                return res.status(200).json({response : "Fail", message : 'User not found. Please try again'})
            }else{
                if(!user.connections.includes(req.body.userId)){
                    await user.updateOne({$push : {connections : req.body.userId}})
                    await currentUser.updateOne({$push : {connections : req.params.id}})
                    await user.updateOne({$pull : {sentConnectionRequests: req.body.userId}})
                    await currentUser.updateOne({$pull : {receivedConnectionRequests : req.params.id}})
                    res.status(200).json({response : "Success",  data : currentUser})
                }else{
                    return res.status(200).json({response : "Fail", message : 'You are already connected to this user'})
                }

            }
        }
    }catch(error){
        return res.status(200).json({response : "Fail", message : 'An error occured'})
    }
}

//DECLINE CONNECTION REQUEST
const declineConnectRequest = async(req,res)=>{
    const {id, username} = req.params
    const {userId, username : userUsername} = req.body
    try{
        if(userId === id){
            return res.status(200).json({response : "Fail", message : 'Action not allowed'})
        }else{
            const user = await User.findOne({_id : id, username : username})
            const currentUser = await User.findOne({_id : userId, username : userUsername})
            
            if(!user || !currentUser){
                return res.status(200).json({response : "Fail", message : 'User not found. Please try again'})
            }else{
                if(user.sentConnectionRequests.includes(req.body.userId) && currentUser.receivedConnectionRequests.includes(req.params.id)){
                     await user.updateOne({$pull : {sentConnectionRequests: req.body.userId}})
                     await currentUser.updateOne({$pull : {receivedConnectionRequests : req.params.id}})
                    res.status(200).json({response : "Success",  data : currentUser})
                }else{
                    return res.status(200).json({response : "Fail", message : 'You are not connected to this user'})
                }
            }
        }
    }catch(error){
        return res.status(200).json({response : "Fail", message : 'An error occured'})
    }
}

//DISCONNECTION REQUEST
const disconnectRequest = async(req,res)=>{
    const {id, username} = req.params
    const {userId, username : userUsername} = req.body
    try{
        if(userId === id){
            return res.status(200).json({response : "Fail", message : 'Action not allowed'})
        }else{
            const user = await User.findOne({_id : id, username : username})
            const currentUser = await User.findOne({_id : userId, username : userUsername})
            
            if(!user || !currentUser){
                return res.status(200).json({response : "Fail", message : 'User not found. Please try again'})
            }else{
                if(user.connections.includes(req.body.userId)){
                    await user.updateOne({$pull : {connections : req.body.userId}})
                    await currentUser.updateOne({$pull : {connections : req.params.id}})
                    res.status(200).json({response : "Success",  data : currentUser})
                }else{
                    return res.status(200).json({response : "Fail", message : 'You are not connected to this user'})
                }

            }
        }
    }catch(error){
        return res.status(200).json({response : "Fail", message : 'An error occured'})
    }
}

module.exports = {getUsers, getUser, updateUser, deleteUser, followUser, unfollowUser, connectRequest, acceptConnectRequest, declineConnectRequest, disconnectRequest}
