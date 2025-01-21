const db = require('../db');
const crypto = require('crypto');

// Function to hash the message text
function hashMessage(messageText) {
    return crypto.createHash('sha256').update(messageText).digest('hex');
}

// Send a message
exports.sendMessage = (req, res) => {
    const { sender_username, receiver_username, message_text } = req.body;

    // Check if all required fields are present
    if (!sender_username || !receiver_username || !message_text) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
        SELECT id FROM users WHERE username IN (?, ?)`;

    db.query(query, [sender_username, receiver_username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Error fetching user IDs' });
        }

        // Check if both users exist
        if (results.length < 2) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sender_id = results[0].id;
        const receiver_id = results[1].id;

        // Hash the message text
        const hashedMessage = hashMessage(message_text);

        const insertQuery = `
            INSERT INTO messages (sender_id, receiver_id, message_text)
            VALUES (?, ?, ?)`;

        db.query(insertQuery, [sender_id, receiver_id, hashedMessage], (err) => {
            if (err) {
                console.error('Error inserting message:', err);
                return res.status(500).json({ message: 'Error sending message' });
            }
            res.json({ message: 'Message sent successfully',original_message: message_text });
        });
    });
};

// Get messages between two users
exports.getMessages = (req, res) => {
    const { user1, user2 } = req.params;

    // Check if both usernames are provided
    if (!user1 || !user2) {
        return res.status(400).json({ message: 'Both users are required' });
    }

    const query = `
        SELECT m.message_text, m.created_at, u1.username AS sender, u2.username AS receiver
        FROM messages m
        JOIN users u1 ON m.sender_id = u1.id
        JOIN users u2 ON m.receiver_id = u2.id
        WHERE (u1.username = ? AND u2.username = ?) OR (u1.username = ? AND u2.username = ?)
        ORDER BY m.created_at ASC`;

    db.query(query, [user1, user2, user2, user1], (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).json({ message: 'Error fetching messages' });
        }

        // Return results or an empty array if no messages
        res.json(results.length > 0 ? results : []);
    });
};
