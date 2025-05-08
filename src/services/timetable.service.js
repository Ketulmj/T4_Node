import mongoose from 'mongoose';

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
  const filter = { Id: timeTableId };
  await timetableCollection.deleteOne(filter);
};