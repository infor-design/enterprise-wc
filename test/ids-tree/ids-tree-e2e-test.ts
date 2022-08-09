import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Tree e2e Tests', () => {
  const url = 'http://localhost:4444/ids-tree/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Tree Component');
    await expect(page.evaluate('document.querySelector("ids-theme-switcher").getAttribute("mode")'))
      .resolves.toMatch('light');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['aria-required-parent']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);

    await page.evaluate(() => {
      const template = `
        <ids-tree id="test">
          <ids-tree-node id="node0">Test (node0)</ids-tree-node>
          <ids-tree-node id="node1">Test (node1)</ids-tree-node>
        </ids-tree>
      `;
      document.body.insertAdjacentHTML('beforeend', template);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
