import pageSnapshot from '../helpers/page-snapshot';

describe('Ids Notification Banner Percy Tests', () => {
  const url = 'http://localhost:4444/ids-notification-banner/example.html';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await pageSnapshot(page, 'ids-notification-banner-new-light');
  });
});
