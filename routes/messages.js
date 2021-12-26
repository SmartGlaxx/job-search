const router = require('express').Router()
const {getAllMessagesController, getUserMessagesController, getAllMessagesFromUserController,
	getMessageController, postMessageController, uploadMessageImage, readMessageController,
	 deleteSentMessageController, deleteReceivedMessageController} = require('../controllers/messages')


//GET ALL MESSAGES for Development
router.get('/', getAllMessagesController)
//GET ALLUSER MESSAGES
router.get('/:id/:username', getUserMessagesController)
//GET ALL MESSAGES FROM USER
router.get('/:userId/:userUsername/:id/:username', getAllMessagesFromUserController)
//GET A MESSAGE
router.get('/:id', getMessageController)
//CREATE A MESSAGE
router.post('/:id/:username', postMessageController)
//UPLOAD AN IMAGE
router.post('/uploadmessageimage/:id/:username', uploadMessageImage)
//READ A MESSAGE
router.post('/read/:id/:userId/:username', readMessageController)
//DELETE A SENT MESSAGE
router.delete('/deletesent/:id', deleteSentMessageController)
//DELETE A RECEIVED MESSAGE
router.delete('/deletereceived/:id', deleteReceivedMessageController)


module.exports = router
