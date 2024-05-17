const express = require('express');
const cors = require('cors');
const Dotenv = require('dotenv');
const collectionRoutes = require('./routes/collection');

Dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Configure CORS to allow requests from the frontend container
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || '*', // Use environment variable or default to '*'
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', collectionRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});