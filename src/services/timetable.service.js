import mongoose from 'mongoose';
import Timetables from '../models/timetable.model.js';
import User from '../models/user.model.js';

export const getTimetableDataByOrgId = async (orgId) => {
  return await Timetables.find({ OrgId: orgId });
};

export const insertTimetableData = async (timetableData) => {
  await Timetables.create(timetableData);
};

export const getTimetable = async (className, orgId) => {
  return await Timetables.findOne({ Class: className, OrgId: orgId });
};

export const deleteTimetable = async (timeTableId) => {
  try {
    const timetable = await Timetables.findOneAndDelete({ _id: mongoose.Types.ObjectId(timeTableId) });
    if (timetable) {
      for (const day of timetable.Timetable) {
        for (const period of day) {
          const teacher = await User.findOne({ 'UserId': period.Subject.Teacher.TeacherId });
          if (teacher) {
            teacher.Schedule = teacher.Schedule.filter(schedule => schedule.StartTime !== period.StartTime || schedule.ClassName !== timetable.Class);
            await teacher.save();
          }
        }
      }
    } else {
      console.error("Timetable not found for deletion");
      return null;
    }
  } catch (error) {
    console.error("Error deleting timetable:", error);
  }
};