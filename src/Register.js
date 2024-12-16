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
            const response = await axios.post('https://userservice.app.cloud.cbh.kth.se/api/user/register', userDTO);
            alert(`User ${response.data.userName} registered successfully!`);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed. Please check the details and try again.';
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