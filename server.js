// Setup a simple express server used only for running tests
const express = require('express');
const log = require('loglevel');

const app = express();
const port = process.env.PORT || 4444;

// Handle no extension files as html
app.use((req, res, next) => {
  if (req.path.indexOf('.') === -1) {
    res.setHeader('Content-Type', 'text/html');
  }
  next();
});

app.use('/', express.static(`${__dirname}/demo-dist`));

// Listen on port 4444
app.listen(port, () => {
  log.warn(`Dev server listening on port ${port}`);
});
