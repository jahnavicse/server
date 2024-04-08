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
app.use('/products', prodRouter);

// Database connection
mongoose
  .connect('mongodb://127.0.0.1:27017/socialdb1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(8080, () => {
      console.log('Server Started on port 8080');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
