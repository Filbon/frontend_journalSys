import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PatientDetails = () => {
    const { id } = useParams(); // Get patient ID from the URL parameter
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch patient details and conditions from the backend API
        axios.get(`http://localhost:8080/api/patients/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Token')}` // Attach token to the request header
            }
        })
            .then(response => {
                setPatient(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the patient details!', error);
                setError('Failed to load patient details');
                setLoading(false);
            });
    }, [id]); // Re-fetch data if the patient ID changes

    if (loading) {
        return <div>Loading patient details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Patient Details</h2>
            {patient ? (
                <div>
                    <h3>{patient.name}</h3>
                    <p><strong>Birthdate:</strong> {patient.birthdate}</p>

                    <h4>Conditions</h4>
                    {patient.conditions && patient.conditions.length > 0 ? (
                        <ul>
                            {patient.conditions.map(condition => (
                                <li key={condition.id}>
                                    <p><strong>Name:</strong> {condition.name}</p>
                                    <p><strong>Description:</strong> {condition.description}</p>
                                    <p><strong>Diagnosis Date:</strong> {new Date(condition.diagnosis_date).toLocaleDateString()}</p>
                                    <p><strong>Status:</strong> {condition.status}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No conditions found for this patient.</p>
                    )}
                </div>
            ) : (
                <p>Patient not found</p>
            )}
        </div>
    );
};

export default PatientDetails;
