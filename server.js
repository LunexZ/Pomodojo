const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MongoDB connection string from environment variable
const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(port, () => {
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