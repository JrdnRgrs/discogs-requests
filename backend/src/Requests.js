import React, { useState, useEffect } from 'react';

function Requests() {
    const [requests, setRequests] = useState([]);
    const API_HOST = process.env.REACT_APP_API_URL
    useEffect(() => {
        fetch(`${API_HOST}/api/requests`)
            .then(response => response.json())
            .then(data => setRequests(data))
            .catch(error => console.error('Error fetching requests:', error));
    }, []);

    return (
        <div>
            <h1>Active Requests</h1>
            <ul>
                {requests.map((req, index) => (
                    <li key={index}>
                        {req.item.basic_information.title} by {req.item.basic_information.artists.map(artist => artist.name).join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Requests;
