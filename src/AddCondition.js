import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AddCondition = () => {
    const { patientId } = useParams(); // Get patientId from URL parameters
    const navigate = useNavigate(); // For navigating after form submission

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('ACTIVE'); // Default to ACTIVE
    const [diagnosisDate, setDiagnosisDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if the name is empty and show an error message
        if (!name) {
            setError("Condition name is required.");
            return; // Don't proceed if name is empty
        }

        // Prepare the condition object to send
        const conditionData = { conditionName: name, description, status, diagnosisDate };
        const userRole = localStorage.getItem('userRole')

        console.log("Sending condition data:", conditionData); // Log the data being sent

        // Make a POST request to add a condition
        axios.post(`https://userroleservice.app.cloud.cbh.kth.se/api/userRole/patients/${patientId}/conditions`, conditionData, {
            headers: {
                userRole: userRole  // Dynamically set role
            }
        })
            .then(response => {
                console.log('Condition added successfully:', response.data);
                // Navigate to the patient's detail page after success
                navigate(`/patients/`);  // Navigate to the patient's page
            })
            .catch(error => {
                // Log the entire error object
                console.error('There was an error adding the condition:', error);

                if (error.response) {
                    // Server responded with a status other than 2xx
                    console.error('Response error:', error.response);
                    setError(`Error: ${error.response.status} - ${error.response.statusText}`);
                } else if (error.request) {
                    // No response received
                    console.error('Request error:', error.request);
                    setError('Error: No response received from server.');
                } else {
                    // Error setting up the request
                    console.error('Setup error:', error.message);
                    setError(`Error: ${error.message}`);
                }
            });
    };

    return (
        <div>
            <h2>Add Condition for Patient {patientId}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Condition Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter condition name"
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter condition description"
                        required
                    />
                </div>
                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CHRONIC">CHRONIC</option>
                    </select>
                </div>
                <div>
                    <label>Diagnosis Date:</label>
                    <input
                        type="date"
                        value={diagnosisDate}
                        onChange={(e) => setDiagnosisDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit Condition</button>
            </form>
        </div>
    );
};

export default AddCondition;





