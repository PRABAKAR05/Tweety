const db = require('../db'); // Import the database connection

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Register User
const registerUser = (req, res) => {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkUserQuery, [username, email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            const userExists = results.some(user => user.username === username);
            const emailExists = results.some(user => user.email === email);

            if (userExists && emailExists) {
                return res.status(409).json({ message: 'Both username and email already exist' });
            } else if (userExists) {
                return res.status(409).json({ message: 'Username already exists' });
            } else {
                return res.status(409).json({ message: 'Email already exists' });
            }
        }

        // Hash the password before storing it
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Error creating user' });
            }

            const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertUserQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).json({ message: 'Error creating user' });
                }

                const insertProfileQuery = 'INSERT INTO user_profiles (username, bio) VALUES (?, ?)';
                db.query(insertProfileQuery, [username, ''], (err) => {
                    if (err) {
                        console.error('Error creating user profile:', err);
                        return res.status(500).json({ message: 'Error creating user profile' });
                    }

                    res.status(201).json({ message: 'User and profile created successfully' });
                });
            });
        });
    });
};

// Login User
const loginUser = (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // Check if the account is locked
        if (user.lock_until && new Date() < new Date(user.lock_until)) {
            return res.status(403).json({ message: `Account locked until ${user.lock_until}` });
        }

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (match) {
                // Generate JWT token
                const token = jwt.sign(
                    { id: user.id, username: user.username },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                // Reset failed attempts on successful login
                db.query('UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE username = ?', [username], (err) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    return res.status(200).json({ message: 'Login successful', token });
                });
            } else {
                handleFailedAttempt(user, username, res);
            }
        });
    });
};

// Handle Failed Login Attempts
function handleFailedAttempt(user, username, res) {
    const updatedAttempts = user.failed_attempts + 1;

    if (updatedAttempts >= 3) {
        const lockUntil = new Date();
        lockUntil.setHours(lockUntil.getHours() + 2); // Lock for 2 hours

        db.query('UPDATE users SET failed_attempts = ?, lock_until = ? WHERE username = ?', 
            [updatedAttempts, lockUntil, username], (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.status(403).json({ message: 'Account locked for 2 hours' });
            }
        );
    } else {
        db.query('UPDATE users SET failed_attempts = ? WHERE username = ?', 
            [updatedAttempts, username], (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.status(401).json({ message: 'Invalid username or password' });
            }
        );
    }
}

// Registration function stub (implement this)



module.exports = { registerUser, loginUser };








// Update user profile
const updateUserProfile = (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.params.id; // Assuming you're sending the user ID as a parameter

    // Query to update the user in the database
    const sql = `UPDATE users SET username = ?, password = ?,, email = ? WHERE id = ?`;

    db.query(sql, [username, email, password, userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User profile updated successfully' });
    });
};
const getAllUsersExceptLoggedIn = (req, res) => {
    const loggedInUsername = req.params.username;

    const query = 'SELECT username FROM users WHERE username != ?';
    db.query(query, [loggedInUsername], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results); // Return the list of users except the logged-in user
    });
};
const followUser = (req, res) => {
    const { username, targetUsername } = req.body; // Expecting username and targetUsername in the request body

    console.log("Received username:", username);
    console.log("Received target username:", targetUsername);

    const updateFollowingQuery = 'UPDATE user_profiles SET following = following + 1 WHERE username = ?';
    const updateFollowerQuery = 'UPDATE user_profiles SET followers = followers + 1 WHERE username = ?';
    const insertFollowQuery = 'INSERT INTO user_follows (follower_username, following_username) VALUES (?, ?)';

    // Validate existence of users
    db.query('SELECT COUNT(*) as count FROM user_profiles WHERE username IN (?, ?)', [username, targetUsername], (error, results) => {
        if (error) {
            console.error('Error checking user existence:', error);
            return res.status(500).json({ message: 'Database error during validation' });
        }

        if (results[0].count < 2) {
            return res.status(400).json({ message: 'One or both users do not exist' });
        }

        db.beginTransaction((err) => {
            if (err) {
                console.error('Transaction error:', err);
                return res.status(500).json({ message: 'Transaction error' });
            }

            // Update following count
            db.query(updateFollowingQuery, [username], (error) => {
                if (error) {
                    console.error('Error updating following count:', error);
                    return db.rollback(() => res.status(500).json({ message: 'Database error while updating following count' }));
                }

                // Update followers count
                db.query(updateFollowerQuery, [targetUsername], (error) => {
                    if (error) {
                        console.error('Error updating follower count:', error);
                        return db.rollback(() => res.status(500).json({ message: 'Database error while updating follower count' }));
                    }

                    // Insert into user_follows table
                    db.query(insertFollowQuery, [username, targetUsername], (error) => {
                        if (error) {
                            console.error('Error inserting into user_follows:', error);
                            return db.rollback(() => res.status(500).json({ message: 'Database error while inserting follow relationship' }));
                        }

                        // Commit transaction
                        db.commit((err) => {
                            if (err) {
                                console.error('Commit error:', err);
                                return db.rollback(() => res.status(500).json({ message: 'Commit error' }));
                            }

                            res.json({ message: 'Following and follower counts updated successfully' });
                        });
                    });
                });
            });
        });
    });
};
const getFollowing = (req, res) => {
    const username = req.params.username;

    const query = `
        SELECT following_username 
        FROM user_follows 
        WHERE follower_username = ?
    `;

    db.query(query, [username], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error' });
        }
        // Return the list of usernames the user is following
        res.json(results);  // results will be an array of objects
    });
};

// Unfollow a user
const unfollowUser = (req, res) => {
    const { follower_username, following_username } = req.body;

    const deleteQuery = `DELETE FROM user_follows WHERE follower_username = ? AND following_username = ?`;

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction error:', err);
            return res.status(500).json({ message: 'Error processing request' });
        }

        // Delete the follow relationship
        db.query(deleteQuery, [follower_username, following_username], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Database error:', err);
                    res.status(500).json({ message: 'Error unfollowing user' });
                });
            }

            // Check if any rows were affected
            if (results && results.affectedRows > 0) {
                // Prepare to decrease follower and following counts
                const updateFollowerCountQuery = `
                    UPDATE user_profiles
                    SET following = following - 1
                    WHERE username = ?;
                `;

                const updateFollowingCountQuery = `
                    UPDATE user_profiles
                    SET followers = followers - 1
                    WHERE username = ?;
                `;

                // Execute the first update query
                db.query(updateFollowerCountQuery, [follower_username], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error updating following count:', err);
                            res.status(500).json({ message: 'Error updating following count' });
                        });
                    }

                    // Execute the second update query
                    db.query(updateFollowingCountQuery, [following_username], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error('Error updating follower count:', err);
                                res.status(500).json({ message: 'Error updating follower count' });
                            });
                        }

                        // Commit the transaction
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Transaction commit error:', err);
                                    res.status(500).json({ message: 'Error committing transaction' });
                                });
                            }
                            res.json({ message: 'Unfollowed successfully' });
                        });
                    });
                });
            } else {
                return db.rollback(() => {
                    res.status(404).json({ message: 'User not found or not followed' });
                });
            }
        });
    });
};





module.exports = { registerUser, loginUser,updateUserProfile,getAllUsersExceptLoggedIn,followUser,getFollowing,unfollowUser};


