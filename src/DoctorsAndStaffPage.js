import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DoctorsAndStaffPage = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
        axios
            .get("http://localhost:8082/api/user/users/doctorOrStaff")
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

    const handleMessageClick = (recipientId, recipientName) => {
        // Use navigate for redirection
        navigate(`/sendMessage/${recipientId}/${recipientName}`);
    };

    return (
        <div>
            <h1>Doctors and Staff</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <span>{user.userName}</span>
                        <button onClick={() => handleMessageClick(user.id, user.userName)}>
                            Message
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorsAndStaffPage;

