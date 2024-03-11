import checkForAxeViolations from '../helpers/check-for-axe-violations';
import countObjects from '../helpers/count-objects';

describe('Ids Virtual Scroll e2e Tests', () => {
  const url = 'http://localhost:4444/ids-virtual-scroll/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });


  test('should render some rows', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('.ids-data-grid-row');

    const count = (await page.$$('.ids-data-grid-row')).length;
    expect(count).toEqual(30);
  });
});
