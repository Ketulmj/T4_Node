import mongoose from 'mongoose';
import { idGenerator } from '../utils/idGenerator.js';

const usersCollection = mongoose.connection.collection('Users');

export const getUserByEmail = async (email) => {
  return await usersCollection.findOne({ Email: email });
};

export const createUser = async (userData) => {
  userData.UserId = idGenerator(userData.Role);
  try {
    await usersCollection.insertOne(userData);
  } catch (error) {
    throw error;
  }
};

export const getTeachersByOrgId = async (orgId) => {
  return await usersCollection.find({ OrgId: orgId, Role: 'teacher' }).toArray();
};

export const getClassesByOrgId = async (orgId) => {
  return await usersCollection.findOne({ UserId: orgId });
};

export const getOrgNameByOrgId = async (orgId) => {
  return await usersCollection.findOne({ UserId: orgId });
};

export const getStudentsByOrgIdAndClass = async (absentData) => {
  return await usersCollection.find({ OrgId: absentData.OrgId, Class: absentData.Class, Role: 'student' }).toArray();
};

export const getOrganizationByOrgId = async (orgId) => {
  return await usersCollection.findOne({ UserId: orgId });
};

export const getTeacherScheduleList = async (teacherId) => {
  return await usersCollection.findOne({ UserId: teacherId });
};

export const updateUser = async (email, newPassword) => {
  const filter = { Email: email };
  const update = { $set: { Password: newPassword } };
  const result = await usersCollection.updateOne(filter, update);
  return result.modifiedCount > 0;
};

export const addScheduleToTeacher = async (teacherId, schedule) => {
  const filter = { UserId: teacherId };
  const update = { $push: { Schedule: schedule } };
  const result = await usersCollection.updateOne(filter, update);
  return result.modifiedCount > 0;
};