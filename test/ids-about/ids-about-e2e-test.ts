import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids About e2e Tests', () => {
  const url = 'http://localhost:4444/ids-about/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS About Component');
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-about id="test" product-name="Controls Example Application" product-version="Version No. XX"></ids-about>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });
});
