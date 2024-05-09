import React, { useState, useEffect } from 'react';
import Toast from './Toast'; // Import the Toast component

function Requests() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });

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
        </div>
    );
}

export default Requests;
