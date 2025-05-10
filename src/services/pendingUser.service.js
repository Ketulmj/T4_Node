import pendingUser from '../models/pendinguser.model.js';
import { idGenerator } from '../utils/idGenerator.js';

export async function createPendingUser(user) {
  user.UserId = idGenerator('organization', 15);
  await pendingUser.create(user);
  return [user.UserId, user.Name];
}

export async function getPendingUser(email) {
  return await pendingUser.findOne({ Email: email });
}

export async function deletePendingUser(orgId) {
  try {
    const user = await pendingUser.findOneAndDelete({ UserId: orgId });
      return user;
  } catch (error) {
    console.error(error);
  }
}