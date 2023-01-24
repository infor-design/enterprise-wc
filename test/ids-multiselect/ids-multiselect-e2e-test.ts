import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids Multiselect e2e Tests', () => {
  const url = 'http://localhost:4444/ids-multiselect';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Multiselect Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['aria-valid-attr-value', 'aria-required-children']).analyze();
    expect(results.violations.length).toBe(0);
  });

  it.skip('should not have memory leaks', async () => {
    const numberOfObjects = await countObjects(page);
    await page.evaluate(() => {
      document.body.insertAdjacentHTML('beforeend', `<ids-multiselect id="test" label="Multiselect" max="3" dirty-tracker="true">
        <ids-list-box class="selected-options">
          <ids-list-box-option class="multiselect-option" id="nj2" value="nj" tooltip="The State of New Jersey"><ids-checkbox no-margin checked="true" label="New Jersey" class="justify-center"></ids-checkbox></ids-list-box-option>
        </ids-list-box>
        <ids-list-box class="options">
          <ids-list-box-option class="multiselect-option" id="al2" value="al" tooltip="The State of Alabama"><ids-checkbox no-margin label="Alabama" class="justify-center"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option class="multiselect-option" id="ak2" value="ak" tooltip="The State of Alaska"><ids-checkbox no-margin label="Alaska" class="justify-center"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option class="multiselect-option" id="az2" value="az" tooltip="The State of Arizona"><ids-checkbox no-margin label="Arizona" class="justify-center"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option class="multiselect-option" id="ar2" value="ar" tooltip="The State of Arkansas"><ids-checkbox no-margin label="Arkansas" class="justify-center"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option class="multiselect-option" id="ca2" value="ca" tooltip="The State of California"><ids-checkbox no-margin label="California" class="justify-center"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option class="multiselect-option" id="co2" value="co" tooltip="The State of Colorado"><ids-checkbox no-margin label="Colorado" class="justify-center"></ids-checkbox></ids-list-box-option>
        </ids-list-box>
      </ids-multiselect>`);
      document.querySelector('#test')?.remove();
    });

    expect(await countObjects(page)).toEqual(numberOfObjects);
  });
});
