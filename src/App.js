import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import PatientsList from './PatientsList'; // Import the PatientsList component
import PatientDetails from './PatientDetails'; // Import the PatientDetails component

const App = () => {
    return (
        <Router>
            <div>
                <h1>Welcome to the Health App</h1>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/patients" element={<PatientsList />} /> {/* Route for patients list */}
                    <Route path="/patients/:id/details" element={<PatientDetails />} /> {/* Route for patient details */}
                    <Route path="/" element={<h2>Please go to /login or /register</h2>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;



