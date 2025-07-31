import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import env from 'dotenv'
env.config()
import { router, userRouter, getRouter } from './routes/route.js'

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


// routes
app.use('/api', router);
app.use('/api/user', userRouter);
app.use('/api/get', getRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
