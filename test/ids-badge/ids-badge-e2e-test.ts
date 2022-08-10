import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Badge e2e Tests', () => {
  const url = 'http://localhost:4444/ids-badge/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Badge Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    // @TODO: Remove setting after #669 is fixed
    const results = await new AxePuppeteer(page).disableRules('color-contrast').analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-badge id="test" color="error">1500</ids-badge>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it('should be able to createElement', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.createElement('ids-badge');
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });

  it('should be able to set attributes before append', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        const elem: any = document.createElement('ids-badge');
        elem.color = 'error';
        document.body.appendChild(elem);
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });

  it('should be able to set attributes after append', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        const elem:any = document.createElement('ids-badge');
        document.body.appendChild(elem);
        elem.icon = 'error';
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });

  it('should be able to set attributes after insertAdjacentHTML', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', '<ids-badge id="test" color="error"></ids-badge>');
        const elem:any = document.querySelector('#test');
        elem.color = 'info';
      });
    } catch (err) {
      hasError = true;
    }

    const value = await page.evaluate('document.querySelector("#test").container.getAttribute("color")');
    await expect(value).toEqual('info');
    await expect(hasError).toEqual(false);
  });
});
