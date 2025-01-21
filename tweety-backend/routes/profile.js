const express = require('express');

const profileController = require('../controllers/profileController');
const router = express.Router();
// Route to get user profile
router.get('/:username', profileController.getUserProfile);

// Route to update user profile
router.post('/:username', profileController.updateUserProfile);

module.exports = router;
