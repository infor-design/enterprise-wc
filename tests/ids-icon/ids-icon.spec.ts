import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import customIconJSON from '../../src/components/ids-icon/demos/custom-icon-data.json';
import type IdsIcon from '../../src/components/ids-icon/ids-icon';

test.describe('IdsIcon tests', () => {
  const url = '/ids-icon/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Icon Component');
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

  test.describe('snapshot tests', () => {
    test('should match the visual snapshot in percy (notification)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-icon/notification-badge.html');
      await percySnapshot(page, 'ids-icon-notification-light');
    });

    test('should match the visual snapshot in percy (status)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('ids-icon/status-color.html');
      await percySnapshot(page, 'ids-icon-status-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should be able to set size setting', async ({ page }) => {
      let size = await page.evaluate(() => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.size = 'small';
        return elem.size;
      });
      expect(await size).toBe('small');
      expect(await page.locator('ids-icon').first().getAttribute('size')).toEqual('small');
      size = await page.evaluate(() => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.size = null;
        return elem.size;
      });
      expect(await size).toBe('normal');
    });

    test('should be able to set icon setting', async ({ page }) => {
      let icon = await page.evaluate(() => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.icon = 'delete';
        return elem.icon;
      });
      expect(await icon).toBe('delete');
      expect(await page.locator('ids-icon').first().getAttribute('icon')).toEqual('delete');
      icon = await page.evaluate(() => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.icon = null;
        return elem.icon;
      });
      expect(await icon).toBe('');
    });

    test('defaults to normal size', async ({ page }) => {
      const template = await page.evaluate(() => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        return elem.template();
      });
      expect(template).toContain('0 0 18 18');
    });

    test('can use empty message icons', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.icon = 'empty-generic';
      });
      expect(await page.locator('ids-icon').first().getAttribute('icon')).toEqual('empty-generic');
    });

    test('will flip some icons in RTL', async ({ page }) => {
      const results = await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLanguage('ar');
        const icon = document.querySelector<IdsIcon>('[icon="previous-page"]')!;
        return [icon.isMirrored('previous-page'), icon.template()];
      });

      expect(await results[0]).toBeTruthy();
      expect(await results[1]).toContain('class="mirrored"');
    });

    test('can be updated with notification badges', async ({ page }) => {
      await page.evaluate(async () => {
        const icon = document.querySelector<IdsIcon>('ids-icon')!;
        icon.icon = 'server';
        icon.badgePosition = 'bottom-right';
        icon.badgeColor = 'error';
      });
      expect(await page.locator('ids-icon').first().getAttribute('badge-position')).toBe('bottom-right');
      expect(await page.locator('ids-icon').first().getAttribute('badge-color')).toBe('error');
    });

    test('can be reset after setting notification badges', async ({ page }) => {
      await page.evaluate(async () => {
        const icon = document.querySelector<IdsIcon>('ids-icon')!;
        icon.icon = 'server';
        icon.badgeColor = 'error';
        icon.badgePosition = 'bottom-right';
        icon.badgeColor = null;
        icon.badgePosition = null;
      });
      expect(await page.locator('ids-icon').first().getAttribute('badge-position')).toBeFalsy();
      expect(await page.locator('ids-icon').first().getAttribute('badge-color')).toBeFalsy();
    });

    test('can add a custom icon sheet', async ({ page }) => {
      expect(customIconJSON).toBeTruthy();
      const results = await page.evaluate(async (json) => {
        window.IdsGlobal.customIconData = json as any;
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.icon = 'custom-airplane';
        return [window.IdsGlobal.customIconData, elem.container?.innerHTML];
      }, customIconJSON);

      // <ids-icon icon="custom-airplane" size="large"></ids-icon>
      expect(results[0]).toBeTruthy();
      expect(results[1]).toContain('m7 16.81-1.57-1 .49-9L.83 3.37s-.51-1.51 1-1.56c1 .63 5.09 3.33 5.09 3.33l7.8-4.33 1.62 1-5.87 5.64 3.36 2.14 2.11-.9 1.31.85-.44.72-1.56 1-.39.63-.19 1.82-.45.73-1.31-.86-.07-2.36L9.45 9.1Z');
    });

    test('can add a custom height, width and viewbox', async ({ page }) => {
      await page.evaluate(async () => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.icon = 'empty-generic';
        elem.viewbox = '0 0 80 80';
        elem.height = '80';
        elem.width = '80';
      });

      expect(await page.locator('ids-icon').first().getAttribute('viewbox')).toBe('0 0 80 80');
      expect(await page.locator('ids-icon').first().getAttribute('height')).toBe('80');
      expect(await page.locator('ids-icon').first().getAttribute('width')).toBe('80');

      await page.evaluate(async () => {
        const elem = document.querySelector<IdsIcon>('ids-icon')!;
        elem.viewbox = '';
        elem.height = '';
        elem.width = '';
      });

      expect(await page.locator('ids-icon').first().getAttribute('viewbox')).toBeFalsy();
      expect(await page.locator('ids-icon').first().getAttribute('height')).toBeFalsy();
      expect(await page.locator('ids-icon').first().getAttribute('width')).toBeFalsy();
    });

    test('can change status color', async ({ page }) => {
      const statusColors = ['error', 'warning', 'caution', 'info', 'success', 'neutral', 'red', 'yellow', 'green', 'blue', 'teal', 'purple', 'white', 'black'];
      const checkStatusColor = async (color: any) => {
        const iconProps = await page.evaluate(async (argColor) => {
          const component = document.querySelector<IdsIcon>('ids-icon')!;
          component!.statusColor = argColor;
          const attr = component.getAttribute('status-color');
          const hasClass = component.container?.classList.contains(`status-color-${argColor}`);
          component.statusColor = null;
          const attrRemoved = component.getAttribute('status-color');
          const hasClassRemoved = component.container?.classList.contains(`status-color-${argColor}`);

          return {
            attr,
            hasClass,
            attrRemoved,
            hasClassRemoved
          };
        }, color);

        expect(iconProps.attr).toBe(color);
        expect(iconProps.hasClass).toBeTruthy();
        expect(iconProps.attrRemoved).toBeNull();
        expect(iconProps.hasClassRemoved).toBeFalsy();
      };

      statusColors.forEach(async (color) => {
        await checkStatusColor(color);
      });
    });
  });
});
