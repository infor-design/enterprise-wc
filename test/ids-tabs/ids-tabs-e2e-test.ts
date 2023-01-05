import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Tabs e2e Tests', () => {
  const url = 'http://localhost:4444/ids-tabs/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Tabs Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['nested-interactive', 'color-contrast']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-tabs id="test">
        <ids-tab value="contracts">Contracts</ids-tab>
        <ids-tab value="opportunities">Opportunities</ids-tab>
        <ids-tab value="attachments" disabled>Attachments</ids-tab>
        <ids-tab value="notes">Notes</ids-tab>
      </ids-tabs>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it('should update via resize observer', async () => {
    await page.evaluate(`document.querySelector("ids-tabs").innerHTML = '<ids-tab value="tab1">Tab 1</ids-tab><ids-tab value="tab2">Tab 2</ids-tab>'`);
    const innerHTML = await page.evaluate('document.querySelector("ids-tabs").innerHTML');
    expect(innerHTML).toEqual(`<ids-tab value="tab1" mode="light" role="tab" aria-selected="false" tabindex="-1" aria-label="Tab 1">Tab 1</ids-tab><ids-tab value="tab2" mode="light" role="tab" aria-selected="true" tabindex="0" aria-label="Tab 2" selected="">Tab 2</ids-tab>`);
  });

  it('can use arrow left/right keys to focus', async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.click('ids-tab');
    await page.focus('ids-tabs');
    let innerHTML = await page.evaluate('document.activeElement.innerHTML');
    await expect(innerHTML).toEqual('Contracts');

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    innerHTML = await page.evaluate('document.activeElement.innerHTML');
    await expect(innerHTML).toEqual('Notes');
  });

  it('can use home/end keys to focus', async () => {
    await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await page.click('ids-tab');
    await page.focus('ids-tabs');
    let innerHTML = await page.evaluate('document.activeElement.innerHTML');
    await expect(innerHTML).toEqual('Contracts');

    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    innerHTML = await page.evaluate('document.activeElement.innerHTML');
    await expect(innerHTML).toEqual('Notes');

    await page.keyboard.press('Home');
    await page.keyboard.press('Enter');
    innerHTML = await page.evaluate('document.activeElement.innerHTML');
    await expect(innerHTML).toEqual('Contracts');
  });
});
