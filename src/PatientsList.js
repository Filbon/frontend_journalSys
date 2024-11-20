import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        console.log(localStorage.getItem('userRole'));

        // Fetch patients from the backend API
        axios.get("http://localhost:8081/api/userRole/patients/GetPatients", {
            headers: {
                userRole: userRole  // Dynamically set role
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
                        {/* Link to patient's details page */}
                        <Link to={`/patients/${patient.id}/details`}>{patient.name}</Link>

                        {/* Button to navigate to AddCondition page for the patient */}
                        <button>
                            <Link to={`/patients/${patient.id}/conditions`}>
                                Add Condition
                            </Link>
                        </button>

                        {/* Message Button - Navigate to the SendMessagePage */}
                        <button>
                            <Link to={`/sendMessage/${patient.userId}/${patient.name}`}>
                                Send Message
                            </Link>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientsList;






