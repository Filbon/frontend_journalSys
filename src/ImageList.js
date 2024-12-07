import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ImageList = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulated API call to check the user's role
        const userRole = localStorage.getItem('userRole');

        if (userRole !== 'DOCTOR') {
            alert('Access denied. This page is for doctors only.');
            navigate('/'); // Redirect to home or another page
            return;
        }

        // Fetch the list of images if the role is DOCTOR
        axios.get('http://kubernetes.docker.internal:30050/api/images/images')
            .then(response => {
                setImages(response.data.images);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch images');
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return <p>Loading images...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Uploaded Images</h2>
            {images.length === 0 ? (
                <p>No images available.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {images.map(image => (
                        <div key={image.filename} style={{ border: '1px solid #ddd', padding: '5px', borderRadius: '5px' }}>
                            <Link to={`/image-processing?image=${image.filename}`} style={{ display: 'block' }}>
                                <img
                                    src={image.url}
                                    alt={image.filename}
                                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                                />
                                <p style={{ textAlign: 'center' }}>{image.filename}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageList;

