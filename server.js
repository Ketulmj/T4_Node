import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import env from 'dotenv'
import usersController from './controllers/user.controller.js'
import mailController from './controllers/mail.controller.js'
import timetablesController from './controllers/timetable.controller.js'
import pendingUserController from './controllers/pendingUser.controller.js'
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
app.use('/api', pendingUserController);
app.use('/api', usersController);
app.use('/api', mailController);
app.use('/api', timetablesController);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});