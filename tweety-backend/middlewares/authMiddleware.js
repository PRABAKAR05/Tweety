const jwt = require('jsonwebtoken');
const db = require('../db');

// Middleware to authenticate the user
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send("Unauthorized. Missing authorization header.");
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized. Invalid token.");
        }

        const userId = decoded.id;

        // Fetch user from database to attach full user info to req
        db.query('SELECT id, username FROM users WHERE id = ?', [userId], (err, results) => {
            if (err || results.length === 0) {
                return res.status(401).send("Unauthorized. User not found.");
            }
            req.user = results[0]; // Attaching user info to req.user
            next();
        });
    });
};

module.exports = authMiddleware;
