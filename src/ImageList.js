import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ImageList = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the list of images when the component mounts
        axios.get('http://localhost:5000/api/images/images')
            .then(response => {
                setImages(response.data.images);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch images');
                setLoading(false);
            });
    }, []);

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
