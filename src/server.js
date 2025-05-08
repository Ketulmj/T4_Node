import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import env from 'dotenv'
import { router, userRouter, getRouter } from './routes/route.js'
import cookieParser from 'cookie-parser'

const app = express();
const PORT = process.env.PORT || 3000;
env.config()
app.use(cookieParser());

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() =>
  console.log('Connected to MongoDB'));

// Middleware and routes setup
app.use('/api', router);
app.use('/api/user', userRouter);
app.use('/api/get', getRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});