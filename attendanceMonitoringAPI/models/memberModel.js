const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  joinedDate: {
    type: String,
    required: true
  },
  eventsAttendance: [{
    type: mongoose.Types.ObjectId,
    ref: 'Attendance'
  }]
});

const memberModel = mongoose.model('Member', memberSchema);

module.exports = memberModel;
