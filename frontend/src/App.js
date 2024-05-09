import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Collection from './Collection';  // Ensure this is correctly imported
import Requests from './Requests';       // Ensure this is correctly imported
import './styles.css';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link> | <Link to="/requests">View Requests</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Collection />} /> {/* Ensure this is your default route */}
                    <Route path="/requests" element={<Requests />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

