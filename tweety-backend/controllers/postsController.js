const db = require('../db'); // Assuming db.js manages your MySQL connection

// Create a post
exports.createPost = (req, res) => {
    const { username, content } = req.body;

    // Step 1: Find user ID by username
    const userQuery = 'SELECT id FROM users WHERE username = ?';
    db.query(userQuery, [username], (err, userResult) => {
        if (err) return res.status(500).send(err);
        if (userResult.length === 0) return res.status(404).send("User not found.");

        const user_id = userResult[0].id;

        // Step 2: Insert the post using the user ID
        const postQuery = 'INSERT INTO posts (user_id, content) VALUES (?, ?)';
        db.query(postQuery, [user_id, content], (err, postResult) => {
            if (err) return res.status(500).send(err);

            res.status(201).json({
                id: postResult.insertId,
                user_id,
                content
            });
        });
    });
};

// Edit a post
exports.editPost = (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    // Check if req.user exists and has an id
    if (!req.user || !req.user.id) {
        return res.status(401).send("Unauthorized. User ID is missing.");
    }

    const query = 'UPDATE posts SET content = ? WHERE id = ? AND user_id = ?';
    db.query(query, [content, postId, req.user.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send("Post not found or no permission.");
        res.status(200).json({ message: "Post updated successfully." });
    });
};

// Delete a post
exports.deletePost = (req, res) => {
    const { postId } = req.params;
    console.log("Attempting to delete post with ID:", postId); 

    if (!req.user || !req.user.id) {
        return res.status(401).send("Unauthorized. User ID is missing.");
    }

    const query = 'DELETE FROM posts WHERE id = ? AND user_id = ?';
    db.query(query, [postId, req.user.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send("Post not found or no permission.");
        res.status(200).json({ message: "Post deleted successfully." });
    });
};

// Get posts for a user’s followers
// Get posts from followed users, along with like information
exports.getPostsForFollowers = (req, res) => {
    const { username } = req.user; // Using username instead of userId

    if (!username) {
        return res.status(401).send("Unauthorized. Username is missing.");
    }

    // Query to get posts from followed users
    const query = `
        SELECT posts.* 
        FROM posts
        JOIN users ON posts.user_id = users.id
        JOIN user_follows ON users.username = user_follows.following_username
        WHERE user_follows.follower_username = ?`
    ;

    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(results);
    });
};

// Like a post
// Like a post
exports.likePost = (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if the user has already liked the post
    const checkQuery = 'SELECT * FROM user_likes WHERE post_id = ? AND user_id = ?';

    db.query(checkQuery, [postId, userId], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length > 0) {
            // User has already liked the post
            return res.status(400).json({ message: "You have already liked this post." });
        } else {
            // Add like to `user_likes`
            const insertUserLikeQuery = 'INSERT INTO user_likes (post_id, user_id) VALUES (?, ?)';

            db.query(insertUserLikeQuery, [postId, userId], (err) => {
                if (err) return res.status(500).send(err);

                // Increment the like count in `posts`
                const updatePostQuery = 'UPDATE posts SET count = count + 1 WHERE id = ?';

                db.query(updatePostQuery, [postId], (err) => {
                    if (err) return res.status(500).send(err);
                    res.status(200).json({ message: "Post liked successfully." });
                });
            });
        }
    });
};

// Unlike a post
exports.unlikePost = (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if the user has liked the post
    const checkQuery = 'SELECT * FROM user_likes WHERE post_id = ? AND user_id = ?';

    db.query(checkQuery, [postId, userId], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
            // User hasn't liked the post
            return res.status(400).json({ message: "You have not liked this post yet." });
        } else {
            // Remove like from `user_likes`
            const deleteUserLikeQuery = 'DELETE FROM user_likes WHERE post_id = ? AND user_id = ?';

            db.query(deleteUserLikeQuery, [postId, userId], (err) => {
                if (err) return res.status(500).send(err);

                // Decrement the like count in `posts`
                const updatePostQuery = 'UPDATE posts SET count = count - 1 WHERE id = ?';

                db.query(updatePostQuery, [postId], (err) => {
                    if (err) return res.status(500).send(err);
                    res.status(200).json({ message: "Post unliked successfully." });
                });
            });
        }
    });
};


