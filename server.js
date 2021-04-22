// Setup a simple express server used only for running tests
const express = require('express');
const fs = require('fs');
const log = require('loglevel');

const app = express();
const port = 4444;

// Handle no extension files as html
app.use((req, res, next) => {
  if (req.path.indexOf('.') === -1) {
    res.setHeader('Content-Type', 'text/html');
  }
  next();
});

app.use('/', express.static(`${__dirname}/dist`));

// Server the static data in app data
app.get('/api/:fileName', (req, res) => {
  const { fileName } = req.params;
  const json = fs.readFileSync(`./app/data/${fileName}.json`, 'utf8');
  res.json(JSON.parse(json));
});

// Listen on port 4444
app.listen(port, () => {
  log.warn(`Dev server listening on port ${port}`);
});
