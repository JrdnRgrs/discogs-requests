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
    //const API_HOST = process.env.REACT_APP_API_URL;
    const api_url = process.env.REACT_APP_API_HOST;
    const api_protocol = process.env.REACT_APP_API_PROTOCOL;
    const api_port = process.env.REACT_APP_API_PORT;
    const API_HOST = `${api_protocol}://${api_url}:${api_port}`
    useEffect(() => {
        fetch(`${API_HOST}/api/requests`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched requests:', data); // Log the response data
                setRequests(Array.isArray(data) ? data : []); // Ensure requests is an array
            })
            .catch(error => console.error('Error fetching requests:', error));
    }, [API_HOST]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 3000); // Toast disappears after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const handleRemoveRequest = () => {
        if (!selectedRequest) {
            setToast({ show: true, message: 'Please select a request to fulfill.' });
            return;
        }
        fetch(`${API_HOST}/api/requests/${selectedRequest.id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
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
            const response = await fetch(`${API_HOST}/api/update`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
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