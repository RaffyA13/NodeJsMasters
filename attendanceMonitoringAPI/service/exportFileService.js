const xl = require('excel4node');
const path = require('path');

class ExcelExportService {
  constructor (fileName, filePath) {
    this.fileName = `${fileName}.xlsx`;
    this.filePath = path.join(__dirname, `../${filePath}`, this.fileName);
  }

  export (data) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('report 1');

    const rows = data;

    const rowHeader = rows[0];
    const header = Object.keys(rowHeader).map((key) => [key, rowHeader[key]]);

    header.forEach((value, index) => {
      ws.cell(1, index + 1).string(value[0].toString());
    });

    rows.forEach((value, index) => {
      const obj = Object.keys(value).map((key) => [key, value[key]]);

      obj.forEach((v, i) => {
        const ind = index + 2;
        const it = i + 1;

        if (typeof (v[1]) === 'string') {
          ws.cell(ind, it).string(v[1].toString());
        } else if (typeof (v[1]) === 'number') {
          ws.cell(ind, it).number(v[1]);
        } else {
          console.log(typeof (v[1]));
        }
      });
    });
    wb.write(this.filePath);
  }
}

module.exports = ExcelExportService;
