import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsNotificationBanner from '../../src/components/ids-notification-banner/ids-notification-banner';
import type IdsAlert from '../../src/components/ids-alert/ids-alert';

test.describe('IdsNotificationBanner tests', () => {
  const url = '/ids-notification-banner/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Notification Banner Component');
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
        .disableRules(['page-has-heading-one', 'color-contrast'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-notification-banner');
      const html = await handle?.evaluate((el: IdsNotificationBanner) => el?.outerHTML);
      await expect(html).toMatchSnapshot('notification-banner-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-notification-banner');
      const html = await handle?.evaluate((el: IdsNotificationBanner) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('notification-banner-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-notification-banner-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can change the messageText attribute', async ({ page }) => {
      const locator = await page.locator('ids-notification-banner').first();
      expect(await locator.getAttribute('message-text')).toBe('DTO accepted by your manager for Sept 30, 2023.');
      await page.evaluate(() => {
        (document.querySelector('ids-notification-banner') as IdsNotificationBanner)!.messageText = 'Lorem ipsum dolor set';
      });
      expect(await locator.getAttribute('message-text')).toBe('Lorem ipsum dolor set');
      const attrValue = await page.evaluate(() => (document.querySelector('ids-notification-banner') as IdsNotificationBanner).messageText);
      expect(attrValue).toBe('Lorem ipsum dolor set');
    });

    test('can change the link attribute', async ({ page }) => {
      const locator = await page.locator('ids-notification-banner').first();
      expect(await locator.getAttribute('link')).toBe('https://infor.com');
      await page.evaluate(() => {
        (document.querySelector('ids-notification-banner') as IdsNotificationBanner)!.link = 'https://www.example.com';
      });
      expect(await locator.getAttribute('link')).toBe('https://www.example.com');
      const attrValue = await page.evaluate(() => (document.querySelector('ids-notification-banner') as IdsNotificationBanner).link);
      expect(attrValue).toBe('https://www.example.com');
    });

    test('can change the linkText attribute', async ({ page }) => {
      const locator = await page.locator('ids-notification-banner').first();
      expect(await locator.getAttribute('link-text')).toBe(null);
      await page.evaluate(() => {
        (document.querySelector('ids-notification-banner') as IdsNotificationBanner)!.linkText = 'Test Text';
      });
      expect(await locator.getAttribute('link-text')).toBe('Test Text');
      const attrValue = await page.evaluate(() => (document.querySelector('ids-notification-banner') as IdsNotificationBanner).linkText);
      expect(attrValue).toBe('Test Text');
    });

    test('can change the icon/type attribute', async ({ page }) => {
      const locator = await page.locator('ids-notification-banner').first();
      expect(await locator.getAttribute('type')).toBe('success');
      await page.evaluate(() => {
        (document.querySelector('ids-notification-banner') as IdsNotificationBanner)!.type = 'error';
      });
      expect(await locator.getAttribute('type')).toBe('error');
      const attrValue = await page.evaluate(() => (document.querySelector('ids-notification-banner') as IdsNotificationBanner).type);
      expect(attrValue).toBe('error');
      const iconAttrValue = await page.evaluate(() => (document.querySelector('ids-notification-banner')?.shadowRoot?.querySelector('ids-alert') as IdsAlert).icon);
      expect(iconAttrValue).toBe('error');
    });
  });
});
