import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Calendar e2e Tests', () => {
  const url = 'http://localhost:4444/ids-calendar/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Calendar Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations.length).toBe(0);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-calendar id="test" date="10/22/2019" show-legend show-details></ids-calendar>`);
      document.querySelector('#test')?.remove();
    });
    expect(await countObjects(page)).toEqual(numberOfObjects);
  });

  it.skip('should handle display range dates', async () => {
    const name = 'ids-month-view';
    let toolbar = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('ids-toolbar'));

    expect(toolbar).not.toBeNull();

    await page.evaluate((el: any) => {
      const component = document.querySelector(el);

      component.startDate = '02/04/2021';
      component.endDate = '04/04/2021';
    }, name);

    toolbar = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('ids-toolbar'));

    expect(toolbar).toBeNull();

    // Selectable
    let selected = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected'));

    // Click to tr element within tbody
    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('tbody tr')?.click());

    expect(selected).toBeNull();

    await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td:not(.is-disabled)')?.click());

    // Selectable
    selected = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('td.is-selected'));

    expect(selected).not.toBeNull();
  });
});
