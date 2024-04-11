import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';  // Correctly import cloudinary

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Set up Multer storage
const storage = multer.memoryStorage(); // Using memory storage for multer

// Set up multer upload middleware
const upload = multer({ storage: storage }).single('image');

// Define the controller function for handling file uploads
const handleFileUpload = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // Log and respond with the error if Multer encounters an issue
            console.error('Error uploading file:', err);
            return res.status(400).json({ message: err.message });
        }

        // Check if a file is present in the request
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        try {
            // Upload file to Cloudinary and specify folder name
            const result = await cloudinary.uploader.upload(`data:image/png;base64,${req.file.buffer.toString('base64')}`, {
                folder: 'the_wee_boulangerie'
            });

            // Send response with file information from Cloudinary
            res.json({
                filename: result.original_filename,
                url: result.secure_url
            });
        } catch (error) {
            // Log and respond with the error if Cloudinary encounters an issue
            console.error('Error uploading file to Cloudinary:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};

export default handleFileUpload;
