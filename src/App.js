import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import PatientsList from './PatientsList'; // Import the PatientsList component
import PatientDetails from './PatientDetails';
import AddCondition from "./AddCondition";
import MyPage from "./MyPage"; // Import the AddCondition component

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
                    <Route path="/patients/:patientId/conditions" element={<AddCondition />} /> {/* Route for adding condition */}
                    <Route path="/myPage" element={<MyPage/>}/>

                    {/* Default route: redirect to /login if no other routes match */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;



