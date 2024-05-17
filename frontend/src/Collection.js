import React, { useState, useEffect } from 'react';
import Toast from './Toast'; // Import Toast component

function Collection() {
    const [collection, setCollection] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState('artist');
    const [order, setOrder] = useState('asc');
    const [toast, setToast] = useState({ show: false, message: '' });
    const [rateLimit, setRateLimit] = useState({ remaining: Infinity }); // Assume no limit until we know otherwise
    // const [lastUpdated, setLastUpdated] = useState(null);
    // const [lastAddedDate, setLastAddedDate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Reset collection state before fetching new data
                setCollection([]);
                
                const response = await fetch(`http://localhost:4000/api/collection?page=${page}&sort=${sort}&sort_order=${order}`);
                if (response.ok) {
                    const data = await response.json();
                    // Filter out duplicates
                    const uniqueReleases = data.releases.filter((item, index, self) =>
                        index === self.findIndex((t) => (
                            t.id === item.id
                        ))
                    );
                    setCollection(uniqueReleases);
                    setTotalPages(data.pagination.pages);
                    setRateLimit({
                        remaining: parseInt(response.headers.get('X-Discogs-Ratelimit-Remaining'), 10)
                    });
                } else {
                    throw new Error('Failed to fetch data.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (rateLimit.remaining <= 0) {
                    setToast({ show: true, message: 'Rate limit exceeded. Please wait a moment.' });
                }
            }
        };

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort, order]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 3000); // Close the toast after 3000 milliseconds (3 seconds)

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [toast.show]);

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(1); // Reset to first page when sort changes
    };

    const handleOrderChange = (e) => {
        setOrder(e.target.value);
        setPage(1); // Reset to first page when order changes
    };
    
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSubmit = () => {
        if (!selectedItem) {
            setToast({ show: true, message: 'Please select an item from the collection.' });
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
        .then(() => {
            setToast({ show: true, message: 'Request submitted successfully!' });
        })
        .catch(error => {
            console.error('Error submitting request:', error);
            setToast({ show: true, message: 'Error submitting request.' });
        });
    };

    // update button has been moved to requests
    // const handleUpdate = async () => {
    //     try {
    //         const response = await fetch('http://localhost:4000/api/update', {
    //             method: 'POST'
    //         });
    //         if (response.ok) {
    //             const data = await response.json();
    //             setToast({ show: true, message: 'Collection updated successfully!' });
    //             setLastUpdated(data.lastUpdated);
    //             setLastAddedDate(data.lastAddedDate);
    //         } else {
    //             throw new Error('Failed to update collection.');
    //         }
    //     } catch (error) {
    //         console.error('Error updating collection:', error);
    //         setToast({ show: true, message: 'Error updating collection.' });
    //     }
    // };

    return (
        <div>
            <h1>Discogs Collection</h1>
            <div>
                <select value={sort} onChange={handleSortChange}>
                    <option value="artist">Artist</option>
                    <option value="title">Title</option>
                    <option value="year">Year</option>
                    <option value="label">Label</option>
                    <option value="catno">Catalog Number</option>
                    <option value="format">Format</option>
                    <option value="rating">Rating</option>
                    <option value="added">Added Date</option>
                </select>
                <select value={order} onChange={handleOrderChange}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => handlePageChange(i + 1)} disabled={page === i + 1}>
                        {i + 1}
                    </button>
                ))}
            </div>
            <ul>
                {collection.map(item => (
                    <li key={`${item.id}-${item.basic_information.title}`} onClick={() => setSelectedItem(item)} className={selectedItem === item ? 'selected' : ''}>
                        <div className="item-container">
                            <img src={item.basic_information.cover_image || 'http://placehold.it/100x100'} alt="Album Cover" className="album-cover" />
                            <div className="item-info">
                                <strong>Title:</strong> {item.basic_information.title}
                                <br />
                                <strong>Artist:</strong> {item.basic_information.artists.map(artist => artist.name).join(", ")}
                                <br />
                                <strong>Year:</strong> {item.basic_information.year}
                                <br />
                                <strong>Genres:</strong> {item.basic_information.genres && item.basic_information.genres.join(", ")}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {selectedItem && (
                <button className="submit-button" onClick={handleSubmit}>
                    Submit Selected Item
                </button>
            )}
            {/* Update button, moved to Requests for now
            <button className="update-button" onClick={handleUpdate}>
                Update Collection
            </button>
            {lastUpdated && (
                <p>Last updated: {new Date(lastUpdated).toLocaleString()}</p>
            )}
            {lastAddedDate && (
                <p>Last item added on: {lastAddedDate}</p>
            )} 
            */}
            <Toast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
        </div>
    );
}

export default Collection;