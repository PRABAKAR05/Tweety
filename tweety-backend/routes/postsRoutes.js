const express = require('express');
const router = express.Router();
const postController = require('../controllers/postsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to create a post
router.post('/create', authMiddleware, postController.createPost);

// Route to edit a post
router.put('/edit/:postId', authMiddleware, postController.editPost);

// Route to delete a post
router.delete('/delete/:postId', authMiddleware, postController.deletePost);

// Route to get posts for followers
router.get('/followers', authMiddleware, postController.getPostsForFollowers);
router.post('/like/:postId',authMiddleware, postController.likePost);

// Unlike a post
router.post('/unlike/:postId', authMiddleware, postController.unlikePost);

module.exports = router;
