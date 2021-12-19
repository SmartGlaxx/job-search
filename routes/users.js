const router = require('express').Router()
const {getUsers, getUser, updateUser, deleteUser, followUser, unfollowUser, connectRequest, acceptConnectRequest, 
	declineConnectRequest, disconnectRequest, uploadImage, createImage} = require('../controllers/user')

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
//SEND / CANCEL CONNECTION REQUEST TO A USER
router.route('/connectrequest/:id/:username').patch(connectRequest)
//ACCEPT CONNECTION REQUEST TO A USER
router.route('/acceptconnectrequest/:id/:username').patch(acceptConnectRequest)
//DECLINE CONNECTION REQUEST TO A USER
router.route('/declineconnectrequest/:id/:username').patch(declineConnectRequest)
//SEND DISCONNECTION REQUEST TO A USER
router.route('/disconnectrequest/:id/:username').patch(disconnectRequest)
//UPLOAD PROFILE IMAGE
router.route('/uploadprofileimage/:id/:username').patch(uploadImage)
//CREATE PROFILE IMAGE
router.route('/createprofileimage/:id/:username').patch(createImage)

module.exports = router