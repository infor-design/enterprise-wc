import checkForAxeViolations from '../helpers/check-for-axe-violations';
import countObjects from '../helpers/count-objects';

describe('Ids Lookup e2e Tests', () => {
  const url = 'http://localhost:4444/ids-lookup/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Lookup Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await checkForAxeViolations(page, [
      'aria-required-children',
      'aria-valid-attr-value',
      'color-contrast',
      'empty-table-header'
    ]);
  });

  it('should be able to createElement', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.createElement('ids-lookup');
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
        const elem: any = document.createElement('ids-lookup');
        elem.id = 'test';
        elem.value = '102,103';
        elem.dirtyTracker = true;
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
        const elem:any = document.createElement('ids-lookup');
        document.body.appendChild(elem);
        elem.id = 'test';
        elem.value = '102,103';
        elem.dirtyTracker = true;
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });
});
