import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Toast e2e Tests', () => {
  const url = 'http://localhost:4444/ids-toast/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Toast Component');
    await expect(page.evaluate('document.querySelector("ids-theme-switcher").getAttribute("mode")'))
      .resolves.toMatch('light');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      const template = `
        <ids-toast
          id="test"
          allow-link="true"
          audible="true"
          draggable="true"
          position="bottom-end"
          progress-bar="true"
          timeout="100">
        </ids-toast>
      `;
      document.body.insertAdjacentHTML('beforeend', template);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
