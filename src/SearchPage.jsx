import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
    const [searchType, setSearchType] = useState('');
    const [query, setQuery] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [outcome, setOutcome] = useState('');
    const [results, setResults] = useState([]);

    // Log results when they change
    useEffect(() => {
        console.log('Results updated:', results);
    }, [results]);

    const handleSearch = async () => {
        try {
            let response;
            switch (searchType) {
                case 'patientsByName':
                    response = await axios.get(`http://kubernetes.docker.internal:30083/search/patients/name/${query}`);
                    break;
                case 'patientsByCondition':
                    response = await axios.get(`http://kubernetes.docker.internal:30083/search/patients/by-condition`, {
                        params: { conditionName: query },
                    });
                    break;
                case 'patientsByPractitioner':
                    response = await axios.get(`http://kubernetes.docker.internal:30083/search/${query}/patients`);
                    break;
                case 'practitionerEncountersByDate':
                    response = await axios.get(`http://kubernetes.docker.internal:30083/search/${query}/encounters/date/${date}`);
                    break;
                default:
                    alert('Please select a valid search type.');
                    return;
            }

            setResults(response.data || []);
        } catch (error) {
            console.error('Error performing search:', error);
            alert('Failed to fetch search results.');
        }
    };

    return (
        <div>
            <h1>Search Page</h1>
            <div>
                <label htmlFor="searchType">Select Search Type:</label>
                <select
                    id="searchType"
                    value={searchType}
                    onChange={(e) => {
                        setSearchType(e.target.value);
                        setResults([]);
                        setQuery('');
                        setDate('');
                        setReason('');
                        setOutcome('');
                    }}
                >
                    <option value="">-- Select --</option>
                    <option value="patientsByName">Search Patients by Name</option>
                    <option value="patientsByCondition">Search Patients by Condition</option>
                    <option value="patientsByPractitioner">Search Patients by Practitioner</option>
                    <option value="practitionerEncountersByDate">Search Encounters by Practitioner and Date</option>
                </select>
            </div>

            {searchType === 'patientsByName' && (
                <div>
                    <label htmlFor="patientName">Enter Patient Name:</label>
                    <input
                        id="patientName"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            )}

            {searchType === 'patientsByCondition' && (
                <div>
                    <label htmlFor="conditionName">Enter Condition Name:</label>
                    <input
                        id="conditionName"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            )}

            {searchType === 'patientsByPractitioner' && (
                <div>
                    <label htmlFor="practitionerId">Enter Practitioner ID:</label>
                    <input
                        id="practitionerId"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            )}

            {searchType === 'practitionerEncountersByDate' && (
                <div>
                    <label htmlFor="practitionerId">Enter Practitioner ID:</label>
                    <input
                        id="practitionerId"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <label htmlFor="encounterDate">Enter Encounter Date:</label>
                    <input
                        id="encounterDate"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            )}

            <button onClick={handleSearch}>Search</button>

            <div>
                <h2>Results:</h2>
                {results.length > 0 ? (
                    <ul>
                        {results.map((result, index) => (
                            <li key={index}>
                                {result.name && <div>Name: {result.name}</div>}
                                {result.patientName && <div>Patient Name: {result.patientName}</div>}
                                {result.birthdate && <div>Birthdate: {result.birthdate}</div>}
                                {result.date && <div>Date: {result.date}</div>}
                                {result.reason && <div>Reason: {result.reason}</div>}
                                {result.outcome && <div>Outcome: {result.outcome}</div>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found.</p>
                )}
            </div>

        </div>
    );
};

export default SearchPage;


