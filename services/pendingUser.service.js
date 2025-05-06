import mongoose from 'mongoose';
import { idGenerator } from '../utils/idGenerator.js';

const usersCollection = mongoose.connection.collection('PendingUsers'); 

export async function createPendingUser(user) {
  user.UserId = idGenerator('organization', 15);
  await usersCollection.insertOne(user);
  return [user.UserId, user.Name];
}

export async function getPendingUser(email) {
  return await usersCollection.findOne({ Email: email });
}

export async function deletePendingUser(orgId) {
  const filter = { UserId: orgId };
  return await usersCollection.findOneAndDelete(filter);
}