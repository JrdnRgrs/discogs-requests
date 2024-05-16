const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const rateLimit = require('../rateLimit');
const Dotenv = require('dotenv');
const Client = require('js_ts_discogs_api_v2_library').default;
Dotenv.config();
const router = express.Router();

const COLLECTION_FILE_PATH = path.join(__dirname, 'collection.json');

const fetchCollectionFromDiscogs = async () => {
    const client = new Client({
        // settings are set in .env
    });

    let page = 1;
    let totalPages = 1;
    let allReleases = [];

    while (page <= totalPages) {
        const response = await client.getUserFolderContents('0', page, 'artist', 'asc');
        allReleases = allReleases.concat(response.data.releases);
        totalPages = response.data.pagination.pages;
        page++;
    }

    const collectionData = {
        releases: allReleases,
        lastUpdated: new Date()
    };

    fs.writeFileSync(COLLECTION_FILE_PATH, JSON.stringify(collectionData, null, 2));
    return collectionData;
};

router.get('/collection', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || 'artist';
    const sortOrder = req.query.sort_order || 'asc';

    let collectionData;
    if (fs.existsSync(COLLECTION_FILE_PATH)) {
        collectionData = JSON.parse(fs.readFileSync(COLLECTION_FILE_PATH));
    } else {
        collectionData = await fetchCollectionFromDiscogs();
    }

    // Implement sorting on collectionData
    const sortedCollection = collectionData.releases.sort((a, b) => {
        let aValue, bValue;

        if (sort === 'artist') {
            aValue = a.basic_information.artists[0].name.toLowerCase();
            bValue = b.basic_information.artists[0].name.toLowerCase();
        } else {
            aValue = a.basic_information[sort] || '';
            bValue = b.basic_information[sort] || '';
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const perPage = 50;
    const paginatedCollection = sortedCollection.slice((page - 1) * perPage, page * perPage);

    res.json({
        pagination: {
            page: page,
            pages: Math.ceil(sortedCollection.length / perPage),
            per_page: perPage,
            items: sortedCollection.length
        },
        releases: paginatedCollection
    });
});

router.post('/update', async (req, res) => {
    try {
        const collectionData = await fetchCollectionFromDiscogs();
        res.status(200).json({ message: 'Collection updated successfully', data: collectionData });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update collection' });
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