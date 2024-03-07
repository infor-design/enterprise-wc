import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCheckboxGroup from '../../src/components/ids-checkbox-group/ids-checkbox-group';

test.describe('IdsCheckboxGroup tests', () => {
  const url = '/ids-checkbox-group/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Checkbox Group Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-checkbox-group');
      const html = await handle?.evaluate((el: IdsCheckboxGroup) => el?.outerHTML);
      await expect(html).toMatchSnapshot('checkbox-group-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-checkbox-group');
      const html = await handle?.evaluate((el: IdsCheckboxGroup) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('checkbox-group-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-checkbox-group-light');
    });
  });

  test.describe('functionality test', () => {
    test('can change label', async ({ page }) => {
      const idsCheckBoxGroup = page.locator('ids-checkbox-group').first();

      const changeLabel = 'Label Test';
      await idsCheckBoxGroup.evaluate((element:IdsCheckboxGroup, label) => { element.label = label; }, changeLabel);
      await expect(idsCheckBoxGroup).toHaveAttribute('label', changeLabel);

      await idsCheckBoxGroup.evaluate((element:IdsCheckboxGroup) => { element.label = ''; });
      await expect(idsCheckBoxGroup).not.toHaveAttribute('label');
    });

    test('can get checkboxes', async ({ page }) => {
      const idsCheckBoxGroup = page.locator('ids-checkbox-group').first();
      const idsCheckBoxes = await idsCheckBoxGroup.evaluate(
        (element: IdsCheckboxGroup) => element.checkboxes
      );
      await expect(idsCheckBoxGroup.locator('ids-checkbox')).toHaveCount(idsCheckBoxes.length);
    });

    // has unexpected output - remove .skip to run the test
    test.skip('can get selected checkboxes', async ({ page }) => {
      const idsCheckBoxGroup = page.locator('ids-checkbox-group').first();
      const idsSelectedCheckBoxes = await idsCheckBoxGroup.evaluate(
        (element: IdsCheckboxGroup) => element.checkboxesSelected
      );
      // Only 2 checkboxes are selected, but component is returning 3
      await expect(idsCheckBoxGroup.locator('ids-checkbox input[checked]')).toHaveCount(idsSelectedCheckBoxes.length);
    });

    // has unexpected output - remove .skip to run the test
    test.skip('can select checkboxes', async ({ page }) => {
      const idsCheckBoxGroup = page.locator('ids-checkbox-group').first();

      await idsCheckBoxGroup.evaluate((element: IdsCheckboxGroup) => { element.value = true; });
      // the first checkbox is selected, but the parent element 'ids-checkbox' checked attribute is still false
      await expect(idsCheckBoxGroup.locator('ids-checkbox[label="Option 1"]')).toHaveAttribute('checked', 'true');

      await idsCheckBoxGroup.evaluate((element: IdsCheckboxGroup) => { element.value = [true, false, false]; });
      await expect(idsCheckBoxGroup.locator('ids-checkbox[label="Option 2"]')).not.toHaveAttribute('checked');
      await expect(idsCheckBoxGroup.locator('ids-checkbox[label="Option 3"]')).not.toHaveAttribute('checked');
    });
  });
});
