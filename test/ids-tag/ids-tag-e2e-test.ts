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

  it('should be able to createElement', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.createElement('ids-tag');
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
        const elem: any = document.createElement('ids-tag');
        elem.color = 'red';
        elem.clickable = true;
        elem.dismissible = true;
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
        const elem:any = document.createElement('ids-tag');
        document.body.appendChild(elem);
        elem.color = 'red';
        elem.clickable = true;
        elem.dismissible = true;
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });
});
