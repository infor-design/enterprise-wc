import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Step Chart e2e Tests', () => {
  const url = 'http://localhost:4444/ids-step-chart/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Step Chart Component');
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
      document.body.insertAdjacentHTML('beforeend', `<ids-step-chart id="test" class="chart" label="7 of 7 steps completed" color="emerald06" step-number="7" value="7" progress-color="ruby02">
        <ids-alert slot="icon" icon="success"></ids-icon>
      </ids-step-chart>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
