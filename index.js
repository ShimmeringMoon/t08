const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const CSVParser = require('./parseCSV');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());
app.use(fileUpload());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', async (req, res) => {
  if (!req.files || !req.files.csvFile) {
    return res.status(400).send('No file uploaded');
  }

  const file = req.files.csvFile;
  const savePath = path.join(__dirname, 'uploaded.csv');

  await file.mv(savePath);
  const data = await CSVParser.parseCSV(savePath);

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
