const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
//const rateLimit = require('../rateLimit');
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
    const itemsPerPage = 500; // Set the number of items per request to 500

    console.log('Starting to fetch collection from Discogs');

    while (page <= totalPages) {
        console.log(`Fetching page ${page} of ${totalPages}`);
        
        // Fetch rate limit information
        const rateLimitInfo = await client.getRatelimit();
        console.log(`Rate limit remaining: ${rateLimitInfo.remaining}`);

        // If rate limit is low, wait for the window to reset
        if (rateLimitInfo.remaining <= 1) {
            const waitTime = (rateLimitInfo.reset * 1000) - Date.now();
            console.log(`Rate limit exceeded. Waiting for ${waitTime} ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        const response = await client.getUserFolderContents('0', page, 'artist', 'asc', itemsPerPage);
        allReleases = allReleases.concat(response.data.releases);
        totalPages = response.data.pagination.pages;
        page++;
    }

    console.log('Finished fetching collection from Discogs');

    const collectionData = {
        releases: allReleases,
        lastUpdated: new Date()
    };

    fs.writeFileSync(COLLECTION_FILE_PATH, JSON.stringify(collectionData, null, 2));

    // Log the number of items in the collection
    const numberOfItems = allReleases.length;
    console.log(`Items in Collection: ${numberOfItems}`);

    // Get and log the collection value
    const userValue = await client.getUserCollectionValue();
    console.log(`Collection value: ${userValue.data.median}`);

    // Log the update time
    //console.log(`Update happened at: ${new Date().toISOString()}`);

    // Find the last added date
    const lastAddedDate = allReleases.reduce((latest, release) => {
        const addedDate = new Date(release.date_added);
        return addedDate > latest ? addedDate : latest;
    }, new Date(0));
    const collectionValue = userValue.data.median
    // Format the last added date to CST
    const formattedLastAddedDate = lastAddedDate.toLocaleString('en-US', { timeZone: 'America/Chicago' });
    // Format the last added date to a more readable format
    //const formattedLastAddedDate = lastAddedDate.toLocaleString();

    console.log(`Last added date in collection: ${formattedLastAddedDate}`);

    return { collectionData, formattedLastAddedDate, collectionValue, numberOfItems };
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
        const { collectionData, formattedLastAddedDate, collectionValue, numberOfItems } = await fetchCollectionFromDiscogs();
        const lastUpdated = collectionData.lastUpdated.toLocaleString('en-US', { timeZone: 'America/Chicago' });
        console.log(`Collection updated successfully at: ${lastUpdated}`);
        res.status(200).json({ 
            message: 'Collection updated successfully', 
            data: collectionData,
            lastUpdated: lastUpdated,
            lastAddedDate: formattedLastAddedDate,
            collectionValue: collectionValue,
            numberOfItems: numberOfItems
        });
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