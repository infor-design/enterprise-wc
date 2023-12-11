import countObjects from '../helpers/count-objects';

describe('Ids Tag e2e Tests', () => {
  const url = 'http://localhost:4444/ids-loading-indicator/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Loading Indicator');
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-loading-indicator id="test" progress="30"></ids-loading-indicator>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
