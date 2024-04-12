import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import hoursRoutes from './routes/hoursRoutes.js';
import newsRoutes from "./routes/newsRoutes.js";
import {dirname, join} from "path";
import {fileURLToPath} from "url";


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Define the CORS options
const corsOptions = {
  origin: ['http://localhost:5173', 'https://weeboulangeriefrontend-production.up.railway.app'], // Adjusted the URL here
  methods: 'GET,POST,PUT,DELETE', // Allow these methods
};

// Enable CORS with the specified options
app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Boulangerie backend is running...');
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(join(__dirname, './uploads')));
app.use('/api/hours', hoursRoutes);
app.use('/api/news', newsRoutes);


// Middleware for handling non-existing routes
app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message || 'An unknown error occurred' });
});

export default app;