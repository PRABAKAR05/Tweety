// validation/validation.js

// Validate username - ensure it meets criteria (e.g., length, characters)
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Example regex for usernames (3-15 alphanumeric + underscores)
    return usernameRegex.test(username);
}

// Validate message - ensure it meets criteria (e.g., length, content)
function validateMessage(message) {
    return typeof message === 'string' && message.length > 0 && message.length <= 500; // Limit message length
}

// Export the validation functions
module.exports = {
    validateUsername,
    validateMessage
};
