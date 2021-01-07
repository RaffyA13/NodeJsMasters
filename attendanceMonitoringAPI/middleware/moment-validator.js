const Moment = require('moment');
const Error = require('./error');

function customMomentValidator (data1, data2, format) {
  const d1 = Moment(data1, format);
  const d2 = Moment(data2, format);

  if (d1 > d2) {
    throw Error.badRequest(`${data1} should be < ${data2}`);
  }
}

module.exports = customMomentValidator;
