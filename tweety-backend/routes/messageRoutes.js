const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Send a message
router.post('/send', messageController.sendMessage);

// Get messages between two users
router.get('/:user1/:user2', messageController.getMessages);

module.exports = router;
