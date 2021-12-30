const fs = require('fs')
var cloudinary = require('cloudinary').v2
const Message = require('../models/message')
const User = require('../models/user')

//GET ALL MESSAGES for Development
const getAllMessagesController = async(req, res)=>{
	const {id} = req.params
	//id is poats id // userId, username are from the poster user
	try{
		const foundMessages = await Message.find()
		if(foundMessages){
			// const messages =await  Message.find({postId : id})
	        res.status(200).json({response : "Success", count : foundMessages.length, foundMessages})
		}else{
			res.status(200).json({response : "Fail", message : "Messages not found"})
		}
	}catch(error){
		res.status(200).json({response : "Fail", message : "An error occured fetching messages"})
	}
}

//GET ALL USER MESSAGES
const getUserMessagesController = async(req, res)=>{
	const {id, username} = req.params
	try{
		//const foundMessages = await Message.find({$or:[{senderId : id, senderUsername : username},{receiverId : id, receiverUsername : username}]})
		const user = await User.findOne({_id : id, username : username})
		const foundSentMessages =  user.sentMessages
		const foundReceivedMessages = user.receivedMessages
		const allUserMessages = foundSentMessages.concat(foundReceivedMessages)
		
		
		if(allUserMessages){
	        res.status(200).json({response : "Success", count : allUserMessages.length, allUserMessages})
		}else{
			res.status(200).json({response : "Fail", message : "Messages not found"})
		}
	}catch(error){
		res.status(200).json({response : "Fail", message : "An error occured fetching messages"})
	}
}

//GET ALL MESSAGES FROM ANOTHER USER
const getAllMessagesFromUserController = async(req, res)=>{
	const {userId, userUsername, id} = req.params
	// const {userId, username} = req.body
	try{
		const user = await User.findOne({_id : id})
		const currentUser = await User.findOne({_id : userId, username : userUsername})
		const allMessages = []

		const foundUserSentMessage =  currentUser.sentMessages.map(item =>{
			if(item.senderId == userId && item.receiverId == id){
				return item
			}else{
				return 
			}
			return 
		})

		const foundReceivedMessages =  currentUser.receivedMessages.map(item =>{
			if(item.senderId == id && item.receiverId == userId){
				return item
			}else{
				return 
			}
			return 
			
		})
		
		const allUserMessages = foundUserSentMessage.concat(foundReceivedMessages)
		
		return res.status(200).json({response : "Success", count : allUserMessages.length, allUserMessages})
		
	}catch(error){
		res.status(200).json({response : "Fail", message : "An error occured fetching message"})
	}
}

//GET A MESSAGE
// const getMessageController = async(req, res)=>{
// 	const {id} = req.params
// 	const {userId, username} = req.body
// 	try{
// 		const user = await User.findOne({_id : userId, username : username})
// 		const foundSentMessage =  user.sentMessages.find(item =>{
// 			if(item._id == id && item.senderId == userId){
// 				return res.status(200).json(item)
// 			}else{
// 				return
// 			}
// 		})
// 		const foundReceivedUnreadMessage =  user.receivedUnreadMessages.find(item =>{
// 			if(item._id == id && item.receiverId == userId){
// 				return res.status(200).json(item)
// 			}else{
// 				return
// 			}
// 		})
// 		const foundReceivedReadMessage =  user.receivedreadMessages.find(item =>{
// 			if(item._id == id && item.receiverId == userId){
// 				return res.status(200).json(item)
// 			}else{
// 				return
// 			}
// 		})
		
// 		return res.status(200).json({response : "Fail", message : "Messages not found"})
		
// 	}catch(error){
// 		res.status(200).json({response : "Fail", message : "An error occured fetching message"})
// 	}
// }

//POST A MESSAGE
const postMessageController = async(req, res)=>{
	const {id, username} = req.params
	const {senderId, senderUsername} = req.body
	try{
		const user = await User.findOne({_id : id, username : username})
		const currentUser = await User.findOne({_id : senderId, username : senderUsername})
		if(user && currentUser){
			const newMessage = await  Message.create(req.body)//the new message
			const formatedMessage = {_id : newMessage._id, ...newMessage} //add _id property to message before pushing to users
			const senderMessage = await currentUser.updateOne({$push : {sentMessages : formatedMessage}})
			const receiverMessage = await user.updateOne({$push : {receivedMessages : formatedMessage}})
	        res.status(200).json({response : "Success", formatedMessage})
		}else{
			res.status(200).json({response : "Fail", message : "Receiver or Sender not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured creating Message"})
    } 
}




//UPLOAD MESSAGE IMAGE
const uploadMessageImage = async(req,res)=>{
    const {id, username} = req.params    
    try{
        const currentUser = await User.findOne({_id : id, username : username})
        
        if(!currentUser){
            return res.status(200).json({response : "Fail", message : 'User not found. Please try again'})
        }else{
            if(!req.files){
                return res.status(200).json({response : "Fail", message : 'Please select a picture'})
            }else{
               const messageImage = req.files.image
               const maxSize = 10000 * 1024
               if(!messageImage.mimetype.startsWith("image")){
                    return res.status(200).json({response : "Fail", message : 'Please upload a picture'})
               }
               if(messageImage.size > maxSize){
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
                        folder : "social-job-app-message-img",
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




//CREATE SHARE MESSAGE
const shareMessageController = async(req, res)=>{
    const {id, userId, userUsername, otherUserId, otherUserUsername} = req.params
   
    const user = await User.findOne({_id : otherUserId, username : otherUserUsername})
	const currentUser = await User.findOne({_id : userId, username : userUsername})
	const allMessages = []

    try{
        // const foundMessages = await Message.findOne({_id : msgId, senderId : msgerId, senderUsername : msgerUsername})
        //const foundPost = await Post.findOne({_id : postId, userId : posterId, sharerId : sharerId, sharerUsername : sharerUsername })
        
        const foundUserSentMessage =  currentUser.sentMessages.find(item =>{
			if(item._id == id && item.senderId == userId && item.receiverId == otherUserId){
				// res.status(200).json({response : "Success", item})
				return item
			}else{
				return 
			}
			return
		})

		const foundReceivedMessages =  currentUser.receivedMessages.find(item =>{
			if(item._id == id && item.receiverId == userId && item.senderId == otherUserId){
				return item
			}else{
				return 
			}
			return 
		})



        if(foundUserSentMessage){

            const newMessage = await  Message.create(req.body)//the new message
			const formatedMessage = {_id : newMessage._id, ...newMessage} //add _id property to message before pushing to users
			const senderMessage = await currentUser.updateOne({$push : {sentMessages : formatedMessage}})
			const receiverMessage = await user.updateOne({$push : {receivedMessages : formatedMessage}})
			res.status(200).json({response : "Success", senderMessage})
        }else if(foundReceivedMessages){
        	const newMessage = await  Message.create(req.body)//the new message
			const formatedMessage = {_id : newMessage._id, ...newMessage} //add _id property to message before pushing to users
			const senderMessage = await currentUser.updateOne({$push : {receivedMessages : formatedMessage}})
			const receiverMessage = await user.updateOne({$push : {sentMessages : formatedMessage}})
			res.status(200).json({response : "Success", senderMessage})
        }
        else{
            res.status(200).json({response : "Fail", message : "Post not found"})
        }
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured creating post"})
    } 
}





//READ MESSAGE 
// const readMessageController = async(req, res)=>{
// 	const {id, userId, username} = req.params
	
// 	try{
// 		const user = await User.findOne({_id : userId, username : username})
// 		const messageToRead = await user.receivedUnreadMessages.find(item => {return item._id == id})
		
// 		const removeNewMessage = await user.updateOne({$pull : {receivedUnreadMessages : messageToRead}})
// 		const addToOldMessage = await user.updateOne({$push : {receivedReadMessages : messageToRead}})
// 		if(messageToRead){
// 			res.status(200).json({response : "Success", messageToRead})
// 		}else{
// 			res.status(200).json({response : "Success", message : "User or Message not found"})
// 		}
//     }catch(error){
//          res.status(200).json({response : "Fail", message : "An error occured reading message"})
//     }
// }


//DELETE SENT MESSAGE
const deleteSentMessageController = async(req, res)=>{

	const {id} = req.params
	const {userId, username} = req.body
	try{
		const user = await User.findOne({_id : userId, username : username})
		if(user){
			const messageToDelete = await user.sentMessages.find(item => {return item._id == id})
			const deletedMessage = await user.updateOne({$pull : {sentMessages : messageToDelete}})
			// const deletedSentMessage = await user.sentMessages.findOneAndDelete({_id : id, senderId : userId , senderUsername : username})
			res.status(200).json({response : "Success", messageToDelete})
		}else{
			res.status(200).json({response : "Success", message : "User or Message not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured deleting message"})
    }  
}

//DELETE RECEIVED MESSAGE
const deleteReceivedMessageController = async(req, res)=>{
	const {id} = req.params
	const {userId, username} = req.body
	try{
		const user = await User.findOne({_id : userId, username : username})
		if(user){
			const messageToDelete = await user.receivedMessages.find(item => {return item._id == id})
			const deletedMessage = await user.updateOne({$pull : {receivedMessages : messageToDelete}})
			// const deletedSentMessage = await user.sentMessages.findOneAndDelete({_id : id, senderId : userId , senderUsername : username})
			res.status(200).json({response : "Success", messageToDelete})
		}else{
			res.status(200).json({response : "Success", message : "User or Message not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured deleting message"})
    }  
}




module.exports = {getAllMessagesController, getUserMessagesController, getAllMessagesFromUserController,
	postMessageController, uploadMessageImage, shareMessageController,
	 deleteSentMessageController, deleteReceivedMessageController}
