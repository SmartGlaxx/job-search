const Post = require('../models/posts')
const User = require('../models/user')

//GET TIMELINE POSTS
const getTimelinePostsController = async(req, res)=>{
    const {userId, username} = req.params
    try{
        const currentUser = await User.findOne({_id : userId, username : username})
        const usersPosts = await Post.find({userId : userId, username : username})

        const friendsPosts = await Promise.all(
            currentUser.followings.map(friendsId =>{
               return Post.find({userId : friendsId})
            })
        )
        const allPosts = usersPosts.concat(friendsPosts)
        res.status(200).json({response : "Success", data : allPosts})
    }catch(error){
        res.status(500).json({error : "An error occured fetchimg posts"})
    }
}


//GET POSTS
const getPostsController = async(req, res)=>{
    const {id, username} = req.params
    try{
        const fetchedPosts = await Post.find({userId : id, username : username})

       res.status(200).json({response : "Success", count : fetchedPosts.length, data : fetchedPosts})
    }catch(error){
        res.status(500).json({error : "An error occured fetchimg posts"})
    }
}

//GET A POST
const getPostController = async(req, res)=>{
    const {id, userId, username} = req.params
    try {
        const fetchedPost = await Post.findOne({_id : id, userId : userId, username : username})
        res.status(200).json({response : "Success", data : fetchedPost})
    } catch (error) {
        res.status(500).json({error : "An error occured fetchimg post."})
    }
}

//CREATE POST
const postPostController = async(req, res)=>{
    const {userId, username : userUsername} = req.body
    try{
        const newPost =await  Post.create(req.body)
        res.status(200).json({response : "Success", data : newPost})
    }catch(error){
         res.status(500).json({error : "An error occured creating post"})
    } 
}

//UPDATE POST
const updatePostController = async(req,res)=>{
    const {id} = req.params
    const {userId, username : userUsername } = req.body
    
    try{
        const updatePost = await Post.findById(id) 
        
         if(updatePost.userId === userId  && updatePost.username === userUsername){    
        const postUpdate = await  Post.findOneAndUpdate({userId : userId, _id : id },req.body, {
            runValidators : true,
            new : true
        })
         res.status(200).json({response : "Updated", data : postUpdate})
         }else{
             return res.status(500).json({message : 'You can only update your own post.'})
         }
    }catch(error){
        res.status(500).json({error : "An error occured updating post"})
    } 
}

//DELETE POST
const deletePostController = async(req,res)=>{
    const {id} = req.params
    const {userId, username : userUsername } = req.body
    
    try{
        const deletePost = await Post.findById(id) 
        
         if(deletePost.userId === userId  && deletePost.username === userUsername){    
            const postDelete = await  Post.findOneAndDelete({userId : userId, _id : id })
            return res.status(200).json({response : "Deleted", data : postDelete})
         }else{
             return res.status(500).json({message : 'You can only delete your own post.'})
         }

    }catch(error){
        res.status(500).json({error : "An error occured deleting post"})
    } 
}

//LIKE / DISLIKE A POST
const likePostController = async(req, res)=>{
    const {id, userId, username} = req.params
    try {
        const post = await Post.findOne({_id : id})
        const liked = await post.likes.includes(userId)
        
        if(liked === false){
            const likedPost = await post.updateOne({$push : {likes : userId}})
            return res.status(200).json({response : "Liked", data : likedPost})
        }else{
            const unlikedPost = await post.updateOne({$pull : {likes : userId}})
            return res.status(200).json({response : "Unliked", data : unlikedPost})
        }
    } catch (error) {
        res.status(500).json({error : "An error occured liking post"})
    }
}

module.exports = {getTimelinePostsController, getPostsController, getPostController, postPostController, updatePostController, 
deletePostController, likePostController}