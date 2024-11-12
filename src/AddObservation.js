import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AddObservation = () => {
    const { patientId } = useParams(); // Get patientId from URL parameters
    const navigate = useNavigate(); // For navigating after form submission

    const [observation, setObservation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Make a POST request to add an observation
        axios.post(`http://localhost:8080/patients/${patientId}/observations`, { observation })
            .then(response => {
                console.log('Observation added successfully', response.data);
                // Navigate to the patient's detail page or a patient list page after success
                navigate(`/patients/${patientId}`);  // Navigate to the patient's page
            })
            .catch(error => {
                console.error('There was an error adding the observation!', error);
            });
    };

    return (
        <div>
            <h2>Add Observation for Patient {patientId}</h2>
            <form onSubmit={handleSubmit}>
        <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Enter observation details"
            required
        />
                <button type="submit">Submit Observation</button>
            </form>
        </div>
    );
};

export default AddObservation;


