const express = require('express');


const { registerUser, loginUser } = require('../controllers/usersController');
const { updateUserProfile } = require('../controllers/usersController');
const { getAllUsersExceptLoggedIn } = require('../controllers/usersController');
const { followUser } = require('../controllers/usersController');
// const { getFollowingUsers } = require('../controllers/usersController');
const {unfollowUser} = require('../controllers/usersController');
const { getFollowing } = require('../controllers/usersController');
const { getProfile } = require('../controllers/profileController');


const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);
// Update user profile route (with dynamic user id)
router.put('/id', updateUserProfile);
router.get('/all/:username', getAllUsersExceptLoggedIn);
router.post('/follow', followUser);
router.delete('/unfollow', unfollowUser);
router.get('/following/:username', getFollowing);
router.get('/profile/:username', getProfile);


module.exports = router;



// Update user profile route (assuming /user/:id is the user profile route)


