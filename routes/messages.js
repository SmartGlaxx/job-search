const router = require('express').Router()
const {getAllMessagesController, getUserMessagesController, getMessageController, postMessageController, 
readMessageController, deleteSentMessageController, deleteReceivedMessageController} = require('../controllers/messages')


//GET ALL MESSAGES for Development
router.get('/', getAllMessagesController)
//GET ALLUSER MESSAGES
router.get('/:id/:username', getUserMessagesController)
//GET A MESSAGE
router.get('/:id', getMessageController)
//CREATE A MESSAGE
router.post('/:id/:username', postMessageController)
//READ A MESSAGE
router.post('/read/:id/:userId/:username', readMessageController)
//DELETE A SENT MESSAGE
router.delete('/deletesent/:id', deleteSentMessageController)
//DELETE A RECEIVED MESSAGE
router.delete('/deletereceived/:id', deleteReceivedMessageController)


module.exports = router
