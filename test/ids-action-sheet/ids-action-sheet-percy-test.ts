import percySnapshot from '@percy/puppeteer';

describe('Ids Action Sheet Percy Tests', () => {
  const url = 'http://localhost:4444/ids-action-sheet/example.html';

  it('should not have visual regressions when cancel button is not visible', async () => {
    await page.setViewport({ width: 450, height: 800 });
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate(() => {
      (document.querySelector('#icon-button') as any).click();
    });
    await page.waitForSelector('ids-action-sheet[visible]');
    await page.evaluate(() => {
      const idsButton = document.querySelector('ids-action-sheet')?.shadowRoot?.querySelector('ids-button') as HTMLInputElement;
      if (idsButton !== undefined) {
        idsButton.outerText = '';
      }
    });
    await percySnapshot(page, 'ids-action-sheet-example', { widths: [375] });
  });
});
