import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Axis Chart e2e Tests', () => {
  const url = 'http://localhost:4444/ids-axis-chart/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Axis Chart Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should render custom colors', async () => {
    const colorUrl = 'http://localhost:4444/ids-axis-chart/colors.html';
    await page.goto(colorUrl, { waitUntil: ['networkidle2', 'load'] });

    const attr = await page.evaluate(() => {
      const styles = getComputedStyle((document as any).querySelector('ids-axis-chart').shadowRoot.querySelector('.chart-legend .color-1'));
      return styles.getPropertyValue('background-color');
    });
    expect(attr).toEqual('rgb(0, 84, 177)');
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-axis-chart id="test">test</ids-axis-chart>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
