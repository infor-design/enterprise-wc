import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Alert e2e Tests', () => {
  const url = 'http://localhost:4444/ids-alert/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Alert Component');
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
      document.body.insertAdjacentHTML('beforeend', `<ids-alert id="test" icon="warning"></ids-alert>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it('should be able to createElement', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.createElement('ids-alert');
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
        const elem: any = document.createElement('ids-alert');
        elem.icon = 'alert';
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
        const elem:any = document.createElement('ids-alert');
        document.body.appendChild(elem);
        elem.icon = 'alert';
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
        document.body.insertAdjacentHTML('beforeend', '<ids-alert id="test" icon="warning"></ids-alert>');
        const elem:any = document.querySelector('#test');
        elem.icon = 'success';
      });
    } catch (err) {
      hasError = true;
    }

    const value = await page.evaluate('document.querySelector("#test").shadowRoot.querySelector("ids-icon").getAttribute("icon")');
    await expect(value).toEqual('success');
    await expect(hasError).toEqual(false);
  });
});
