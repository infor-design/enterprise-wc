// This config is only used when using puppetter
// Otherwise the options are in the web pack config
// Required Libraries
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const log = require('loglevel');
const config = require('./webpack.config.js');

// Setup the port to run on
const PORT = process.env.PORT || 4300;

// Configure options for hot reload / web pack dev server
const options = {
  port: PORT,
  writeToDisk: true,
  contentBase: path.resolve(__dirname, 'dist'),
  liveReload: false,
  hot: false,
  before: (app) => {
    app.get('/api/:fileName', (req, res) => {
      const { fileName } = req.params;
      const json = fs.readFileSync(`./app/data/${fileName}.json`, 'utf8');
      res.json(JSON.parse(json));
    });
  },
};

// Start Express / webpack dev server
WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

// Listen for requests
server.listen(PORT, 'localhost', () => {
  log.warn(`Dev server listening on port ${PORT}`);
});
