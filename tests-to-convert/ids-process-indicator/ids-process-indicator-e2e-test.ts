import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Process Indicator Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-process-indicator/example.html';
  const emptyLabelExampleUrl = `http://localhost:4444/ids-process-indicator/empty-label.html`;

  test('should show hide details on resize', async () => {
    await page.setViewport({
      width: 375,
      height: 1080
    });

    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.waitForSelector('ids-process-indicator-step [slot="detail"]', {
      visible: false,
    });
    const size = await page.evaluate('document.querySelector("ids-process-indicator-step [slot=\'detail\']").style.width');
    expect(Number(size.replace('px', ''))).toBe(0);
  });

});
