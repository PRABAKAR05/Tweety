const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');

// Follow a user
router.post('/follow', followController.followUser);

module.exports = router;
