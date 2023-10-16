describe('Ids Alert e2e Tests', () => {

  it('should be able to set attributes before append', async () => {
    let hasError = false;
    try {
      await page.evaluate(() => {
        const elem: any = document.createElement('ids-alert');
        elem.icon = 'alert';
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
        const elem:any = document.createElement('ids-alert');
        document.body.appendChild(elem);
        elem.icon = 'alert';
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
        document.body.insertAdjacentHTML('beforeend', '<ids-alert id="test" icon="warning"></ids-alert>');
        const elem:any = document.querySelector('#test');
        elem.icon = 'success';
      });
    } catch (err) {
      hasError = true;
    }

    const value = await page.evaluate('document.querySelector("#test").shadowRoot.querySelector("ids-icon").getAttribute("icon")');
    await expect(value).toEqual('success');
    await expect(hasError).toEqual(false);
  });
});
