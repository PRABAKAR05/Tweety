// routes/friends.js
const express = require('express');
const router = express.Router();
const { getAllUsersExceptLoggedIn } = require('../controllers/friendsController'); // Ensure this path is correct

// Route to get all users except the logged-in user
router.get('/:username', getAllUsersExceptLoggedIn); // Use GET to fetch users

module.exports = router;
