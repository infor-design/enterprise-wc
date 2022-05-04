import percySnapshot from '@percy/puppeteer';

describe('Ids Calendar Event Percy Tests', () => {
  const url = 'http://localhost:4444/ids-calendar/calendar-event.html';

  it.skip('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await percySnapshot(page, 'ids-calendar-event-new-light');
  });
});
