import { Router } from 'express';
const router = Router();
import { getUserByEmail, getTeachersByOrgId, getClassesByOrgId, getStudentsByOrgIdAndClass, getTeacherScheduleList, updateUser } from '../services/user.service.js';
import { encodeJwt, decodeJwt } from '../utils/auth.js';
import sendAbsenceEmail from '../mails/absence.mail.js';

// For login
router.post('/user/login', async (req, res) => {
    const user = req.body;
    const userExist = await getUserByEmail(user.email);
    // console.log(userExist)
    if (userExist) {
        if (userExist.Password === user.password) {
            const userdata = {
                userId: userExist.UserId,
                name: userExist.Name,
                email: userExist.Email,
                role: userExist.Role,
                orgId: userExist.OrgId,
                className: userExist.Class
            };
            const token = encodeJwt(userdata);
            res.cookie('auth', token, { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) });
            return res.json({
                error: false,
                redirectUrl: "/timetable",
                message: "Successfully Login",
                userData: userdata
            });
        } else {
            return res.json({ error: true, redirectUrl: "/login", message: "Password Incorrect" });
        }
    }
    return res.json({ error: true, redirectUrl: "/login", message: "User not exists" });
});

// Get teachers
router.get('/get/teachers', async (req, res) => {
    const orgId = req.query.OrgId;
    const teacherList = await getTeachersByOrgId(orgId);
    const filteredTeacherList = teacherList.map(teacher => ({ userId: teacher.userId, name: teacher.name }));
    return res.json(filteredTeacherList);
});

// Get user
router.get('/user/get', (req, res) => {
    const auth = req.cookies.auth;
    if (auth) {
        return res.json({ user: decodeJwt(auth) });
    }
    return res.json({ error: true, message: "Authorization failed" });
});

// Logout
router.get('/user/logout', (req, res) => {
    const auth = req.cookies.auth;
    if (auth) {
        res.clearCookie('auth');
    }
    return res.json({ status: true });
});

// Teacher absent
router.post('/user/teacher/absent', async (req, res) => {
    const absentData = req.body;
    const studentList = await getStudentsByOrgIdAndClass(absentData);
    const filteredStudentsEmailList = studentList.map(student => student.email);
    const orgName = (await getOrgNameByOrgId(absentData.orgId)).name;
    sendAbsenceEmail(filteredStudentsEmailList, absentData.name, absentData.subjectName, orgName, absentData.date);
    return res.json({ status: 200, message: "Mail sent to all students" });
});

const classes = [
    ["Nursery", "Pre-Kindergarten", "Kindergarten"],
    ["Class I", "Class II", "Class III", "Class IV", "Class V"],
    ["Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"],
    ["1st Year", "2nd Year", "3th Year", "4th Year", "5th Year", "6th Year", "7th Year"]
];

// Get organization classes
router.get('/get/org/classes', async (req, res) => {
    const orgId = req.query.orgId;
    const orgType = (await getClassesByOrgId(orgId)).OrgType;
    let orgClasses = [];
    if (orgType) {
        orgType.forEach(item => {
            orgClasses = orgClasses.concat(classes[item]);
        });
    }
    return res.json({ orgClasses });
});

// Update password
router.post('/user/update/changepassword', async (req, res) => {
    const chg = req.body;
    chg.email = decodeJwt(chg.id).toString();
    const result = await updateUser(chg.email, chg.newPassword);
    return res.json({ result });
});

// Get teacher schedules
router.get('/get/schedule', async (req, res) => {
    const teacherId = req.query.teacherId;
    const schedule = (await getTeacherScheduleList(teacherId));
    if (!schedule) return res.json({ error: true, message: "No schedule found" });
    const scheduleList = schedule.Schedule;
    return res.json({ scheduleList });
});

export default router;