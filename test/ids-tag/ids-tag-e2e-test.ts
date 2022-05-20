import countObjects from '../helpers/count-objects';

describe('Ids Tag e2e Tests', () => {
  const url = 'http://localhost:4444/ids-tag/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Tag Component');
    await expect(page.evaluate('document.querySelector("ids-theme-switcher").getAttribute("mode")'))
      .resolves.toMatch('light');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    // @TODO: Remove setting after #669 is fixed
    await (expect(page) as any).toPassAxeTests({ disabledRules: ['color-contrast'] });
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-tag color="red" id="test">test</ids-tag>`);
      document.querySelector('#test')?.remove();

      // For testing - leaving this here for now
      // const onMessage = () => { /* ... */ };
      // window.addEventListener('message', onMessage);
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
