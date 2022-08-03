describe('Ids Hyperlink e2e Tests', () => {
  const url = 'http://localhost:4444/ids-hyperlink/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Hyperlink Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await (expect(page) as any).toPassAxeTests({ disabledRules: ['color-contrast'] });
  });

  it('should be able to createElement', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        document.createElement('ids-hyperlink');
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
        const elem: any = document.createElement('ids-hyperlink');
        elem.href = 'http://www.google.com';
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
        const elem:any = document.createElement('ids-hyperlink');
        document.body.appendChild(elem);
        elem.href = 'http://www.google.com';
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
        document.body.insertAdjacentHTML('beforeend', '<ids-hyperlink id="test" href="http://www.google.com"></ids-hyperlink>');
        const elem:any = document.querySelector('#test');
        elem.href = 'http://www.google2.com';
      });
    } catch (err) {
      hasError = true;
    }

    const value = await page.evaluate('document.querySelector("#test").container.getAttribute("href")');
    await expect(value).toEqual('http://www.google2.com');
    await expect(hasError).toEqual(false);
  });
});
