import mongoose from 'mongoose';
import TimetableData from '../models/timetable.js';
import user from '../models/user.js';

const timetableCollection = mongoose.connection.collection('Timetables'); // Ensure the collection name matches your MongoDB setup

export const getTimetableDataByOrgId = async (orgId) => {
  return await timetableCollection.find({ OrgId: orgId }).toArray();
};

export const insertTimetableData = async (timetableData) => {
  await timetableCollection.insertOne(timetableData);
};

export const getTimetable = async (className, orgId) => {
  return await timetableCollection.findOne({ Class: className, OrgId: orgId });
};

export const deleteTimetable = async (timeTableId) => {
  // Find the timetable to get the periods
  const timetable = await TimetableData.findOne({ _id: mongoose.Types.ObjectId(timeTableId) });
  
  if (timetable) {
    // Delete schedules for each period in the timetable
    for (const day of timetable.Timetable) {
      for (const period of day) {
        await user.updateMany(
          { 'Schedule.TeacherId': period.Subject.Teacher.TeacherId },
          { $pull: { Schedule: { StartTime: period.StartTime, ClassName: timetable.Class } } }
        );
      }
    }
    // Delete the timetable
    await TimetableData.deleteOne({ _id: mongoose.Types.ObjectId(timeTableId) });
  }
};