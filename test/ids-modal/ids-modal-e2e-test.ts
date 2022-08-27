import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Modal e2e Tests', () => {
  const url = 'http://localhost:4444/ids-modal/visible.html';

  it('should not have errors', async () => {
    await page.goto(url, { waitUntil: 'load' });
    await expect(page.title()).resolves.toMatch('IDS Modal Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['color-contrast']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should have its "OK" button focused when it opens', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    const modalSelector = '#my-modal[visible]';
    const okBtnSelector = '#modal-close-btn';

    await page.waitForSelector(modalSelector);
    await page.waitForSelector(okBtnSelector);
    await page.evaluate(`document.activeElement`);
    const isEqualNode = await page.evaluate(`document.querySelector("${okBtnSelector}").isEqualNode(document.activeElement);`);
    expect(isEqualNode).toBeTruthy();
  });

  it('will close when the user clicks its overlay', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    const modalSelector = '#my-modal[visible]';
    await page.waitForSelector(modalSelector);

    // Fire a 'click' on the overlay
    await page.evaluate(`document.querySelector("${modalSelector} #modal-close-btn").click()`);

    // Modal should be closed.  Check the visible value
    const modal = await page.waitForSelector('#my-modal:not([visible])');
    const value = await modal.evaluate((el: any) => el.visible);
    expect(value).toBeFalsy();
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-modal id="test" aria-labelledby="my-modal-title">
        <ids-text slot="title" font-size="24" type="h2" id="my-modal-title">Active IDS Modal</ids-text>
        <ids-modal-button slot="buttons" id="modal-close-btn" type="primary">
          <span slot="text">OK</span>
        </ids-modal-button>
      </ids-modal>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
