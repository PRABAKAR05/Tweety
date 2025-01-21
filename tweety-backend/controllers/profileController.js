const db = require('../db');

exports.getUserProfile = (req, res) => {
    const username = req.params.username;
    console.log("Searching for user:", username);  // Log the username

    const query = `
        SELECT user_profiles.username, users.email, user_profiles.bio, user_profiles.created_at, user_profiles.followers, user_profiles.following
        FROM user_profiles
        JOIN users ON user_profiles.username = users.username
        WHERE LOWER(user_profiles.username) = LOWER(?);
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
};


// Update user profile data
exports.updateUserProfile = (req, res) => {
    const { bio} = req.body; // No longer includes username here
    const usernameParam = req.params.username; // Renamed to avoid conflicts

    const query = 'UPDATE user_profiles SET bio = ? WHERE username = ?';

    db.query(query, [bio, usernameParam], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update profile', error: err });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    });
};

exports.getProfile = async (req, res) => {
    const { username } = req.params;

    try {
        // Fetch user profile data
        const userProfile = await db.query('SELECT * FROM user_profiles WHERE username = ?', [username]);
        if (!userProfile.length) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Fetch following data
        const following = await db.query('SELECT following_username FROM user_follows WHERE follower_username = ?', [username]);
        const followingUsernames = following.map(row => row.following_username);

        // Fetch all users (excluding followed ones)
        const allUsers = await db.query('SELECT username FROM users WHERE username != ?', [username]);
        const nonFollowedUsers = allUsers.filter(user => !followingUsernames.includes(user.username));

        res.json({
            ...userProfile[0], // Use the first item as the profile
            nonFollowedUsers: nonFollowedUsers, // Add the non-followed users
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


