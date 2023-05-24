module.exports = {
  server: {
    command: 'node server.js',
    launchTimeout: 50000
  },
  // https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteerlaunchoptions
  launch: {
    headless: 1,
    devtools: false,
    ignoreHTTPSErrors: true,
    dumpio: false
  },
  browserContext: 'incognito'
};
