import countObjects from '../helpers/count-objects';

describe('Ids Menu e2e Tests', () => {
  const url = 'http://localhost:4444/ids-menu/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Menu Component');
  });

  // @TODO: Revisit and figure out accessibility issues
  it.skip('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await (expect(page) as any).toPassAxeTests();
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-menu id="my-menu"></ids-menu>`);
      document.querySelector('#my-menu')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it('should be able to createElement', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.createElement('ids-menu');
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
        const elem: any = document.createElement('ids-menu');
        elem.color = 'error';
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
        const elem: any = document.createElement('ids-menu');
        document.body.appendChild(elem);
        elem.disabled = true;
      });
    } catch (err) {
      hasError = true;
    }
    await expect(hasError).toEqual(false);
  });

  it('should be able to set attributes after insertAdjacentHTML', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', `<ids-menu id="my-menu"></ids-menu>`);
        const elem: any = document.querySelector('#my-menu');
        elem.disabled = true;
      });
    } catch (err) {
      hasError = true;
    }

    const value = await page.evaluate('document.querySelector("#my-menu").container.classList.contains("disabled")');
    await expect(value).toBeTruthy();
    await expect(hasError).toEqual(false);
  });
});
