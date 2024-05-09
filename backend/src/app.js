require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const collectionRoutes = require('./routes/collection');

const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(cors());

app.use(express.json());
app.use('/api', collectionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
