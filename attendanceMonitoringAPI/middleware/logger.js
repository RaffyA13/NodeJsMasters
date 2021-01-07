const Moment = require('moment');
var XLSX = require('xlsx');
const path = require('path');
const ExcelExportService = require('../service/exportFileService');

class Logger {
  log (data) {
    const fileName = `AttendanceMonitoringLogs-${Moment().format('YYYY-MM-DD')}`;
    const filePath = 'logFiles';

    try {
      // readF
      const readFile = path.join(__dirname, `../${filePath}/${fileName}.xlsx`);
      const workbook = XLSX.readFile(readFile);
      const xl = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      // combine
      xl.push(data[0]);

      const exportServiceXlsx = new ExcelExportService(fileName, filePath);
      exportServiceXlsx.export(xl);
    } catch (e) {
      console.log(e);
      // WriteF
      const exportServiceXlsx = new ExcelExportService(fileName, filePath);
      exportServiceXlsx.export(data);
    }
  }
}

module.exports = Logger;
