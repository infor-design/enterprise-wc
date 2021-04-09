module.exports = {
  server: {
    command: 'PORT=4444 node server.js',
    port: 4444,
    launchTimeout: 20000
  },
  // https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteerlaunchoptions
  launch: {
    headless: true,
    devtools: false,
    ignoreHTTPSErrors: true,
    dumpio: true,
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  }
};
