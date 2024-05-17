import React, { useState, useEffect } from 'react';
import Toast from './Toast'; // Import the Toast component

function Requests() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [lastUpdated, setLastUpdated] = useState(null);
    const [lastAddedDate, setLastAddedDate] = useState(null);
    const [collectionValue, setCollectionValue] = useState(null);
    const [numberOfItems, setNumberOfItems] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/api/requests')
            .then(response => response.json())
            .then(data => setRequests(data))
            .catch(error => console.error('Error fetching requests:', error));
    }, []);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 3000); // Toast disappears after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const handleRemoveRequest = (id) => {
        if (!selectedRequest) {
            setToast({ show: true, message: 'Please select a request to fulfill.' });
            return;
        }
        fetch(`http://localhost:4000/api/requests/${selectedRequest.item.id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            setRequests(prev => prev.filter(req => req.item.id !== selectedRequest.item.id));
            setSelectedRequest(null);
            setToast({ show: true, message: 'Request fulfilled and removed' });
        })
        .catch(error => {
            console.error('Error removing request:', error);
            setToast({ show: true, message: 'Error removing request.' });
        });
    };
    const handleUpdate = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/update', {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                //const updatedRelease = data.data.releases
                setToast({ show: true, message: 'Collection updated successfully!' });
                setLastUpdated(data.lastUpdated);
                setLastAddedDate(data.lastAddedDate);
                setCollectionValue(data.collectionValue);
                setNumberOfItems(data.numberOfItems);
            } else {
                throw new Error('Failed to update collection.');
            }
        } catch (error) {
            console.error('Error updating collection:', error);
            setToast({ show: true, message: 'Error updating collection.' });
        }
    };
    return (
        <div>
            <h1>Active Requests</h1>
            <ul>
                {requests.map((req, index) => (
                    <li key={index} onClick={() => setSelectedRequest(req)} className={selectedRequest === req ? 'selected' : ''}>
                        {req.item.basic_information.title} by {req.item.basic_information.artists.map(artist => artist.name).join(", ")}
                    </li>
                ))}
            </ul>
            {selectedRequest && (
                <button onClick={() => handleRemoveRequest(selectedRequest.item.id)}>Fulfill Selected Request</button>
            )}
            {toast.show && (
                <Toast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
            )}
            <h1>Collection Settings</h1>
            <button className="update-button" onClick={handleUpdate}>
                Update Collection
            </button>
            {numberOfItems && (
                <p>Number of Items in Collection: {numberOfItems}</p>
            )}
            {collectionValue && (
                <p>Median Collection Value: {collectionValue}</p>
            )}
            {lastUpdated && (
                <p>Last updated: {new Date(lastUpdated).toLocaleString()}</p>
            )}
            {lastAddedDate && (
                <p>Last item added on: {lastAddedDate}</p>
            )}
        </div>
    );
}

export default Requests;
