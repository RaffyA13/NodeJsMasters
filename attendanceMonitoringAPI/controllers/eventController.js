const EventModel = require('../models/eventModel');
const Moment = require('moment');
const ExcelExportService = require('../service/exportFileService');

exports.getAllEvents = async (req, res) => {
  const events = await EventModel.find().populate({
    path: 'membersAttendance',
    populate: {
      path: 'member', select: 'name'
    }
  });

  res.send(events);
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  const event = await EventModel.findById(id);

  res.send(event);
};

exports.getEventExportById = async (req, res) => {
  const { id } = req.params;
  const event = await EventModel.findById(id).select('membersAttendance name startDate -_id').populate({
    path: 'membersAttendance',
    select: 'member timeIn timeOut -_id',
    options: { sort: { timeIn: 'asc' } },
    populate: {
      path: 'member', select: 'name -_id'
    }
  });

  const fileName = `${event.name}-${Moment(event.startDate, 'MM/DD/YYYY').format('MM_DD_YYYY')}`;
  const filePath = 'exportPath';

  const resultSet = [];

  for (const key in event.membersAttendance) {
    resultSet.push({
      'Member Name': event.membersAttendance[key].member.name,
      'Time-In': event.membersAttendance[key].timeIn,
      'Time-out': event.membersAttendance[key].timeOut
    });
  }

  const exportServiceXlsx = new ExcelExportService(fileName, filePath);
  exportServiceXlsx.export(resultSet);

  const path = require('path');
  const completePath = path.join(__dirname, `../${filePath}`, `${fileName}.xlsx`);

  res.download(completePath);
};

exports.getEventSearch = async (req, res, next) => {
  const eventName = req.query.eventName;
  const dateStart = req.query.dateStart;
  const dateEnd = req.query.dateEnd;

  try {
    const event = await EventModel
      .find().or([{ name: eventName }, { startDate: dateStart }, { endDate: dateEnd }])
      .populate({
        path: 'membersAttendance',
        populate: {
          path: 'member', select: 'name'
        }
      });

    res.send(event);
  } catch (e) {
    next({
      statusCode: 400,
      errorMessage: e.message
    });
  }
};

exports.inserEvent = async (req, res, next) => {
  const eventData = req.body;

  try {
    const eventModel = new EventModel(eventData);

    const d1 = Moment(eventModel.startDate, 'MM/DD/YYYY');
    const d2 = Moment(eventModel.endDate, 'MM/DD/YYYY');

    if (d1 > d2) {
      throw new Error('start date should be < event end date');
    }

    const event = await eventModel.save();

    res.send(event);
  } catch (e) {
    next({
      statusCode: 400,
      errorMessage: e.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const dataToUpdate = req.body;
  console.log(dataToUpdate);

  await EventModel.findByIdAndUpdate(id, dataToUpdate);

  res.sendStatus(200);
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  const event = await EventModel.findById(id);

  if (event.membersAttendance.length > 0) {
    return res.sendStatus(400);
  }
  await EventModel.findByIdAndDelete(id);
  res.sendStatus(200);
};
