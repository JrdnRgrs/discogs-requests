const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/collection', async (req, res) => {
    const page = req.query.page || 1; // Default to page 1 if no page query parameter is provided
    try {
        const response = await axios.get(`https://api.discogs.com/users/jrdnrgrs/collection/folders/0/releases?page=${page}&per_page=50`, {
            headers: { 'Authorization': `Discogs token=${process.env.DISCOGS_API_KEY}` }
        });
        res.json(response.data); // Send the entire response including pagination info
    } catch (error) {
        res.status(500).send('Error retrieving collection from Discogs');
    }
});


const requests = [];  // This will store our requests in memory

router.post('/requests', (req, res) => {
    const request = req.body;
    requests.push(request);  // Store the request
    console.log('Received request:', request);
    res.status(200).json({ message: 'Request received' });
});

router.get('/requests', (req, res) => {
    res.status(200).json(requests);  // Send all requests
});

// Endpoint to delete a request
router.delete('/requests/:id', (req, res) => {
    const { id } = req.params; // Get the ID from the URL
    const index = requests.findIndex(req => req.item.id.toString() === id);
    if (index > -1) {
        requests.splice(index, 1); // Remove the item from the array
        res.status(200).json({ message: 'Request fulfilled and removed' });
    } else {
        res.status(404).send('Request not found');
    }
});

module.exports = router;
