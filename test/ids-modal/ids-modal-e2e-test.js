describe('Ids Modal e2e Tests', () => {
  const url = 'http://localhost:4444/ids-modal/visible.html';

  it('should not have errors', async () => {
    await page.goto(url, { waitUntil: 'load' });
    await expect(page.title()).resolves.toMatch('IDS Modal Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: 'load' });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast'] });
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
    const value = await modal.evaluate((el) => el.visible);
    expect(value).toBeFalsy();
  });
});
