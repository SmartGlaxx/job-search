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
		const foundReceivedUnreadMessages = user.receivedUnreadMessages
		const foundReceivedReadMessages = user.receivedReadMessages
		const allUserMessages = foundSentMessages.concat(foundReceivedUnreadMessages, foundReceivedReadMessages)
		console.log(allUserMessages)
		
		if(allUserMessages){
	        res.status(200).json({response : "Success", count : allUserMessages.length, allUserMessages})
		}else{
			res.status(200).json({response : "Fail", message : "Messages not found"})
		}
	}catch(error){
		res.status(200).json({response : "Fail", message : "An error occured fetching messages"})
	}
}


//GET A MESSAGE
const getMessageController = async(req, res)=>{
	const {id} = req.params
	const {userId, username} = req.body
	try{
		const user = await User.findOne({_id : userId, username : username})
		const foundSentMessage =  user.sentMessages.find(item =>{
			if(item._id == id && item.senderId == userId){
				return res.status(200).json(item)
			}else{
				return
			}
		})
		const foundReceivedUnreadMessage =  user.receivedUnreadMessages.find(item =>{
			if(item._id == id && item.receiverId == userId){
				return res.status(200).json(item)
			}else{
				return
			}
		})
		const foundReceivedReadMessage =  user.receivedreadMessages.find(item =>{
			if(item._id == id && item.receiverId == userId){
				return res.status(200).json(item)
			}else{
				return
			}
		})
		
		return res.status(200).json({response : "Fail", message : "Messages not found"})
		
	}catch(error){
		res.status(200).json({response : "Fail", message : "An error occured fetching message"})
	}
}

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
			const receiverMessage = await user.updateOne({$push : {receivedUnreadMessages : formatedMessage}})
	        res.status(200).json({response : "Success", formatedMessage})
		}else{
			res.status(200).json({response : "Fail", message : "Receiver or Sender not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured creating Message"})
    } 
}


const readMessageController = async(req, res)=>{
	const {id, userId, username} = req.params
	
	try{
		const user = await User.findOne({_id : userId, username : username})
		const messageToRead = await user.receivedUnreadMessages.find(item => {return item._id == id})
		
		const removeNewMessage = await user.updateOne({$pull : {receivedUnreadMessages : messageToRead}})
		const addToOldMessage = await user.updateOne({$push : {receivedReadMessages : messageToRead}})
		if(messageToRead){
			res.status(200).json({response : "Success", messageToRead})
		}else{
			res.status(200).json({response : "Success", message : "User or Message not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured reading message"})
    }
}


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

const deleteReceivedMessageController = async(req, res)=>{
	const {id} = req.params
	const {userId, username} = req.body
	try{
		const user = await User.findOne({_id : userId, username : username})
		if(user){
			const messageToDelete = await user.receivedReadMessages.find(item => {return item._id == id})
			const deletedMessage = await user.updateOne({$pull : {receivedReadMessages : messageToDelete}})
			// const deletedSentMessage = await user.sentMessages.findOneAndDelete({_id : id, senderId : userId , senderUsername : username})
			res.status(200).json({response : "Success", messageToDelete})
		}else{
			res.status(200).json({response : "Success", message : "User or Message not found"})
		}
    }catch(error){
         res.status(200).json({response : "Fail", message : "An error occured deleting message"})
    }  
}




module.exports = {getAllMessagesController, getUserMessagesController, getMessageController, 
	postMessageController, readMessageController, deleteSentMessageController, 
	deleteReceivedMessageController}