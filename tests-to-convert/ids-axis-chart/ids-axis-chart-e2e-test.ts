import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Axis Chart e2e Tests', () => {

  it('should render custom colors', async () => {
    const colorUrl = 'http://localhost:4444/ids-axis-chart/colors.html';
    await page.goto(colorUrl, { waitUntil: ['networkidle2', 'load'] });

    const attr = await page.evaluate(() => {
      const styles = getComputedStyle((document as any).querySelector('ids-axis-chart').shadowRoot.querySelector('.chart-legend .color-1'));
      return styles.getPropertyValue('background-color');
    });
    expect(attr).toEqual('rgb(0, 84, 177)');
  });
});
