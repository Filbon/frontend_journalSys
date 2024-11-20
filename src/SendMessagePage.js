import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import necessary hooks

const SendMessagePage = () => {
    const [content, setContent] = useState("");
    const senderId = localStorage.getItem("userId"); // Get the sender's ID from localStorage
    const senderName = localStorage.getItem("userName"); // Get the sender's name from localStorage
    const { recipientId, recipientName } = useParams(); // Get recipient's ID and name from URL params
    const navigate = useNavigate(); // For programmatic navigation
    console.log(recipientName)
    console.log(recipientId)

    const handleSubmit = (e) => {
        e.preventDefault();

        const message = {
            senderId,
            recipientId,
            senderName,
            recipientName,
            content
        };

        axios
            .post("http://localhost:8080/api/messages/send", message)
            .then((response) => {
                console.log("Message sent:", response.data);
                navigate("/myConversations"); // Redirect after message is sent
            })
            .catch((error) => {
                console.error("Error sending message:", error);
            });
    };

    return (
        <div>
            <h1>Send Message to {recipientName}</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message here"
                    required
                />
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
};

export default SendMessagePage;

