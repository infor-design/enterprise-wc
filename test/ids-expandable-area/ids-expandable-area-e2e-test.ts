import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Expandable Area e2e Tests', () => {
  const url = 'http://localhost:4444/ids-expandable-area/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Expandable Area Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });

    const results = await new AxePuppeteer(page).disableRules(['aria-allowed-attr']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-expandable-area id="test">
        <ids-text slot="header">Procurement</ids-text>
        <ids-text slot="pane">
          Ubiquitous out-of-the-box, scalable; communities disintermediate beta-test, enable utilize markets dynamic
          infomediaries virtual data-driven synergistic aggregate infrastructures, "cross-platform, feeds
          bleeding-edge tagclouds." Platforms extend interactive B2C benchmark proactive, embrace e-markets,
          transition generate peer-to-peer.
        </ids-text>
        <ids-hyperlink slot="expander-default" hitbox="true">Show More</ids-hyperlink>
        <ids-hyperlink slot="expander-expanded" hitbox="true">Show Less</ids-hyperlink>
      </ids-expandable-area>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
