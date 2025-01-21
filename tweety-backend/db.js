const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',       // Database host
    user: 'root',            // Database user
    password: '',            // Database password (usually empty in XAMPP by default)
    database: 'tweet' // Replace with your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database.');
    
});

module.exports = db;

