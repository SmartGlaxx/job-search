const router = require('express').Router()
const {getTimelinePostsController, getPostsController, getPostController, postPostController, uploadImage, 
	sharePostController, updatePostController, deletePostController, likePostController} = require('../controllers/posts')


//GET TIMELINE POSTS
router.get('/:userId/:username/timeline', getTimelinePostsController)
//GET USER POSTS
router.get('/:id/:username', getPostsController)
//GET A POST
router.get('/:id/:userId/:username', getPostController)
//CREATE A POST
router.post('/', postPostController)
//UPLOAD AN IMAGE
router.post('/uploadimage/:id/:username', uploadImage)
//SHARE A POST
router.post('/:postId/:posterId/:posterUsername', sharePostController)
//UPDATE A POST
router.patch('/:id', updatePostController)
//DELETE A POST
router.delete('/:id', deletePostController)
//LIKE A POST
router.patch('/:id/:userId/:username', likePostController)

module.exports = router