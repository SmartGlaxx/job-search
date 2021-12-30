const router = require('express').Router()
const {getAllMessagesController, getUserMessagesController, getAllMessagesFromUserController,
	 postMessageController, uploadMessageImage, shareMessageController,
	 deleteSentMessageController, deleteReceivedMessageController} = require('../controllers/messages')


//GET ALL MESSAGES for Development
router.get('/', getAllMessagesController)
//GET ALLUSER MESSAGES
router.get('/:id/:username', getUserMessagesController)
//GET ALL MESSAGES FROM USER
router.get('/chat/:userId/:userUsername/:id/', getAllMessagesFromUserController)
//GET A MESSAGE
// router.get('/:id', getMessageController)
//CREATE A MESSAGE 
router.post('/:id/:username', postMessageController) 
//UPLOAD AN IMAGE
router.post('/uploadmessageimage/:id/:username', uploadMessageImage)
// SHARE A MESSAGE
router.post('/share/:id/:userId/:userUsername/:otherUserId/:otherUserUsername', shareMessageController)
//DELETE A SENT MESSAGE
router.delete('/deletesent/:id', deleteSentMessageController)
//DELETE A RECEIVED MESSAGE
router.delete('/deletereceived/:id', deleteReceivedMessageController)


module.exports = router
