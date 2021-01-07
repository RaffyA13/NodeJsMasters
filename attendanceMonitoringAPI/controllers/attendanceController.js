const AttendanceModel = require('../models/attendanceModel');
const EventModel = require('../models/eventModel');
const MemberModel = require('../models/memberModel');
const customMomentValidator = require('../middleware/moment-validator');

exports.getAllAttendance = async (req, res) => {
  const attendance = await AttendanceModel.find().populate('member', '-eventsAttendance').populate('event', '-membersAttendance');

  res.send(attendance);
};

exports.getAttendanceById = async (req, res) => {
  const { id } = req.params;

  const attendance = await AttendanceModel.findById(id).populate('member', '-eventsAttendance').populate('event', '-membersAttendance');

  res.send(attendance);
};

exports.inserAttendance = async (req, res, next) => {
  const attendanceData = req.body;

  try {
    const attendanceModel = new AttendanceModel(attendanceData);

    // const t1 = Moment(attendanceModel.timeIn, 'HH:mm');
    // const t2 = Moment(attendanceModel.timeOut, 'HH:mm');

    // if (t1 > t2) {
    //   throw new Error('Time-in date should be < Time-out date');
    // }

    customMomentValidator(attendanceModel.timeIn, attendanceModel.timeOut, 'HH:mm');

    const attendance = await attendanceModel.save();

    const eventDoc = await EventModel.findById(attendanceData.eventId);

    eventDoc.membersAttendance.push(attendance._id);

    await eventDoc.save();

    const memberDoc = await MemberModel.findById(attendanceData.memberId);

    memberDoc.eventsAttendance.push(attendance._id);

    await memberDoc.save();

    res.send(attendance);
  } catch (e) {
    next({
      statusCode: 400,
      errorMessage: e.message
    });
  }
};

exports.updateAttendance = async (req, res) => {
  const { id } = req.params;
  const dataToUpdate = req.body;
  console.log(dataToUpdate);

  await AttendanceModel.findByIdAndUpdate(id, dataToUpdate);

  res.sendStatus(200);
};

exports.deleteAttendance = async (req, res) => {
  const { id } = req.params;

  await AttendanceModel.findByIdAndDelete(id);

  res.sendStatus(200);
};
