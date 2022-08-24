import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Message e2e Tests', () => {
  const url = 'http://localhost:4444/ids-message/example.html';

  beforeAll(async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Message Component');
  });

  it('should open message on click', async () => {
    await page.evaluate(() => {
      (document.querySelector('#message-example-error-trigger') as HTMLElement).click();
    });
    await page.waitForSelector('#message-example-error', {
      visible: true,
    });
    const textContent = await page.$eval('[slot="title"]', (el: HTMLElement) => el.textContent);
    await expect(textContent).toMatch('Lost connection');
  });

  it('should be able to get/set message', async () => {
    await page.evaluate(() => {
      (document.querySelector('#message-example-error-trigger') as HTMLElement).click();
    });
    await page.waitForSelector('#message-example-error', {
      visible: true,
    });
    await expect(await page.$eval('#message-example-error', (el: any) => {
      el.message = 'test';
      return el.message;
    })).toMatch('test');
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
      document.body.insertAdjacentHTML('beforeend', `<ids-message id="test" status="error">
          <ids-text slot="title" font-size="24" type="h2" id="my-message-title">Lost connection</ids-text>
        </ids-message>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
