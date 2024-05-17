import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Collection from './Collection';  // Ensure this is correctly imported
import Requests from './Requests';       // Ensure this is correctly imported
import Login from './Login';  
import './styles.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = (response) => {
        console.log(response);
        setIsLoggedIn(true);
    };

    const handleLoginError = (error) => {
        console.log(error);
    };
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link>
                    {isLoggedIn && <Link to="/requests"> | View Requests</Link>}
                </nav>
                <Routes>
                    <Route path="/" element={<Collection />} />
                    <Route path="/login" element={<Login onSuccess={handleLoginSuccess} onError={handleLoginError} />} />
                    <Route path="/requests" element={isLoggedIn ? <Requests /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

