import checkForAxeViolations from '../helpers/check-for-axe-violations';
import countObjects from '../helpers/count-objects';

describe('Ids Message e2e Tests', () => {
  const url = 'http://localhost:4444/ids-message/example.html';

  test('should open message on click', async () => {
    await page.evaluate(() => {
      (document.querySelector('#message-example-error-trigger') as HTMLElement).click();
    });
    await page.waitForSelector('#message-example-error', {
      visible: true,
    });
    const textContent = await page.$eval('[slot="title"]', (el: HTMLElement) => el.textContent);
    await expect(textContent).toMatch('Lost connection');
  });

  test('should be able to get/set message', async () => {
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
});
