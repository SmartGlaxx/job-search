const router = require('express').Router()
const {getUsers, getUser, updateUser, deleteUser, followUser, unfollowUser} = require('../controllers/user')

//get users (for development)
router.route('/').get(getUsers)

//GET A USER
router.route('/:id/:username').get(getUser)
//UPDATE USER
router.route('/update/:id/:username').patch(updateUser)
//DELETE USER
router.route('/delete/:id/:username').delete(deleteUser)
//FOLLOW A USER
router.route('/follow/:id/:username').patch(followUser)
//UNFOLLOW A USER
router.route('/unfollow/:id/:username').patch(unfollowUser)


module.exports = router