import checkForAxeViolations from '../helpers/check-for-axe-violations';
import countObjects from '../helpers/count-objects';

describe('Ids Dropdown e2e Tests', () => {
  const url = 'http://localhost:4444/ids-dropdown/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Dropdown Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await checkForAxeViolations(page, [
      'aria-valid-attr',
      'color-contrast'
    ]);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-dropdown id="test" readonly="true" label="Readonly Dropdown"></ids-dropdown>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
