import React, { useState, useEffect } from 'react';

function Collection() {
    const [collection, setCollection] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/api/collection')
            .then(response => response.json())
            .then(data => setCollection(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedItem) {
            alert("Please select an item from the collection.");
            return;
        }
        fetch('http://localhost:4000/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item: selectedItem })
        })
        .then(response => response.json())
        .then(data => alert("Request submitted successfully!"))
        .catch(error => console.error('Error submitting request:', error));
    };

    return (
        <div>
            <h1>Discogs Collection</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {collection.map(item => (
                        <li key={item.id} onClick={() => setSelectedItem(item)}>
                            <div className={selectedItem === item ? 'selected' : ''}>
                                <strong>Title:</strong> {item.basic_information.title}
                                <br />
                                <strong>Artist:</strong> {item.basic_information.artists.map(artist => artist.name).join(", ")}
                                <br />
                                <img src={item.basic_information.cover_image || 'http://placehold.it/100x100'} alt="Album Cover" style={{ height: '100px' }} />
                            </div>
                        </li>
                    ))}
                </ul>
                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
}

export default Collection;
