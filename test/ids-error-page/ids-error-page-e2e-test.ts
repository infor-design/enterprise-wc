import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Error Page e2e Tests', () => {
  const url = 'http://localhost:4444/ids-error-page/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Error Page Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-error-page
        id="test"
        fullsize=""
        visible="true"
        icon="empty-error-loading"
        label="Access Denied"
        description="Configuration Manager access has been denied."
        button-text="Return"></ids-error-page>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
