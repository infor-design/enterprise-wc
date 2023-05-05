import checkForAxeViolations from '../helpers/check-for-axe-violations';
import countObjects from '../helpers/count-objects';

describe('Ids Virtual Scroll e2e Tests', () => {
  const url = 'http://localhost:4444/ids-virtual-scroll/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Virtual Scroll Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await checkForAxeViolations(page, [
      'scrollable-region-focusable',
    ]);
  });

  it('should render some rows', async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.waitForSelector('.ids-data-grid-row');

    const count = (await page.$$('.ids-data-grid-row')).length;
    expect(count).toEqual(30);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-virtual-scroll height="100vh" id="test" item-height="20" buffer-size="3" item-count="1000">
        <div class="ids-list-view-container">
          <div class="ids-list-view" part="contents">
          </div>
        </div>
      </ids-virtual-scroll>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
