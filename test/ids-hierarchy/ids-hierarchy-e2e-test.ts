import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Hierarchy e2e test', () => {
  const url = 'http://localhost:4444/ids-hierarchy/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Hierarchy Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    const results = await new AxePuppeteer(page).disableRules(['color-contrast', 'aria-required-children', 'aria-required-parent', 'nested-interactive']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-hierarchy-legend id="test">
        <ids-hierarchy-legend-item
          text="Full Time"
          color="azure-80"
        ></ids-hierarchy-legend-item>
        <ids-hierarchy-legend-item
          text="Part Time"
          color="turquoise-20"
        ></ids-hierarchy-legend-item></ids-hierarchy-legend>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
