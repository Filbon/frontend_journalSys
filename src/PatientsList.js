import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch patients from the backend API
        axios.get('http://localhost:8080/api/patients/GetPatients', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Token')}` // Attach token to the request header
            }
        })
            .then(response => {
                setPatients(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the patients!', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading patients...</div>;
    }

    return (
        <div>
            <h2>List of Patients</h2>
            <ul>
                {patients.map(patient => (
                    <li key={patient.id}>
                        <Link to={`/patients/${patient.id}/details`}>{patient.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientsList;



