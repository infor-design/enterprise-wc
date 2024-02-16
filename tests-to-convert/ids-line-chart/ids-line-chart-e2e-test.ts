import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Line Chart e2e Tests', () => {
  const url = 'http://localhost:4444/ids-line-chart/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  test('should not be responsive if not set', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });
    await page.goto('http://localhost:4444/ids-line-chart/example.html', { waitUntil: ['networkidle2', 'load'] });
    const h = await page.evaluate('document.querySelector("ids-line-chart").height');
    const w = await page.evaluate('document.querySelector("ids-line-chart").width');
    expect(h).toBe(500);
    expect(w).toBe(800);
  });

  test('should be responsive', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });
    await page.goto('http://localhost:4444/ids-line-chart/responsive.html', { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    const h = await page.evaluate('document.querySelector("ids-line-chart").height');
    const w = await page.evaluate('document.querySelector("ids-line-chart").width');
    expect(h).toBeLessThan(301);
    expect(w).toBeLessThan(330);
  });

  test('should be responsive even when the container is hidden', async () => {
    await page.evaluate('document.querySelector("ids-container").hidden = true');
    await page.evaluate('document.querySelector("ids-line-chart").animate = false');
    await page.evaluate('document.querySelector("ids-line-chart").width = "inherit"');
    await page.evaluate('document.querySelector("ids-line-chart").height = "inherit"');
    await page.evaluate('document.querySelector("ids-container").style.width = "300px"');
    await page.evaluate('document.querySelector("ids-container").style.height = "600px"');

    const h = await page.evaluate('document.querySelector("ids-line-chart").height');
    const w = await page.evaluate('document.querySelector("ids-line-chart").width');
    expect(h).toBeLessThan(340);
    expect(w).toBeLessThan(330);
  });
});
