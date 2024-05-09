import React, { useState, useEffect } from 'react';
import Toast from './Toast'; // Import Toast component

function Collection() {
    const [collection, setCollection] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        fetch(`http://localhost:4000/api/collection?page=${page}`)
            .then(response => response.json())
            .then(data => {
                setCollection(data.releases);
                setTotalPages(data.pagination.pages);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [page]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 3000); // Close the toast after 3000 milliseconds (3 seconds)

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [toast.show]);

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

    return (
        <div>
            <h1>Discogs Collection</h1>
            <div>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => handlePageChange(i + 1)} disabled={page === i + 1}>
                        {i + 1}
                    </button>
                ))}
            </div>
            <ul>
                {collection.map(item => (
                    <li key={item.id} onClick={() => setSelectedItem(item)} className={selectedItem === item ? 'selected' : ''}>
                        <div>
                            <strong>Title:</strong> {item.basic_information.title}
                            <br />
                            <strong>Artist:</strong> {item.basic_information.artists.map(artist => artist.name).join(", ")}
                            <br />
                            <img src={item.basic_information.cover_image || 'http://placehold.it/100x100'} alt="Album Cover" style={{ height: '100px' }} />
                        </div>
                    </li>
                ))}
            </ul>
            {selectedItem && (
                <button className="submit-button" onClick={handleSubmit}>
                    Submit Selected Item
                </button>
            )}
            <Toast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
        </div>
    );
}

export default Collection;
