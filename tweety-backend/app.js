const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

require('dotenv').config();

const userRoutes = require('./routes/users'); // Import user routes
const profileRoutes = require('./routes/profile');
const friendsRoutes=require('./routes/friends')
const messageRoutes = require('./routes/messageRoutes');
const followRoutes = require('./routes/followRoutes');
const postsRoutes = require('./routes/postsRoutes');


const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: '10mb' })); // Set the limit to 10 MB or adjust as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cors()); 
// Use routes
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next(); // Call the next middleware or route handler
});


app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api', followRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postsRoutes);
// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
