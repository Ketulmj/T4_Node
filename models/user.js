import mongoose from 'mongoose';

const Schedule = new mongoose.Schema({
  StartTime: Number,
  Day: Number,
  ClassName: String,
  Subject: String,
  IsLab: Boolean,
  Duration: Number,
  TeacherId: String
});

const User = new mongoose.Schema({
  UserId: String,
  Name: String,
  Email: String,
  Password: String,
  Role: String,
  OrgId: {
    type: String,
    default: null
  },
  Class: {
    type: String,
    default: null
  },
  OrgType: {
    type: [Number],
    default: []
  },
  Schedule: {
    type: [Schedule],
    default: []
  }
});

const user = mongoose.model('User', User);

export default user;