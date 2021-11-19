const router = require('express').Router()
const {getAllCommentsController, postCommentController, updateCommentController, 
	deleteCommentController} = require('../controllers/comments')


//GET ALL COMMENTS
router.get('/:id/:userId/:username', getAllCommentsController)
//CREATE A COMMENT
router.post('/:id/:userId/:username', postCommentController)
//UPDATE A COMMENT
router.patch('/:postId/:posterId/:userId/:commentId', updateCommentController)
//DELETE A COMMENT
router.delete('/:postId/:posterId/:userId/:commentId', deleteCommentController)

module.exports = router