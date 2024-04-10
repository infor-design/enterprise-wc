import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Treemap Tests', () => {
  const url = 'http://localhost:4444/ids-treemap/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  test('should resize the width when the viewport changes', async () => {
    await page.setViewport({ width: 589, height: 9999, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(400);
    let treemapWidth = await page.evaluate(`document.querySelector("ids-treemap").width`);
    let containerWidth = await page.evaluate(`document.querySelector("ids-treemap").container.offsetWidth`);
    expect(treemapWidth).toEqual(containerWidth);

    await page.setViewport({ width: 989, height: 9999, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForTimeout(400);
    treemapWidth = await page.evaluate(`document.querySelector("ids-treemap").width`);
    containerWidth = await page.evaluate(`document.querySelector("ids-treemap").container.offsetWidth`);
    expect(treemapWidth).toEqual(containerWidth);
  });
});
