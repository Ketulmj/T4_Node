import { deleteTimetable, getTimetableDataByOrgId, getTimetable, insertTimetableData } from '../services/timetable.service.js';
import { addScheduleToTeacher, getTeacherScheduleList } from '../services/user.service.js';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const getTTmetadata = async (req, res) => {
    try {
        const timetablesWholeData = await getTimetableDataByOrgId(req.query.OrgId);
        if (timetablesWholeData) {
            const timetables = timetablesWholeData.map(tt => ({
                id: tt._id,
                className: tt.Class,
                year: tt.Year,
            }));
            return res.json({ timetables });
        }
        res.json({ timetables: [] });
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Internal Server Error");
    }
};

export const deleteTT = async (req, res) => {
    try {
        await deleteTimetable(req.query.id);
        res.json({ error: false, result: "TimeTable Deleted" });
    } catch (error) {
        res.json({ error: true, result: "Error Deleting TimeTable" });
    }
};

async function getScheduleListForAllTeachers(teachers) {
    const x = {};
    for (const item of teachers) {
        const tmp = (await getTeacherScheduleList(item.TeacherId)).Schedule;
        x[item.TeacherId] = tmp || [];
    }
    return x;
}

export const getTT = async (req, res) => {
    const className = req.query.class;
    const orgId = req.query.orgId;
    const tt = await getTimetable(className, orgId);
    res.json({ timetable: tt });
};

export const uploadTimetable = async (req, res) => {
    try {
        const TT = req.body;
        await insertTimetableData(TT.TimeTable);

        for (const item of TT.ScheduledTeachers) {
            await addScheduleToTeacher(item.TeacherId, {
                StartTime: item.StartTime,
                Day: item.Day,
                ClassName: item.ClassName,
                Subject: item.Subject,
                IsLab: item.IsLab,
                Duration: item.Duration
            });
        }
        res.json({ status: 200, result: "TimeTable Created" });
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Internal Server Error");
    }
};

export const generateTimetable = async (req, res) => {
    try {
        const data = req.body;
        const TimeTable = {
            OrgId: data.orgId,
            Class: data.class,
            Year: data.year,
            Subjects: [
                ...data.subjects.map(s => ({
                    Name: s.name,
                    IsLab: s.isLab,
                    Teacher: {
                        TeacherId: s.teacher.teacherId,
                        Name: s.teacher.name
                    }
                }))
            ],
            HoursPerDay: data.hoursPerDay,
            BreakStartTime: data.breakStartTime,
            BreakDuration: data.breakDuration,
            PeriodDuration: data.periodDuration,
            LabDuration: data.labDuration,
            StartTime: data.startTime
        }
        const subjects = TimeTable.Subjects;
        const tt = Array.from({ length: days.length }, () => []);

        const HoursPerDayInMinutes = (TimeTable.HoursPerDay * 60) - TimeTable.BreakDuration;
        const rand = Math.random;
        const scheduledTeachers = [];

        if (!(HoursPerDayInMinutes <= subjects.length * TimeTable.PeriodDuration)) {
            return res.json({ status: 400, message: "Decrease hoursPerDay or Increase periodDurations or Increase subjects", GeneratedTimeTable: [] });
        }

        const scheduleListForTeachers = await getScheduleListForAllTeachers(
            subjects.map(s => s.Teacher).filter((v, i, a) => a.findIndex(t => t.TeacherId === v.TeacherId) === i)
        );

        const busySlots = new Set();

        for (const kv of Object.entries(scheduleListForTeachers)) {
            for (const sched of kv[1]) {
                for (let t = sched.StartTime; t < sched.StartTime + sched.Duration; t += TimeTable.PeriodDuration) {
                    busySlots.add(`${kv[0]}-${sched.Day}-${t}`);
                }
            }
        }

        for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
            const day = days[dayIdx];
            let currentTime = TimeTable.StartTime;
            const assignedTeachersToday = new Set();

            while (currentTime - TimeTable.StartTime < HoursPerDayInMinutes) {
                if (currentTime >= TimeTable.BreakStartTime && currentTime < TimeTable.BreakStartTime + TimeTable.BreakDuration) {
                    currentTime += TimeTable.BreakDuration;
                    continue;
                }

                const availableSubjects = subjects.filter(sub =>
                    !assignedTeachersToday.has(sub.Teacher.TeacherId) &&
                    !busySlots.has(`${sub.Teacher.TeacherId}-${dayIdx}-${currentTime}`)
                );

                if (!availableSubjects.length) {
                    break;
                }

                const selectedSubject = availableSubjects[Math.floor(rand() * availableSubjects.length)];

                tt[dayIdx].push({ StartTime: currentTime, Subject: selectedSubject });

                scheduledTeachers.push({
                    StartTime: currentTime,
                    ClassName: TimeTable.Class,
                    Day: dayIdx,
                    TeacherId: selectedSubject.Teacher.TeacherId,
                    Subject: selectedSubject,
                    IsLab: selectedSubject.IsLab,
                    Duration: selectedSubject.IsLab ? TimeTable.LabDuration : TimeTable.PeriodDuration
                });

                assignedTeachersToday.add(selectedSubject.Teacher.TeacherId);
                currentTime += selectedSubject.IsLab ? TimeTable.LabDuration : TimeTable.PeriodDuration;
            }
        }

        const generatedTT = {
            Timetable: tt,
            OrgId: TimeTable.OrgId,
            Class: TimeTable.Class,
            Year: TimeTable.Year,
            BreakStartTime: TimeTable.BreakStartTime,
            BreakDuration: TimeTable.BreakDuration,
            PeriodDuration: TimeTable.PeriodDuration,
            LabDuration: TimeTable.LabDuration
        };
        res.json({ status: 200, generatedTT, scheduledTeachers });
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Internal Server Error");
    }
};