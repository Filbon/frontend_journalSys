import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPage = () => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('patientId'); // Retrieve user ID from local storage
        console.log(userId)

        // Fetch patient details using userId from the header
        axios.get("http://localhost:8081/api/userRole/myPage", {
            headers: {
                userId: userId  // Set userId in the header
            }
        })
            .then(response => {
                console.log('Patient response:', response.data); // Log response for debugging
                setPatient(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the patient details!', error);
                setError('Failed to load patient details');
                setLoading(false);
            });
    }, []);

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

export default MyPage;