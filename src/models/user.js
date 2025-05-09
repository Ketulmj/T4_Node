import mongoose from 'mongoose'; 

const Teacher = new mongoose.Schema({
  Name: String,
  TeacherId: String
});

const Subject = new mongoose.Schema({
  Name: String,
  IsLab: Boolean,
  Teacher: Teacher
});

const Schedule = new mongoose.Schema({
  StartTime: Number,
  Day: Number,
  ClassName: String,
  Subject: Subject,
  IsLab: Boolean,
  Duration: Number
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

export default User;