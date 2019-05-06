const xlsx = require('node-xlsx');
const fs = require('fs');
const urlencode = require('urlencode');

module.exports = {
  exportExcel: (ctx, data, fileName, options ) => {
    const buffer = xlsx.build([{ name: 'sheet1', data, }], options);
    fs.writeFileSync(fileName, buffer, { 'flag': 'w' }, err => {
      if (err) console.log(err);
    }); // 如果文件存在，覆盖
    ctx.type = '.xlsx';
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.set('Content-Disposition', 'attachment;filename=' + urlencode.encode(fileName, 'UTF-8'));
    ctx.set('Content-Type', 'application/x-download');
    ctx.body = fs.readFileSync(fileName);
    fs.unlink(fileName, err => {
      if (err) console.log(err);
    });
  }

};