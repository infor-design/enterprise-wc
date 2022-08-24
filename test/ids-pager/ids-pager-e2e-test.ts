import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Pager e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-pager/example.html';
  const sandboxUrl = 'http://localhost:4444/ids-pager/sandbox.html';

  it('should not have errors', async () => {
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page.title()).resolves.toMatch('IDS Pager Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results = await new AxePuppeteer(page).disableRules(['color-contrast', 'region']).analyze();
    expect(results.violations.length).toBe(0);

    await page.goto(sandboxUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    const results2 = await new AxePuppeteer(page).disableRules(['color-contrast', 'region']).analyze();
    expect(results2.violations.length).toBe(0);
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-pager page-number="1" page-size="20" total="200" id="test">
        <ids-pager-button first></ids-pager-button>
        <ids-pager-button previous></ids-pager-button>
        <ids-pager-input></ids-pager-input>
        <ids-pager-button next></ids-pager-button>
        <ids-pager-button last></ids-pager-button>
      </ids-pager>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
