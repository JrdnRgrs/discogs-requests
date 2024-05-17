const Discogs = require('js_ts_discogs_api_v2_library').default;
const discogs = new Discogs({

});
console.log(discogs.getRatelimit());



async function testDiscogsAPI() {
    try {
        // GET User
        // const user = await discogs.getUser();
        // console.log("User Details:");
        // console.log(user);

        // GET User Collection
        // const userSort1 = await discogs.getUserCollection('1', 'artist', 'asc');
        // console.log("User Sort 1:");
        // console.log(userSort1);

        const userValue1 = await discogs.getUserCollectionValue();
        //console.log("User Value 1:");
        //console.log(userValue1);
        console.log(`Collection value: ${userValue1.data.median}`);

        // const folder1 = await discogs.getUserFolderContents("0");
        // console.log("User Folder 1:");
        // console.log(folder1);

        // // GET Release by releaseID
        // const release1 = await discogs.getRelease("11521991");
        // console.log("Release Details by ID:");
        // console.log(release1);

        // // gets the details for the specified Master Release.
        // const master1 = await discogs.getMasterRelease("45922");
        // console.log("Master Details by ID:");
        // console.log(master1);
    } catch (error) {
        console.error('Error:', error);
    }
}

testDiscogsAPI();



async function testAddedDate() {
    try {
        const client = new Discogs({
            // settings are set in .env
        });
    
        let page = 1;
        let totalPages = 1;
        let allReleases = [];
        const itemsPerPage = 500; // Set the number of items per request to 500

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
     // Log the number of items in the collection
    const numberOfItems = allReleases.length;
    console.log(`Items in Collection: ${numberOfItems}`);

    // Get and log the collection value
    const userValue = await client.getUserCollectionValue();
    console.log(`Collection value: ${userValue.data.median}`);

    // Log the update time
    console.log(`Update happened at: ${new Date().toISOString()}`);

    // Find the last added date
    const lastAddedDate = allReleases.reduce((latest, release) => {
        const addedDate = new Date(release.date_added);
        return addedDate > latest ? addedDate : latest;
    }, new Date(0));

    console.log(`Last added date in collection: ${lastAddedDate.toISOString()}`);

    } catch (error) {
        console.error('Error:', error);
    }
}


//testAddedDate();