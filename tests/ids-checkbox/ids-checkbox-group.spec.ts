import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCheckboxGroup from '../../src/components/ids-checkbox/ids-checkbox-group';

test.describe('IdsCheckboxGroup tests', () => {
  const url = '/ids-checkbox/checkbox-group.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Checkbox Component');
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
      const idsCheckBoxGroup = await page.locator('ids-checkbox-group').first();

      const changeLabel = 'Label Test';
      await idsCheckBoxGroup.evaluate((element:IdsCheckboxGroup, label) => { element.label = label; }, changeLabel);
      await expect(idsCheckBoxGroup).toHaveAttribute('label', changeLabel);

      await idsCheckBoxGroup.evaluate((element:IdsCheckboxGroup) => { element.label = ''; });
      await expect(idsCheckBoxGroup).not.toHaveAttribute('label');
    });

    test('can get checkboxes under the group', async ({ page }) => {
      const idsCheckBoxGroup = await page.locator('ids-checkbox-group').first();
      const idsCheckBoxes = await idsCheckBoxGroup.evaluate(
        (element: IdsCheckboxGroup) => element.checkboxes
      );
      await expect(idsCheckBoxGroup.locator('ids-checkbox')).toHaveCount(idsCheckBoxes.length);
    });

    // has unexpected output - remove .skip to run the test
    test('can get selected checkboxes', async ({ page }) => {
      const idsCheckBoxGroup = await page.locator('ids-checkbox-group').first();
      const idsSelectedCheckBoxes = await idsCheckBoxGroup.evaluate(
        (element: IdsCheckboxGroup) => element.selectedCheckboxes
      );
      expect(idsSelectedCheckBoxes.length).toBe(2);
    });

    // has unexpected output - remove .skip to run the test
    test('can select checkboxes', async ({ page }) => {
      await page.evaluate(() => {
        document.querySelector<IdsCheckboxGroup>('ids-checkbox-group')!.checked = true;
      });

      await page.evaluate(() => {
        document.querySelector<IdsCheckboxGroup>('ids-checkbox-group')!.checked = [true, false, false];
      });

      await expect(await page.locator('ids-checkbox[label="Option 1"]')).toHaveAttribute('checked');
      await expect(await page.locator('ids-checkbox[label="Option 2"]')).not.toHaveAttribute('checked');
      await expect(await page.locator('ids-checkbox[label="Option 3"]')).not.toHaveAttribute('checked');
    });
  });
});
