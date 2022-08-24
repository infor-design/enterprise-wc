import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Blockgrid e2e Tests', () => {
  const url = 'http://localhost:4444/ids-block-grid/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Block Grid Component');
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
      document.body.insertAdjacentHTML('beforeend', `<ids-block-grid align="center" id="test">
      <ids-block-grid-item>
        <img alt="Placeholder 200x200" />
        <ids-text type="p">consectetur adipisicing elit. Praesentium error, ea earum quod eligendi nobis dolorem,
          cupiditate sint optio quos quae quisquam necessitatibus incidunt.</ids-text>
      </ids-block-grid-item></ids-block-grid>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
