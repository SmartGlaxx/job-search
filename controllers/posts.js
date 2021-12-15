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
        const flatFriendsPosts = friendsPosts.flat()
        const allPosts = [...usersPosts, ...flatFriendsPosts]
        res.status(200).json({response : "Success", data : allPosts})
    }catch(error){
        res.status(200).json({response : "Fail", message : "An error occured fetchimg posts"})
    }
}


//GET POSTS
const getPostsController = async(req, res)=>{
    const {id, username} = req.params
    try{
        const fetchedPosts = await Post.find({userId : id, username : username})

       res.status(200).json({response : "Success", count : fetchedPosts.length, data : fetchedPosts})
    }catch(error){
        res.status(200).json({response : "Fail", message : "An error occured fetchimg posts"})
    }
}

//GET A POST
const getPostController = async(req, res)=>{
    const {id, userId, username} = req.params
    try {
        const fetchedPost = await Post.findOne({_id : id, userId : userId, username : username})
        res.status(200).json({response : "Success", data : fetchedPost})
    } catch (error) {
        res.status(200).json({response : "Fail", message : "An error occured fetchimg post."})
    }
}


//CREATE POST
const postPostController = async(req, res)=>{
    // const {userId, username : userUsername} = req.body
   
    try{
        const newPost =await  Post.create(req.body)
        res.status(200).json({response : "Success", data : newPost})
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured creating post"})
    } 
}

//CREATE SHARE POST
const sharePostController = async(req, res)=>{
    const {postId, posterId, posterUsername} = req.params
    // const {sharerId, sharerUsername} = req.body
    // const {userId, username : userUsername} = req.body
    try{
        const foundPost = await Post.findOne({_id : postId, userId : posterId, username : posterUsername})
        //const foundPost = await Post.findOne({_id : postId, userId : posterId, sharerId : sharerId, sharerUsername : sharerUsername })
        if(foundPost){
            const sharedPost =await  Post.create(req.body)
            res.status(200).json({response : "Success", sharedPost})
        }else{
            res.status(200).json({response : "Fail", message : "Post not found"})
        }
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured creating post"})
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
         res.status(200).json({response : "Success", data : postUpdate})
         }else{
             return res.status(200).json({response : "Fail", message : 'Action not allowed'})
         }
    }catch(error){
        res.status(200).json({response : "Fail", message : "An error occured updating post"})
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
            return res.status(200).json({response : "Success", data : postDelete})
         }else{
             return res.status(200).json({response : "Fail", message : 'Action not allowed'})
         }

    }catch(error){
        res.status(200).json({response : "Fail", message : "An error occured deleting post"})
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
            return res.status(200).json({response : "Success", data : likedPost})
        }else{
            const unlikedPost = await post.updateOne({$pull : {likes : userId}})
            return res.status(200).json({response : "Success", data : unlikedPost})
        }
    } catch (error) {
        res.status(200).json({response : "Fail", message : "An error occured liking post"})
    }
}


module.exports = {getTimelinePostsController, getPostsController, getPostController, postPostController, sharePostController,
    updatePostController, deletePostController, likePostController}
