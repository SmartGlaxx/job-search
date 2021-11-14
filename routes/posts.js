const router = require('express').Router()
const {getTimelinePostsController, getPostsController, getPostController, postPostController, updatePostController, 
deletePostController, likePostController} = require('../controllers/posts')


//GETALL  POSTS
router.get('/:userId/:username', getTimelinePostsController)
//GET USER POSTS
router.get('/:id/:username', getPostsController)
//GET A POST
router.get('/:id/:userId/:username', getPostController)
//CREATE A POST
router.post('/', postPostController)
//UPDATE A POST
router.patch('/:id', updatePostController)
//DELETE A POST
router.delete('/:id', deletePostController)
//LIKE A POST
router.patch('/:id/:userId/:username', likePostController)

module.exports = router