import checkForAxeViolations from '../helpers/check-for-axe-violations';
import countObjects from '../helpers/count-objects';

describe('Ids Modal e2e Tests', () => {
  const url = 'http://localhost:4444/ids-modal/visible.html';

  it.skip('should have its "OK" button focused when it opens', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    const modalSelector = '#my-modal[visible]';
    const okBtnSelector = '#modal-close-btn';

    await page.waitForSelector(modalSelector);
    await page.waitForSelector(okBtnSelector);
    await page.evaluate(`document.activeElement`);
    const isEqualNode = await page.evaluate(`document.querySelector("${okBtnSelector}").isEqualNode(document.activeElement);`);
    expect(isEqualNode).toBeTruthy();
  });

  test('will close when the user clicks its button', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    const modalSelector = '#my-modal[visible]';
    await page.waitForSelector(modalSelector);

    // Fire a 'click' on the button
    await page.evaluate(`document.querySelector("${modalSelector} #modal-close-btn").click()`);

    // Modal should be closed.  Check the visible value
    const modal = await page.waitForSelector('#my-modal:not([visible])');
    const value = await modal.evaluate((el: any) => el.visible);
    expect(value).toBeFalsy();
  });
});
