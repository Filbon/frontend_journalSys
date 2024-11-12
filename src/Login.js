import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginRequest = { userName, password };

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', loginRequest);
            setToken(response.data.split('Token: ')[1]); // Extract JWT from the response
            localStorage.setItem('Token',token);
            alert('Login successful');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {token && <p>JWT Token: {token}</p>}
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
