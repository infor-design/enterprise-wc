import countObjects from '../helpers/count-objects';
import checkForAxeViolations from '../helpers/check-for-axe-violations';

describe('Ids Notification Banner e2e Tests', () => {
  const url = 'http://localhost:4444/ids-notification-banner/example.html';

  it('should not have errors', async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Notification Banner Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await checkForAxeViolations(page, [
      'color-contrast',
      'page-has-heading-one'
    ]);
  });
});
