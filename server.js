const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');

// Check environment variable is present
if (!process.env.DB_URI) {
    console.error('Error: DB_URI is not defined in the environment variables.');
    process.exit(1);
}

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Views directory

// Use authentication routes
app.use('/auth', authRoutes); // Mount auth routes on `/auth`

// Route to render the index page
app.get('/', (req, res) => {
    res.render('index', { title: 'Pomodojo' });
});

// Route to render the login page
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login - Pomodojo' });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// MongoDB connection string from environment variable
const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown function
const shutdown = async () => {
    console.log('\nGracefully shutting down...');

    try {
        // Close MongoDB connection
        console.log('Closing database connection...');
        await mongoose.connection.close();
        console.log('Database connection closed.');

        // Close the server
        console.log('Closing server...');
        server.close(() => {
            console.log('Server closed.');
            process.exit(0); // Exit process successfully
        });
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1); // Exit process with error
    }
};

// Handle termination signals
process.on('SIGINT', shutdown); // Handle Ctrl+C
process.on('SIGTERM', shutdown); // Handle termination signals
