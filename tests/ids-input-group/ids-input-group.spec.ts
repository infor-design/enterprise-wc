import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsInput from '../../src/components/ids-input/ids-input';
import IdsInputGroup from '../../src/components/ids-input-group/ids-input-group';

test.describe('IdsInputGroup tests', () => {
  const url = '/ids-input-group/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Input Group Component');
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

  test.describe('component methods', () => {
    test('group validation', async ({ page }) => {
      const handle = await page.$('#validation-group-name');

      // Set name to 'John Smith'
      await page.evaluate(() => {
        const firstNameInput = document.querySelector<IdsInput>('ids-input[name="firstname"]');
        const lastNameInput = document.querySelector<IdsInput>('ids-input[name="lastname"]');

        if (firstNameInput && lastNameInput) {
          firstNameInput.value = 'John';
          lastNameInput.value = 'Smith';
        }
      });
      expect(await handle?.evaluate((inputGroup: IdsInputGroup) => inputGroup.isGroupValid())).toEqual(false);

      // Set name to 'Michael Jordan'
      await page.evaluate(() => {
        const firstNameInput = document.querySelector<IdsInput>('ids-input[name="firstname"]');
        const lastNameInput = document.querySelector<IdsInput>('ids-input[name="lastname"]');

        if (firstNameInput && lastNameInput) {
          firstNameInput.value = 'Michael';
          lastNameInput.value = 'Jordan';
        }
      });
      expect(await handle?.evaluate((inputGroup: IdsInputGroup) => inputGroup.isGroupValid())).toEqual(true);
    });
  });
});
