import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import PatientsList from './PatientsList'; // Import the PatientsList component
import PatientDetails from './PatientDetails';
import AddCondition from "./AddCondition";
import MyPage from "./MyPage"; // Import the MyPage component
import DoctorsAndStaff from './DoctorsAndStaffPage'; // New component for displaying doctors and staff
import SendMessagePage from './SendMessagePage'; // New component for sending messages
import MyConversations from './MyConversationsPage'; // New component for viewing conversations

const App = () => {
    return (
        <Router>
            <div>
                <h1>Welcome to the Health App</h1>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/patients" element={<PatientsList />} />
                    <Route path="/patients/:id/details" element={<PatientDetails />} />
                    <Route path="/patients/:patientId/conditions" element={<AddCondition />} />
                    <Route path="/myPage" element={<MyPage />} />
                    <Route path="/doctorsAndStaff" element={<DoctorsAndStaff />} /> {/* New route for doctors/staff list */}
                    <Route path="/SendMessage/:recipientId/:recipientName" element={<SendMessagePage />} /> {/* Route for sending messages */}
                    <Route path="/myConversations" element={<MyConversations />} /> {/* Route for viewing conversations */}

                    {/* Default route: redirect to /login if no other routes match */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;




