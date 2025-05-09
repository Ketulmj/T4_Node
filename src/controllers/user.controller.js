import { getTeachersByOrgId, getClassesByOrgId, getOrgNameByOrgId, getStudentsByOrgIdAndClass, getTeacherScheduleList, updateUser } from '../services/user.service.js';
import { decodeJwt } from '../utils/auth.js';
import sendAbsenceEmail from '../mails/absence.mail.js';

const classes = [
    ["Nursery", "Pre-Kindergarten", "Kindergarten"],
    ["Class I", "Class II", "Class III", "Class IV", "Class V"],
    ["Class VI", "Class VII", "Class VIII", "Class IX", "Class X", "Class XI", "Class XII"],
    ["1st Year", "2nd Year", "3th Year", "4th Year", "5th Year", "6th Year", "7th Year",  "8th Year"]
];

// Get teachers
export const getTeachers = async (req, res) => {
    const orgId = req.query.OrgId;
    const teacherList = await getTeachersByOrgId(orgId);
    const filteredTeacherList = teacherList.map(teacher => ({ userId: teacher.UserId, name: teacher.Name }));
    return res.json(filteredTeacherList);
};

// Get user
export const getUser = (req, res) => {
    const auth = req.cookies.auth;
    if (auth) {
        return res.json({ user: decodeJwt(auth) });
    }
    return res.json({ error: true, message: "Authorization failed" });
};


// Teacher absent
export const teacherAbsent = async (req, res) => {
    const absentData = req.body;
    const studentList = await getStudentsByOrgIdAndClass(absentData);
    const filteredStudentsEmailList = studentList.map(student => student.Email);
    const orgName = (await getOrgNameByOrgId(absentData.orgId)).Name;
    sendAbsenceEmail(filteredStudentsEmailList, absentData.name, absentData.subjectName, orgName, absentData.date);
    return res.json({ status: 200, message: "Mail sent to all students" });
};

// Get organization classes
export const getOrgClasses = async (req, res) => {
    const orgId = req.query.OrgId;
    const org = await getClassesByOrgId(orgId);
    let orgClasses = [];
    if (org && org.OrgType) {  // Ensure org and org.OrgType are defined
        var orgType = org.OrgType;
        orgType.forEach(item => {
            orgClasses = orgClasses.concat(classes[item]);
        });
    } else {
        return res.json({ error: true, message: "Organization type not found" });
    }
    return res.json({ orgClasses });
};

// Update password
export const changePassword =async (req, res) => {
    const chg = req.body;
    chg.email = decodeJwt(chg.id).toString();
    const result = await updateUser(chg.email, chg.newPassword);
    return res.json({ result });
};

// Get teacher schedules
export const getSchedule = async (req, res) => {
    const teacherId = req.query.TeacherId;
    const scheduleList = (await getTeacherScheduleList(teacherId));
    if (!scheduleList) return res.json({ error: true, message: "No schedule found" });
    const schedule = scheduleList.Schedule;
    return res.json({ schedule });
};