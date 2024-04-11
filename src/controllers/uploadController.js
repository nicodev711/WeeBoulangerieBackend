import express from 'express';
import multer from 'multer';
import cloudinary from "nodemon";

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
            console.error('Error uploading file:', err);
            return res.status(400).json({ message: err.message });
        }

        try {
            // Upload file to Cloudinary and specify folder name
            const result = await cloudinary.uploader.upload(req.file.buffer.toString('base64'), {
                folder: 'the_wee_boulangerie' // Replace 'your_folder_name' with your desired folder name
            });

            // Send response with file information from Cloudinary
            res.json({
                filename: result.original_filename,
                url: result.secure_url
            });
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};

export default handleFileUpload;
