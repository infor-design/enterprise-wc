// Required Libraries
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const config = require('../webpack.config.js');

// Setup the port to run on
const PORT = 4300;

// Configure options for hot reload / web pack dev server
const options = {
  port: PORT,
  writeToDisk: true,
  contentBase: path.resolve(__dirname, 'dist'),
  liveReload: true,
  open: true,
  hot: false // not sure why this doesnt work as reliably as liveReload
};

// Start Express / webpack dev server
WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

// Listen for requests
server.listen(PORT, 'localhost', () => {
  console.log(`Dev server listening on port ${PORT}`);
});
