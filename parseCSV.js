const fs = require('fs');
const csv = require('csv-parser');

async function parseCSV(path) {
  return new Promise((resolve, reject) => {
    const result = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (row) => result.push(row))
      .on('end', () => resolve(result))
      .on('error', reject);
  });
}

module.exports.parseCSV = parseCSV;
