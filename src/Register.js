import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        const userDTO = {
            userName,
            password,
            role,
            patient: role === 'PATIENT' ? { name, birthdate } : null,
        };

        try {
            // Step 1: Authenticate with Keycloak
            const keycloakAuthResponse = await axios.post(
                'http://localhost:8080/realms/master/protocol/openid-connect/token',
                new URLSearchParams({
                    client_id: 'user-service',
                    client_secret: 'twO4q2kzljG9QUFkRbol1YfpX2aL5rs1',
                    grant_type: 'client_credentials',
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            const keycloakToken = keycloakAuthResponse.data.access_token;

            // Step 2: Create the user in Keycloak
            const keycloakUser = {
                username: userName,
                enabled: true,
                credentials: [
                    {
                        type: 'password',
                        value: password,
                        temporary: false,
                    },
                ],
                realmRoles: [role],
            };

            await axios.post(
                'http://localhost:8080/admin/realms/my-realm/users',
                keycloakUser,
                {
                    headers: {
                        Authorization: `Bearer ${keycloakToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Step 3: Register the user in your backend
            const response = await axios.post(
                'http://localhost:8082/api/user/register',
                userDTO
            );

            alert(`User ${response.data.userName} registered successfully!`);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                'Registration failed. Please check the details and try again.';
            setError(errorMsg);
        }
    };


    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <div>
                    <label>User Name: </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Role: </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="">Select Role</option>
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="STAFF">Staff</option>
                    </select>
                </div>
                {role === 'PATIENT' && (
                    <>
                        <div>
                            <label>Name: </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Birthdate: </label>
                            <input
                                type="date"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;