const db = require('../db'); // Adjust the path as necessary

// Follow a user
exports.followUser = (req, res) => {
    const { follower_username, following_username } = req.body;

    // Check if the follow relationship already exists
    const checkQuery = `
        SELECT * FROM user_follows 
        WHERE follower_username = ? AND following_username = ?
    `;

    db.query(checkQuery, [follower_username, following_username], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database error' });
        }
        
        // If the user is already following, return a message
        if (results.length > 0) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        // If not, insert a new follow relationship
        const query = `
            INSERT INTO user_follows (follower_username, following_username)
            VALUES (?, ?)
        `;

        db.query(query, [follower_username, following_username], (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: `Now following ${following_username}` });
        });
    });
};
