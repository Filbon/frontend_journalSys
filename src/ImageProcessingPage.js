import React, { useState } from 'react';
import axios from 'axios';

const ImageProcessingPage = () => {
    const [image, setImage] = useState(null);
    const [annotation, setAnnotation] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
        console.log(event.target.files[0]);
    };

    // Upload image function
    const handleUploadImage = async (event) => {
        event.preventDefault();

        // Check if a file is selected
        if (!image) {
            alert('Please select an image to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Image uploaded successfully:', response.data);

            // Assuming the backend returns the filename as imagePath
            setUploadedImage(response.data.filePath); // Save the filename or relative path
            setIsImageUploaded(true); // Set to true to display the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };


    // Add annotation function
    const handleAnnotateImage = async () => {
        if (!uploadedImage || !annotation) {
            alert('Please provide both an image and annotation.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/images/annotate', {
                imageId: uploadedImage,
                text: annotation,
            });
            console.log(response.data);
            alert('Annotation added successfully!');
        } catch (error) {
            console.error('Error annotating image:', error);
        }
    };


    return (
        <div>
            <h1>Image Processing Page</h1>

            {/* Image upload section */}
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUploadImage}>Upload Image</button>
            </div>

            {isImageUploaded && (
                <div>
                    <h2>Uploaded Image</h2>
                    <img src={`http://localhost:5000/api/images/${uploadedImage}`} alt="Uploaded" style={{ maxWidth: '500px' }} />
                </div>
            )}

            {/* Annotation section */}
            <div>
                <textarea
                    value={annotation}
                    onChange={(e) => setAnnotation(e.target.value)}
                    placeholder="Add annotation"
                    rows="4"
                    cols="50"
                />
                <button onClick={handleAnnotateImage}>Add Annotation</button>
            </div>
        </div>
    );
};

export default ImageProcessingPage;

