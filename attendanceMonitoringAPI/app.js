const express = require('express');
const eventRouter = require('./routers/eventRouter');
const memberRouter = require('./routers/memberRouter');
const attendanceRouter = require('./routers/attendanceRouter');
const dbConnect = require('./db/dbConnect');

const errorHandler = require('./middleware/errorHandler');
const Logger = require('./middleware/logger');

const events = require('events');

const dotenv = require('dotenv');
dotenv.config({
  path: './config/config.env'
});

dbConnect();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(async (req, res, next) => {
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const requestBody = JSON.stringify(req.body);

  const logger = new Logger();

  const data = [
    { endPoint: fullUrl, params: requestBody }
  ];

  const loggerEmmitter = new events.EventEmitter(data);

  loggerEmmitter.on('logger', function (data) {
    logger.log(data);
  });

  loggerEmmitter.emit('logger', data);
  next();
});

app.use(express.json());
app.use('/events', eventRouter);
app.use('/members', memberRouter);
app.use('/attendance', attendanceRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
