import React, { useState, useEffect } from 'react';

function Requests() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/api/requests')
            .then(response => response.json())
            .then(data => setRequests(data))
            .catch(error => console.error('Error fetching requests:', error));
    }, []);

    const handleFulfillRequest = () => {
        if (!selectedRequest) {
            alert("Please select a request to fulfill.");
            return;
        }
        fetch(`http://localhost:4000/api/requests/${selectedRequest.item.id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            setRequests(prev => prev.filter(req => req.item.id !== selectedRequest.item.id));
            setSelectedRequest(null);
            alert("Request fulfilled and removed");
        })
        .catch(error => console.error('Error fulfilling request:', error));
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
            <button onClick={handleFulfillRequest}>Fulfill Selected Request</button>
        </div>
    );
}

export default Requests;
