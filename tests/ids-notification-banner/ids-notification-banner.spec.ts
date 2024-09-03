import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsNotificationBanner from '../../src/components/ids-notification-banner/ids-notification-banner';
import type IdsAlert from '../../src/components/ids-alert/ids-alert';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

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

    test('should handle link attribute', async ({ page }) => {
      const notificationBanner = await page.locator('ids-notification-banner').first();
      const newLink = 'https://www.example.com';
      expect(await notificationBanner.getAttribute('link')).toBe('https://infor.com');
      await notificationBanner.evaluate((elem: IdsNotificationBanner, arg: string) => {
        elem.link = arg;
      }, newLink);
      expect(await notificationBanner.getAttribute('link')).toBe(newLink);
      expect(await notificationBanner.evaluate((elem: IdsNotificationBanner) => elem.link)).toBe(newLink);
      expect(await notificationBanner.evaluate((elem: IdsNotificationBanner) => elem.container?.querySelector<IdsHyperlink>('.ids-notification-banner-link ids-hyperlink')?.href)).toBe(newLink);
      await notificationBanner.evaluate((elem: IdsNotificationBanner) => {
        elem.link = null;
      });
      expect(await notificationBanner.getAttribute('link')).toBeNull();
      expect(await notificationBanner.evaluate(
        (elem: IdsNotificationBanner) => elem.container?.querySelector<HTMLElement>('.ids-notification-banner-link')?.hasAttribute('hidden')
      )).toBeTruthy();
    });

    test('should handle line clamp setting', async ({ page }) => {
      const notificationBanner = await page.locator('ids-notification-banner').first();
      const lineClampValue = await notificationBanner.evaluate((banner: IdsNotificationBanner) => {
        banner.lineClamp = 2;
        return banner.lineClamp;
      });

      expect(lineClampValue).toEqual(2);
    });

    test('should fire beforeclose event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const banner = document.querySelector<IdsNotificationBanner>('ids-notification-banner');
        banner?.addEventListener('beforeclose', () => { calls++; });
        banner?.dismiss();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire close event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const banner = document.querySelector<IdsNotificationBanner>('ids-notification-banner');
        banner?.addEventListener('close', () => { calls++; });
        banner?.dismiss();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire afterclose event', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const banner = document.querySelector<IdsNotificationBanner>('ids-notification-banner');
        banner?.addEventListener('afterclose', () => { calls++; });
        banner?.dismiss();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });
  });

  test.describe('Notification Banner Service Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-notification-banner/as-service.html');
    });

    test('should be able to show a few messages', async ({ page }) => {
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();

      const count = await page.evaluate(() => document.querySelectorAll('ids-notification-banner').length);
      expect(count).toBe(3);
    });

    test('should be able to check count', async ({ page }) => {
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();

      const count = await page.evaluate(() => (window as any).IdsNotificationBannerService.count);
      expect(count).toBe(3);
    });

    test('should be able to close all', async ({ page }) => {
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();

      await page.evaluate(() => (window as any).IdsNotificationBannerService.dismissAll());
      const count = await page.evaluate(() => document.querySelectorAll('ids-notification-banner').length);
      expect(count).toBe(0);
    });

    test('should be able to close first', async ({ page }) => {
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();

      await page.evaluate(() => (window as any).IdsNotificationBannerService.dismissNewest());
      const count = await page.evaluate(() => document.querySelectorAll('ids-notification-banner').length);
      expect(count).toBe(2);
    });

    test('should be able to close last', async ({ page }) => {
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();
      await page.locator('#show-notification').click();

      await page.evaluate(() => (window as any).IdsNotificationBannerService.dismissOldest());
      const count = await page.evaluate(() => document.querySelectorAll('ids-notification-banner').length);
      expect(count).toBe(2);
    });
  });
});
