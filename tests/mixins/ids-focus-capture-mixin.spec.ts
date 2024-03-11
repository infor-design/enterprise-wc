import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsModal from '../../src/components/ids-modal/ids-modal';

test.describe('IdsFocusCaptureMixin tests', () => {
  const url = '/ids-modal/focus.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState();
  });

  test.describe('auto focus tests', () => {
    test('should have auto focus by default', async ({ page }) => {
      const autoFocus = await page.evaluate(() => {
        const modal = document.querySelector<IdsModal>('ids-modal')!;
        return modal?.autoFocus;
      });

      expect(autoFocus).toBeTruthy();
    });

    test('should focus an element based on auto focus setting', async ({ page }) => {
      const ifAnyFocused = async () => {
        const focused = await page.locator('ids-modal').evaluate(
          (modal: any) => modal?.focusableElements?.some((item: any) => {
            const isFocused = item?.matches(':focus') || item?.input?.matches(':focus');
            return isFocused;
          })
        );

        return focused;
      };

      await page.locator('ids-modal').evaluate(async (modal: any) => {
        await modal.show();
      });

      await page.waitForTimeout(300);

      expect(await ifAnyFocused()).toBeTruthy();

      await page.locator('ids-modal').evaluate(async (modal: any) => {
        await modal.hide();
      });

      await page.locator('ids-modal').evaluate(async (modal: any) => {
        modal.autoFocus = false;
        await modal.show();
      });

      await page.waitForTimeout(300);

      expect(await ifAnyFocused()).toBeFalsy();
    });

    test('should not have auto focus when set to false', async ({ page }) => {
      const autoFocus = await page.evaluate(() => {
        const modal = document.querySelector<IdsModal>('ids-modal')!;
        modal.autoFocus = false;
        return modal?.autoFocus;
      });

      expect(autoFocus).toBeFalsy();
    });
  });
});
