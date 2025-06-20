import express from 'express';
import { userSignup, userLogin, getAuth, userLogout } from '../controllers/auth.controller.js';
import { changePassword, teacherAbsent, getUser, getTeachers, getOrgClasses, getSchedule } from '../controllers/user.controller.js';
import { forgotMail } from '../controllers/mail.controller.js';
import { getTTmetadata, deleteTT, getTT, uploadTimetable, generateTimetable } from '../controllers/timetable.controller.js';

// other routes
export const router = express.Router();

router.get('/delete/timetable', deleteTT)
router.post('/upload/timetable', uploadTimetable)
router.post('/generate/timetable', generateTimetable)

// user routes
export const userRouter = express.Router();

userRouter.post('/signup', userSignup)
userRouter.post('/login', userLogin)
userRouter.post('/get', getUser)
userRouter.get('/logout', userLogout)
userRouter.post('/teacher/absent', teacherAbsent)
userRouter.post('/update/changepassword', changePassword)
userRouter.post('/forgot/mail', forgotMail)

// get routes
export const getRouter = express.Router();

getRouter.get('/auth',getAuth)
getRouter.get('/teachers', getTeachers)
getRouter.get('/org/classes',getOrgClasses)
getRouter.get('/schedule', getSchedule)
getRouter.get('/timetable-metadata', getTTmetadata)
getRouter.get('/timetable', getTT)
