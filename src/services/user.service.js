import { idGenerator } from '../utils/idGenerator.js';
import User from '../models/user.model.js';

export const getUserByEmail = async (email) => {
  return await User.findOne({ Email: email });
};

export const createUser = async (userData) => {
  if(!userData.UserId)  userData.UserId = idGenerator(userData.Role);
  return await User.create(userData);
};

export const getTeachersByOrgId = async (orgId) => {
  return await User.find({ OrgId: orgId, Role: 'teacher' });
};

export const getClassesByOrgId = async (orgId) => {
  return await User.findOne({ UserId: orgId });
};

export const getOrgNameByOrgId = async (orgId) => {
  const user = await User.findOne({ UserId: orgId });
  return user ? user.Name : null;
};

export const getStudentsByOrgIdAndClass = async (absentData) => {
  return await User.find({ OrgId: absentData.OrgId, Class: absentData.Class, Role: 'student' });
};

export const getOrganizationByOrgId = async (orgId) => {
  return await User.findOne({ UserId: orgId });
};

export const getTeacherScheduleList = async (teacherId) => {
  return await User.findOne({ UserId: teacherId });
};

export const updateUser = async (email, newPassword) => {
  const filter = { Email: email };
  const update = { $set: { Password: newPassword } };
  const result = await User.updateOne(filter, update);
  return result.nModified > 0;
};

export const addScheduleToTeacher = async (teacherId, schedule) => {
  const filter = { UserId: teacherId };
  const update = { $push: { Schedule: schedule } };
  const result = await User.updateOne(filter, update);
  return result.modifiedCount > 0;
};