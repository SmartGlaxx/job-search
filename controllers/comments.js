const Comment = require('../models/comment')
const Post = require('../models/posts')


const getAllCommentsController = async(req, res)=>{
	const {id, userId, username} = req.params
	//id is poats id // userId, username are from the poster user
	try{
		const foundPost = await Post.findOne({_id : id})
		if(foundPost){
			const postComments =await  Comment.find({postId : id, userId : userId , username : username}).select('comment createdAt')
	        res.status(200).json({response : "Success", count : postComments.length, data : postComments})
		}else{
			res.status(200).json({response : "Fail", message : "Post not found"})
		}
	}catch(error){
		res.status(200).json({response : "Fail", message : "An error occured fetching comment"})
	}
}
const postCommentController = async(req, res)=>{
	const {id, userId, username} = req.params
	// userId, username are from the poster user
	try{
		const foundPost = await Post.findOne({_id : id})
		if(foundPost){
			const newComment =await  Comment.create(req.body)
	        res.status(200).json({response : "Success", data : newComment})
		}else{
			res.status(200).json({response : "Fail", message : "Post not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured creating comment"})
    } 
}

const updateCommentController = async(req, res)=>{
	const {postId, posterId, userId, commentId} = req.params
	try{
		const foundPost = await Post.findOne({_id : postId, userId : posterId})
		const foundComment = await Comment.findOne({_id : commentId, userId : userId})
		
		if(foundPost && foundComment){
			const updatedComment =await  Comment.findOneAndUpdate({_id : commentId, postId : postId, userId : userId},req.body,{
				runValidators : true,
            	new : true
			})
	        res.status(200).json({response : "Success", data : updatedComment})
		}else{
			res.status(200).json({response : "Error", message : "Post not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured updating comment"})
    } 
}
const deleteCommentController = async(req, res)=>{
	const {postId, posterId, userId, commentId} = req.params
	try{
		const foundPost = await Post.findOne({_id : postId, userId : posterId})
		const foundComment = await Comment.findOne({_id : commentId, userId : userId})
		
		if(foundComment){
			const deletedComment = await  Comment.findOneAndDelete({_id : commentId, postId : postId, userId : userId})
	        res.status(200).json({response : "Success", data : deletedComment})
		}else{
			res.status(200).json({response : "Fail", message : "Post not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured deleting comment"})
    } 

}


module.exports = {getAllCommentsController, postCommentController, updateCommentController, deleteCommentController}