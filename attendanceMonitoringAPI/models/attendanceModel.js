const mongoose = require('mongoose');

const memberAttendanceSchema = new mongoose.Schema({
  event: {
    type: mongoose.Types.ObjectId,
    ref: 'Event',
    alias: 'eventId'
  },
  member: {
    type: mongoose.Types.ObjectId,
    ref: 'Member',
    required: true,
    alias: 'memberId'
  },
  timeIn: {
    required: true,
    type: String
  },
  timeOut: {
    required: true,
    type: String
  }
});

const attendanceModel = mongoose.model('Attendance', memberAttendanceSchema);

module.exports = attendanceModel;
