const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config(); // Ensure to load environment variables

const app = express();
const port = process.env.PORT || 6000;

// Middleware setup
app.use(cors({
  origin: '*'
}));
app.disable('x-powered-by');
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.set('trust proxy', true);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err)); // Use console.error for logging errors

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
