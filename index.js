import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import todoRouter from './routes/todoRoutes.js';
import prodRouter from './routes/prodRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/images', express.static('images'));

// Routes
app.use('/users', userRouter);
app.use('/todos', todoRouter);
app.use('/products', prodRouter); // Changed from prodRouter to products

// Database connection
const DB_URI = 'mongodb://127.0.0.1:27017/socialdb1'; // MongoDB URI
const PORT = process.env.PORT || 8080; // Use the provided port or default to 8080

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
