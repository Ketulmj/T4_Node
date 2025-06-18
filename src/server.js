import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import env from 'dotenv'
import { router, userRouter, getRouter } from './routes/route.js'
import cookieParser from 'cookie-parser'

env.config()
const app = express();
const PORT = process.env.PORT || 3000;
console.log("client : " + process.env.CLIENT_ORIGIN);

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
  useUnifiedTopology: true
}).then(() =>
  console.log('Connected to MongoDB'));

// routes
app.use('/api', router);
app.use('/api/user', userRouter);
app.use('/api/get', getRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
