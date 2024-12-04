import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchPage = () => {
    const [searchType, setSearchType] = useState('');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [outcome, setOutcome] = useState('');

    // Log results when they change
    useEffect(() => {
        console.log('Results updated:', results);
    }, [results]);

    const handleSearch = async () => {
        try {
            let response;
            switch (searchType) {
                case 'patientsByName':
                    response = await axios.get(`http://localhost:8083/search/patients/name/${query}`);
                    break;
                case 'patientsByCondition':
                    response = await axios.get(`http://localhost:8083/search/patients/by-condition`, {
                        params: { conditionName: query },
                    });
                    break;
                case 'practitionersByDate':
                    response = await axios.get(`http://localhost:8083/search/practitioners/encounters/${date}`);
                    break;
                case 'patientsByEncounter':
                    response = await axios.get(`http://localhost:8083/search/patients-by-encounter`, {
                        params: { reason, outcome, date },
                    });
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
                    }}
                >
                    <option value="">-- Select --</option>
                    <option value="patientsByName">Search Patients by Name</option>
                    <option value="patientsByCondition">Search Patients by Condition</option>
                    <option value="practitionersByDate">Search Practitioners by Encounter Date</option>
                    <option value="patientsByEncounter">Search Patients by Encounter</option>
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

            {searchType === 'practitionersByDate' && (
                <div>
                    <label htmlFor="encounterDate">Enter Encounter Date:</label>
                    <input
                        id="encounterDate"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            )}

            {searchType === 'patientsByEncounter' && (
                <div>
                    <label htmlFor="reason">Encounter Reason:</label>
                    <input
                        id="reason"
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <label htmlFor="outcome">Encounter Outcome:</label>
                    <input
                        id="outcome"
                        type="text"
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                    />
                    <label htmlFor="encounterDate">Encounter Date:</label>
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
                                {/* Ensure you display specific properties or stringify the whole object */}
                                Name: {result.name} {/* Replace `name` with the actual property you want to display */}
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

