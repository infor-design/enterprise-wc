describe('Ids Message e2e Tests', () => {
  const url = 'http://localhost:4444/ids-message';

  beforeAll(async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Message Component');
  });

  it('should open message on click', async () => {
    await page.evaluate(() => {
      document.querySelector('#message-example-error-trigger').click();
    });
    await page.waitForSelector('#message-example-error', {
      visible: true,
    });
    const textContent = await page.$eval('[slot="title"]', (el) => el.textContent);
    await expect(textContent).toMatch('Lost connection');
  });

  it('should be able to get/set message', async () => {
    await page.evaluate(() => {
      document.querySelector('#message-example-error-trigger').click();
    });
    await page.waitForSelector('#message-example-error', {
      visible: true,
    });
    await expect(await page.$eval('#message-example-error', (el) => {
      el.message = 'test';
      return el.message;
    })).toMatch('test');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await expect(page).toPassAxeTests();
  });
});
