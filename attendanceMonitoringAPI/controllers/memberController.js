const MemberModel = require('../models/memberModel');
const { validationResult } = require('express-validator');

exports.getAllMembers = async (req, res) => {
  const members = await MemberModel.find().populate({
    path: 'eventsAttendance',
    select: '-member',
    populate: {
      path: 'event', select: 'name'
    }
  });

  res.send(members);
};

exports.getMemberById = async (req, res) => {
  const { id } = req.params;

  const member = await MemberModel.findById(id).populate({
    path: 'eventsAttendance',
    select: '-member',
    populate: {
      path: 'event', select: 'name'
    }
  });

  res.send(member);
};

exports.getMemberSearch = async (req, res, next) => {
  const status = req.query.status;
  const name = req.query.name;

  try {
    const member = await MemberModel
      .find().or([{ name: name }, { status: status }])
      .populate({
        path: 'eventsAttendance',
        select: '-member',
        populate: {
          path: 'event', select: 'name'
        }
      });

    res.send(member);
  } catch (e) {
    next({
      statusCode: 400,
      errorMessage: e.message
    });
  }
};

exports.inserMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const memberData = req.body;

  const memberModel = new MemberModel(memberData);

  const member = await memberModel.save();

  res.send(member);
};

exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const dataToUpdate = req.body;
  console.log(dataToUpdate);

  await MemberModel.findByIdAndUpdate(id, dataToUpdate);

  res.sendStatus(200);
};

exports.deleteMember = async (req, res) => {
  const { id } = req.params;

  const member = await MemberModel.findById(id).populate({
    path: 'eventsAttendance',
    select: '-member',
    populate: {
      path: 'event', select: 'name'
    }
  });

  if (member.eventsAttendance.length > 0) {
    return res.sendStatus(400);
  }
  await MemberModel.findByIdAndDelete(id);
  res.sendStatus(200);
};
