import bcrypt from 'bcryptjs';
import { getTeachersByOrgId, getClassesByOrgId, getOrgNameByOrgId, getStudentsByOrgIdAndClass, getTeacherScheduleList, updateUser } from '../services/user.service.js';
import { decodeJwt } from '../utils/auth.js';
import sendAbsenceEmail from '../mail-templates/absence.mail.js';

const classes = [
    ["Nursery", "Pre-Kindergarten", "Kindergarten"],
    ["Class I", "Class II", "Class III", "Class IV", "Class V"],
    ["Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"],
    ["1st Year", "2nd Year", "3th Year", "4th Year", "5th Year", "6th Year", "7th Year", "8th Year"]
];

// Get teachers
export const getTeachers = async (req, res) => {
    const orgId = req.query.OrgId;
    const teacherList = await getTeachersByOrgId(orgId);
    const filteredTeacherList = teacherList.map(teacher => ({ userId: teacher.UserId, name: teacher.Name }));
    res.json(filteredTeacherList);
};

// Get user
export const getUser = (req, res) => {
    const auth = req.body.token;
    if (auth) {
        res.json({ user: decodeJwt(auth) });
    }
    res.json({ error: true, message: "Authorization failed" });
};

// Teacher absent
export const teacherAbsent = async (req, res) => {
    const absentData = req.body;
    const studentList = await getStudentsByOrgIdAndClass(absentData);
    const filteredStudentsEmailList = studentList.map(student => student.Email);
    const orgName = (await getOrgNameByOrgId(absentData.orgId)).Name;
    sendAbsenceEmail(filteredStudentsEmailList, absentData.name, absentData.subjectName, orgName, absentData.date);
    res.json({ status: 200, message: "Mail sent to all students" });
};

// Get organization classes
export const getOrgClasses = async (req, res) => {
    try {
        const orgId = req.query.OrgId;
        const org = await getClassesByOrgId(orgId);
        let orgClasses = [];
        if (org && org.OrgType) { 
            var orgType = org.OrgType;
            orgType.forEach(item => {
                orgClasses = orgClasses.concat(classes[item]);
            });
        } else {
            res.json({ error: true, message: "Organization type not found" });
        }
        res.json({ orgClasses });
    } catch (error) {
        console.error("Error in getOrgClasses:", error);
        res.json({ error: true, message: "Internal Server Error" });
    }
};

// Update password
export const changePassword = async (req, res) => {
    try {
    const chg = req.body;
    chg.email = decodeJwt(chg.id).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(chg.newPassword, salt);
    const result = await updateUser(chg.email, hashedPassword);
    return res.json({ result });
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Internal Server Error");
    }
};

// Get teacher schedules
export const getSchedule = async (req, res) => {
    const teacherId = req.query.TeacherId;
    const scheduleList = (await getTeacherScheduleList(teacherId));
    if (!scheduleList) return res.json({ error: true, message: "No schedule found" });
    const schedule = scheduleList.Schedule;
    return res.json({ schedule });
};
