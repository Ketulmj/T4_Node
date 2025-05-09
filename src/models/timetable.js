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

const Period = new mongoose.Schema({
  StartTime: Number,
  Subject: Subject
});

const TimetableData = new mongoose.Schema({
  OrgId: {
    type: String,
    required: true
  },
  Class: {
    type: String,
    required: true
  },
  Year: {
    type: Number,
    required: true
  },
  BreakStartTime: {
    type: Number,
    required: true
  },
  BreakDuration: {
    type: Number,
    required: true
  },
  PeriodDuration: Number,
  LabDuration: Number,
  Timetable: {
    type: [[Period]],
    default: []
  }
});

export default TimetableData;