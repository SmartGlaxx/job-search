const User = require('../models/user')
const bcrypt = require('bcrypt')

//get users (for development)
const getUsers = async(req, res)=>{
    try{ 
     const usersData = await User.find({})
     return res.status(200).json({Count: usersData.length ,usersData})
     }catch(error){
         res.status(500).json({error : "An error occured fetching users"})
     }
 }
 
//GET USER
const getUser = async(req,res)=>{
    const {id, username} = req.params
    try{
        const userData = await User.findOne({_id : id , username : username}).select({password : 0})
        res.status(200).json({response : "Success", data : userData})
    }catch(error){
        return res.status(500).json({message : 'An error occuered fetching your account.'})
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
                return res.status(200).json({message : 'User with given id or username not found.'})
            }
            const userUpdate = await User.findOneAndUpdate({_id : id}, req.body, {
                runValidators : true,
                new : true
            })
            res.status(200).json({message : "Updated",userUpdate})
        }catch(error){
            res.status(500).json({error})
        }
    }else{
        return res.status(500).json({message : 'You can only update your own account.'})
    }
}


//DELETE
const deleteUser = async(req, res)=>{
    const {id, username} = req.params
    if(req.body.userId === req.params.id ||  req.body.isAdmin){
        try{ 
            const userData = await User.findOne({_id : id, username : username})
            if(!userData){
                return res.status(200).json({message : 'User with given id or username not found.'})
            }
            const userdeleted = await User.findOneAndDelete({_id : id})
            res.status(200).json({message : "Deleted",userdeleted})
        }catch(error){
            res.status(500).json({error})
     }
    }else{
        return res.status(500).json({message : 'You can only delete your own account.'})
    }

}

//FOLLOW
const followUser = async(req, res)=>{
    const {id, username} = req.params
    const {userId, username : userUsername} = req.body
    try{
        if(userId === id){
            return res.status(500).json({message : 'You cannot follow your own account.'})
        }else{
            const user = await User.findOne({_id : id, username : username})
            const currentUser = await User.findOne({_id : userId, username : userUsername})
            
            if(!user || !currentUser){
                return res.status(500).json({message : 'User not found. Please try again."'})
            }else{
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push : {followers : req.body.userId}})
                    await currentUser.updateOne({$push : {followings : req.params.id}})
                    res.status(200).json({response : "Followed"})
                }else{
                    return res.status(500).json({message : 'You already follow this user."'})
                }

            }
        }
    }catch(error){
        return res.status(500).json({message : 'An error occured.'})
    }
}

//UNFOLLOW
const unfollowUser = async(req,res)=>{
    const {id, username} = req.params
    const {userId, userUsername} = req.body
    try{
        if(userId === id){
            return res.status(500).json({message : 'You cannot unfollow your own account.'})
        }else{
            const user = await User.findOne({_id : id, username : username})
            const currentUser =await  User.findOne({_id : userId, username : userUsername})
            if(!user || !currentUser){
                return res.status(500).json({message : 'User not found. Please try again.'})
            }else{
                if(user.followers.includes(req.body.userId)){
                    await user.updateOne({$pull : {followers : req.body.userId}})
                    await currentUser.updateOne({$pull : {followings : req.params.id}})
                    return res.status(200).json({response : "Unfollowed"})
                }else{
                    return res.status(500).json({message : 'You do not follow this user.'})
                }
            }
         }
        t
    }catch(error){
        return res.status(500).json({message : 'An error occured.'})
    }
}


module.exports = {getUsers, getUser, updateUser, deleteUser, followUser, unfollowUser}