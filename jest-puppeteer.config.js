module.exports = {
  server: {
    command: 'PORT=4444 node server.js',
    port: 4444,
    launchTimeout: 10000
  },
  launch: {
    headless: true,
    devtools: false,
    ignoreHTTPSErrors: true
  }
};
