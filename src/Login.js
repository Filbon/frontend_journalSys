import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginRequest = { userName, password };

        try {
            const response = await axios.post('https://userservice.app.cloud.cbh.kth.se//api/user/login', loginRequest);

            const { role } = response.data;
            const { userId } = response.data
            const { userName } = response.data
            const { patientId }  = response.data;
            const {practitionerId} = response.data;
            localStorage.setItem('userRole', role);
            localStorage.setItem('patientId', patientId)
            localStorage.setItem('userId', userId)
            localStorage.setItem('userName', userName)
            localStorage.setItem('practitionerId', practitionerId)
            console.log(practitionerId)

            alert('Login successful');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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

