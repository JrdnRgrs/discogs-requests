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

        // const userValue1 = await discogs.getUserCollectionValue();
        // console.log("User Value 1:");
        // console.log(userValue1);

        const folder1 = await discogs.getUserFolderContents("0");
        console.log("User Folder 1:");
        console.log(folder1);

        // GET Release by releaseID
        const release1 = await discogs.getRelease("11521991");
        console.log("Release Details by ID:");
        console.log(release1);

        // gets the details for the specified Master Release.
        const master1 = await discogs.getMasterRelease("45922");
        console.log("Master Details by ID:");
        console.log(master1);
    } catch (error) {
        console.error('Error:', error);
    }
}

testDiscogsAPI();