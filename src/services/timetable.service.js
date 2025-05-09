import mongoose from 'mongoose';
import Timetables from '../models/timetable.js';
import User from '../models/user.js';

const timetableCollection = mongoose.connection.collection('Timetables', Timetables);
const usersCollection = mongoose.connection.collection('Users', User);

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
  const timetable = await timetableCollection.findOne({ _id: mongoose.Types.ObjectId(timeTableId) });

  if (timetable) {
    for (const day of timetable.Timetable) {
      for (const period of day) {
        usersCollection.deleteMany(
          { 'Schedule.TeacherId': period.Subject.Teacher.TeacherId },
          { $pull: { Schedule: { StartTime: period.StartTime, ClassName: timetable.Class } } }
        );
      }
    }
  } else {
  }
  await timetableCollection.deleteOne({ _id: mongoose.Types.ObjectId(timeTableId) });
};