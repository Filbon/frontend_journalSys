import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEncounter = () => {
    const { patientId } = useParams();
    const practitionerId = localStorage.getItem("practitionerId")
    const navigate = useNavigate();
    const [encounter, setEncounter] = useState({
        encounterDate: '',
        reason: '',
        outcome: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEncounter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const userRole = localStorage.getItem('userRole');

        const encounterData = {
            encounterDate: encounter.encounterDate,
            reason: encounter.reason,
            outcome: encounter.outcome,
            patientId: parseLong(patientId),
        };

        try {
            const response = await axios.post(
                `https://userroleservice.app.cloud.cbh.kth.se/api/userRole/practitioner/${practitionerId}/encounters`,
                encounterData,
                {
                    headers: {
                        userRole: userRole, // Set userRole header for authorization
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert('Encounter added successfully!');
        } catch (err) {
            console.error('Error adding encounter:', err);
            setError('Failed to add encounter. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Utility function to parse string to long
    const parseLong = (value) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    };

    return (
        <div>
            <h2>Add Encounter for Patient ID: {patientId}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date and Time:</label>
                    <input
                        type="datetime-local"
                        name="encounterDate"
                        value={encounter.encounterDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Reason:</label>
                    <textarea
                        name="reason"
                        value={encounter.reason}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Outcome:</label>
                    <textarea
                        name="outcome"
                        value={encounter.outcome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding Encounter...' : 'Add Encounter'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default AddEncounter;
