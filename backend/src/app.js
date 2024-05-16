const express = require('express');
const cors = require('cors');
const Dotenv = require('dotenv');
const collectionRoutes = require('./routes/collection');

Dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api', collectionRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});