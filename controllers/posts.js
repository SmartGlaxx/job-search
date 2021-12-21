const fs = require('fs')
var cloudinary = require('cloudinary').v2
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
        res.status(200).json({response : "Success", allPosts})
    }catch(error){
        res.status(200).json({response : "Fail", message : "An error occured fetchimg posts"})
    }
}



//GET POSTS
const getPostsController = async(req, res)=>{
    const {id, username} = req.params
    try{
        const fetchedPosts = await Post.find({userId : id, username : username})

       res.status(200).json({response : "Success", count : fetchedPosts.length, fetchedPosts})
    }catch(error){
        res.status(200).json({response : "Fail", message : "An error occured fetchimg posts"})
    }
}

//GET A POST
const getPostController = async(req, res)=>{
    const {id, userId, username} = req.params
    try {
        const fetchedPost = await Post.findOne({_id : id, userId : userId, username : username})
        res.status(200).json({response : "Success", fetchedPost})
    } catch (error) {
        res.status(200).json({response : "Fail", message : "An error occured fetchimg post."})
    }
}


//CREATE POST
const postPostController = async(req, res)=>{
     const {userId, username : userUsername} = req.body
   
    try{
        const newPost =await  Post.create(req.body)
        res.status(200).json({response : "Success", newPost})
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured creating post"})
    } 
} 

//UPLOAD POST IMAGE
const uploadImage = async(req,res)=>{
    const {id, username} = req.params    
    try{
        const currentUser = await User.findOne({_id : id, username : username})
        
        if(!currentUser){
            return res.status(200).json({response : "Fail", message : 'User not found. Please try again'})
        }else{
            if(!req.files){
                return res.status(200).json({response : "Fail", message : 'Please select a picture'})
            }else{
               const profileImage = req.files.image
               const maxSize = 10000 * 1024
               if(!profileImage.mimetype.startsWith("image")){
                    return res.status(200).json({response : "Fail", message : 'Please upload a picture'})
               }
               if(profileImage.size > maxSize){
                return res.status(200).json({response : "Fail", message : `Picture size is higher than ${maxSize}. Plesae resize it`})
               }
               //UPLOAD TO LOCAL SERVER / HOSTING SERVER
                // const postImageName = postImage.name.replace(/\s/g,'')
                // const postImagePath = path.join(__dirname, "../public/postImages", postImageName)
                // await postImage.mv(postImagePath)
                // res.status(200).json({image :{ src : `/postImages/${postImageName}`}})

                //ULOAD TO CLOUDINARY

                const result = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    {
                        use_filename : true,
                        folder : "social-job-app-post",
                    }
                )
                
                fs.unlinkSync(req.files.image.tempFilePath)
                return res.status(200).json({image :{ src : result.secure_url}})
            }
        }
    }catch(error){
        return res.status(200).json({response : "Fail", message : 'An error occured'})
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
         res.status(200).json({response : "Success", postUpdate})
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
            return res.status(200).json({response : "Success", postDelete})
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
            return res.status(200).json({response : "Success", likedPost})
        }else{
            const unlikedPost = await post.updateOne({$pull : {likes : userId}})
            return res.status(200).json({response : "Success", unlikedPost})
        }
    } catch (error) {
        res.status(200).json({response : "Fail", message : "An error occured liking post"})
    }
}


module.exports = {getTimelinePostsController, getPostsController, getPostController, postPostController, uploadImage,
 sharePostController, updatePostController, deletePostController, likePostController}