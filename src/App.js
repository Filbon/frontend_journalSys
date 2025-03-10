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
import MyConversations from './MyConversationsPage';
import AddEncounter from "./AddEncounter";
import ImageProcessingPage from "./ImageProcessingPage"; // New component for image processing
import ImageList from './ImageList'; // Import the ImageList component
import SearchPage from "./SearchPage";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import Nav from "./Nav";

const App = () => {
    return (
        <Router>
            <div>
                <ReactKeycloakProvider authClient={keycloak}>
                <h1>Welcome to the Health App</h1>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/patients" element={<PatientsList />} />
                    <Route path="/patients/:id/details" element={<PatientDetails />} />
                    <Route path="/patients/:patientId/conditions" element={<AddCondition />} />
                    <Route path="/myPage" element={<MyPage />} />
                    <Route path="/doctorsAndStaff" element={<DoctorsAndStaff />} />
                    <Route path="/SendMessage/:recipientId/:recipientName" element={<SendMessagePage />} />
                    <Route path="/myConversations" element={<MyConversations />} />
                    <Route path="/practitioner/:patientId/encounters/add" element={<AddEncounter />} />
                    <Route path="/image-list" element={<ImageList />} />
                    <Route path="/image-processing" element={<ImageProcessingPage />} />
                    <Route path="/search" element={<SearchPage/>}/>
                    <Route path="/keycloak" element={<Nav/>}/>
                </Routes>
                </ReactKeycloakProvider>
            </div>
        </Router>
    );
};

export default App;




