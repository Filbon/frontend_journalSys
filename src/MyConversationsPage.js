import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyConversationsPage = () => {
    const [messages, setMessages] = useState([]);
    const [replies, setReplies] = useState({}); // Keep track of replies per message
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        axios
            .get(`http://kubernetes.docker.internal:30080/api/messages/conversation/${userId}`)
            .then((response) => {
                setMessages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
            });
    }, [userId]);

    const handleReplyChange = (messageId, content) => {
        setReplies((prevReplies) => ({
            ...prevReplies,
            [messageId]: content
        }));
    };

    const handleReplySubmit = (e, messageId, recipientId) => {
        e.preventDefault();
        const replyContent = replies[messageId];

        if (!replyContent) {
            alert("Please type a reply.");
            return;
        }

        const reply = {
            senderId: userId,
            recipientId,
            senderName: localStorage.getItem('userName'),
            recipientName: messageId.recipientName, // Assuming recipient name is available in the message
            content: replyContent
        };

        axios
            .post("http://kubernetes.docker.internal:30080/api/messages/send", reply)
            .then((response) => {
                console.log("Reply sent:", response.data);
                // Optionally, you can refetch messages or add the new message to the state
                setMessages((prevMessages) => [
                    ...prevMessages,
                    response.data // Add the newly sent reply to the messages list
                ]);
                setReplies((prevReplies) => ({
                    ...prevReplies,
                    [messageId]: "" // Clear the reply input after sending
                }));
            })
            .catch((error) => {
                console.error("Error sending reply:", error);
            });
    };

    return (
        <div>
            <h1>My Conversations</h1>
            {messages.length === 0 ? (
                <p>No conversations yet.</p>
            ) : (
                <ul>
                    {messages.map((message) => (
                        <li key={message.id}>
                            <p><strong>From:</strong> {message.senderName}</p>
                            <p><strong>To:</strong> {message.recipientName}</p>
                            <p>{message.content}</p>
                            <p><strong>Sent on:</strong> {message.sentDate}</p>

                            {/* Reply Form */}
                            <form onSubmit={(e) => handleReplySubmit(e, message.id, message.senderId)}>
                                <textarea
                                    value={replies[message.id] || ''}
                                    onChange={(e) => handleReplyChange(message.id, e.target.value)}
                                    placeholder="Type your reply here"
                                    required
                                />
                                <button type="submit">Send Reply</button>
                            </form>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyConversationsPage;

