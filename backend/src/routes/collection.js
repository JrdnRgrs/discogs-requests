const express = require('express');
const axios = require('axios');
const rateLimit = require('../rateLimit');  // Ensure you import the middleware
const Dotenv = require('dotenv');
const Client = require('js_ts_discogs_api_v2_library').default;
Dotenv.config();
const router = express.Router();

router.get('/collection', async (req, res) => {
    const page = req.query.page || 1; // Default to page 1 if no page query parameter is provided
    const sort = req.query.sort || 'artist'; // Default sorting by artist if not specified
    const sortOrder = req.query.sort_order || 'asc'; // Default sorting order if not specified

    try {
        const url = `https://api.discogs.com/users/jrdnrgrs/collection/folders/0/releases?page=${page}&per_page=50&sort=${sort}&sort_order=${sortOrder}`;
        // You can use 4 methods

        // 1. Token (signed as user)
        // const response = await axios.get(url, {
        //     headers: { 'Authorization': `Discogs token=${process.env.DISCOGS_API_KEY}` }
        // });
        // 2. App Auth (signed in as app)
        // const response = await axios.get(url, {
        //     headers: { 'Authorization': `Discogs key=${process.env.DISCOGS_API_CON_KEY}, secret=${process.env.DISCOGS_API_CON_SECRET}` }
        // });
        // 3. No Auth (public, no pictures)
        //const response = await axios.get(url);

        // 4. npm library js_ts_discogs_api_v2_library
        const client = new Client({
            // settings are set in .env
        });

        const response = await client.getUserFolderContents('0', page, sort, sortOrder);

        // Discogs rate limits, lets try not to hit it
        // https://www.discogs.com/developers/#page:home,header:home-rate-limiting
        const rateLimitInfo = discogs.getRatelimit();
        res.locals.rateLimitInfo = {
            total: rateLimitInfo.ratelimit,
            used: rateLimitInfo.used,
            remaining: rateLimitInfo.remaining
        };
        res.json(response.data); // Send the entire response including pagination info
    } catch (error) {
        res.status(500).send('Error retrieving collection from Discogs');
    }
}, rateLimit);  // Apply the middleware after the API call

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
