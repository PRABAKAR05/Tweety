// controllers/friendController.js
const db = require('../db'); // Ensure this path is correct

const getAllUsersExceptLoggedIn = (req, res) => {
    const username = req.params.username; // Logged-in user

    // Query to get all users except the logged-in user
    const query = 'SELECT id, username FROM users WHERE username != ?';
    
    db.query(query, [username], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results); // Return the list of users
    });
};

module.exports = {
    getAllUsersExceptLoggedIn,
};
