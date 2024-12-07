import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';

const ImageProcessingPage = () => {
    const [image, setImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [annotations, setAnnotations] = useState([]);
    const [newAnnotation, setNewAnnotation] = useState(null);
    const [drawingMode, setDrawingMode] = useState(false); // Toggle between annotation and drawing mode
    const [drawingData, setDrawingData] = useState([]); // Store drawing data (line segments)
    const [imageWidth, setImageWidth] = useState(500); // Default width (change as needed)
    const [imageHeight, setImageHeight] = useState(500); // Default height (change as needed)
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);

    // Get the image filename from the URL parameter if it exists
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const userRole = localStorage.getItem('userRole'); // Replace with actual role-checking logic

        if (userRole !== 'DOCTOR') {
            alert('Access denied. This page is for doctors only.');
            navigate('/'); // Redirect to home or another page
            return;
        }

        const params = new URLSearchParams(location.search);
        const imageFromParam = params.get('image');
        if (imageFromParam) {
            setUploadedImage(imageFromParam);
            setIsImageUploaded(true);
        }
    }, [location.search, navigate]);

    useEffect(() => {
        if (uploadedImage) {
            // Create an Image object to get the real dimensions
            const img = new Image();
            img.onload = () => {
                setImageWidth(img.width);
                setImageHeight(img.height);
            };
            img.src = `http://kubernetes.docker.internal:30050/api/images/${uploadedImage}`;
        }
    }, [uploadedImage]);

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUploadImage = async (event) => {
        event.preventDefault();
        if (!image) {
            alert('Please select an image to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await axios.post('http://kubernetes.docker.internal:30050/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadedImage(response.data.filePath);
            setIsImageUploaded(true);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleImageClick = (event) => {
        if (drawingMode) return; // Do not add text annotations in drawing mode

        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setNewAnnotation({ x, y, text: '' });
    };

    const handleAnnotationChange = (event) => {
        setNewAnnotation((prev) => ({
            ...prev,
            text: event.target.value,
        }));
    };

    const handleSaveAnnotation = async () => {
        if (!newAnnotation || !newAnnotation.text.trim()) {
            alert('Annotation text cannot be empty.');
            return;
        }

        try {
            const response = await axios.post('http://kubernetes.docker.internal:30050/api/images/annotate', {
                imageId: uploadedImage,
                text: newAnnotation.text,
                x: newAnnotation.x,
                y: newAnnotation.y,
            });
            setAnnotations((prev) => [...prev, newAnnotation]);
            setNewAnnotation(null);
            alert('Annotation added successfully!');
        } catch (error) {
            console.error('Error saving annotation:', error);
        }
    };

    const handleCancelAnnotation = () => {
        setNewAnnotation(null);
    };

    const handleMouseDown = (event) => {
        if (!drawingMode) return; // Only trigger drawing mode

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        isDrawing.current = true;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setDrawingData((prev) => [...prev, { x, y, color: 'black', lineWidth: 2 }]);
    };

    const handleMouseMove = (event) => {
        if (!drawingMode || !isDrawing.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();

        setDrawingData((prev) => {
            const lastSegment = prev[prev.length - 1];
            return [
                ...prev.slice(0, prev.length - 1),
                { ...lastSegment, x, y },
            ];
        });
    };

    const handleMouseUp = () => {
        if (drawingMode) {
            isDrawing.current = false;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.closePath();
        }
    };

    const handleToggleDrawingMode = () => {
        setDrawingMode((prev) => !prev);
    };

    const handleSaveDrawing = async () => {
        if (!drawingMode || drawingData.length === 0) {
            alert('No drawing data available or not in drawing mode.');
            return;
        }

        try {
            const base64Drawing = canvasRef.current.toDataURL('image/png').split(',')[1]; // Convert to base64 format

            const response = await axios.post('http://kubernetes.docker.internal:30050/api/images/draw', {
                imageId: uploadedImage,
                drawingData: base64Drawing, // Send as base64-encoded string
            });

            alert('Drawing applied successfully!');
            // Optionally clear the canvas or update UI after saving
            setDrawingData([]);
        } catch (error) {
            console.error('Error applying drawing:', error);
            alert('Error applying drawing');
        }
    };

    return (
        <div>
            <h1>Image Processing Page</h1>

            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUploadImage}>Upload Image</button>
                <button onClick={handleToggleDrawingMode}>
                    {drawingMode ? 'Switch to Annotation Mode' : 'Switch to Drawing Mode'}
                </button>
                <button onClick={handleSaveDrawing}>Save Drawing</button>
            </div>

            {isImageUploaded && (
                <div
                    style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: imageWidth,
                        height: imageHeight,
                    }}
                    onClick={handleImageClick}
                >
                    <h2>Uploaded Image</h2>
                    <img
                        src={`http://kubernetes.docker.internal:30050/api/images/${uploadedImage}`}
                        alt="Uploaded"
                        style={{
                            width: '100%',  // Ensures the image size matches the container size
                            height: '100%', // Matches the height of the container
                            display: 'block', // Remove any unwanted spacing
                            cursor: 'pointer',
                            position: 'absolute', // Aligns with the canvas
                            top: 0,
                            left: 0,
                        }}
                    />

                    {/* Canvas overlay for drawing */}
                    <canvas
                        ref={canvasRef}
                        width={imageWidth} // Matches the image width
                        height={imageHeight} // Matches the image height
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: drawingMode ? 'auto' : 'none',
                            zIndex: 1, // Ensures it overlays on top of the image
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    />

                    {/* Render existing annotations */}
                    {annotations.map((annotation, index) => (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                left: `${annotation.x}px`,
                                top: `${annotation.y}px`,
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                padding: '2px 5px',
                                borderRadius: '3px',
                                fontSize: '12px',
                                zIndex: 2, // Ensure annotations are on top of the canvas
                            }}
                        >
                            {annotation.text}
                        </div>
                    ))}

                    {/* Render the new annotation input and buttons */}
                    {newAnnotation && (
                        <div
                            style={{
                                position: 'absolute',
                                left: `${newAnnotation.x}px`,
                                top: `${newAnnotation.y}px`,
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px',
                                zIndex: 3, // Ensure input is above all other elements
                            }}
                        >
                            <input
                                type="text"
                                value={newAnnotation.text}
                                onChange={handleAnnotationChange}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    padding: '5px',
                                    fontSize: '14px',
                                }}
                            />
                            <div>
                                <button onClick={handleSaveAnnotation} style={{ marginRight: '5px' }}>
                                    Save Annotation
                                </button>
                                <button onClick={handleCancelAnnotation}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default ImageProcessingPage;
