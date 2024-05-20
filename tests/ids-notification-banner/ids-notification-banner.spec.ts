import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, Page, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsNotificationBanner from '../../src/components/ids-notification-banner/ids-notification-banner';
import type IdsAlert from '../../src/components/ids-alert/ids-alert';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

test.describe('IdsNotificationBanner tests', () => {
  const url = '/ids-notification-banner/example.html';
  let idsNotifBanner: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    idsNotifBanner = await page.locator('ids-notification-banner').first();
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

    test('dismisses on click', async ({ page }) => {
      await page.locator('#ids-notification-banner-0 ids-button').click();
      const element = await page.locator('ids-notification-banner').all();
      expect(element).toHaveLength(4);
    });

    test('dismisses on keydown (Enter)', async () => {
      const element = idsNotifBanner.evaluate(() => {
        const notificationBanner = document.querySelector('ids-notification-banner');
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        notificationBanner?.dispatchEvent(event);
        return document.querySelectorAll('ids-notification-banner').length;
      });
      expect(await element).toBe(4);
    });

    test('can veto dismiss on beforeNotificationRemove', async ({ page }) => {
      await idsNotifBanner.evaluate((banner: IdsNotificationBanner) => {
        banner.addEventListener('beforeNotificationRemove', ((e: CustomEvent) => {
          e.detail.response(false);
        }) as EventListener);
        banner.dismiss();
      });

      await page.exposeFunction('mockCallback', () => {
        let calls = 0;
        calls++;
        return calls;
      });
      const mockCallback = await idsNotifBanner.evaluate(async (banner: IdsNotificationBanner) => {
        const response = await (window as any).mockCallback();
        banner?.addEventListener('beforeNotificationRemove', () => response);
        banner.dismiss();
        return response;
      });

      expect(await mockCallback).toBe(1);
      const element = await page.locator('ids-notification-banner').all();
      expect(element).toHaveLength(5);
    });

    test('fires beforeNotificationRemove on dismiss', async ({ page }) => {
      await page.exposeFunction('mockCallback', () => {
        let calls = 0;
        calls++;
        return calls;
      });
      const mockCallback = await idsNotifBanner.evaluate(async (banner: IdsNotificationBanner) => {
        const response = await (window as any).mockCallback();
        banner?.addEventListener('beforeNotificationRemove', () => response);
        banner.dismiss();
        return response;
      });
      expect(await mockCallback).toBe(1);
      const element = await page.locator('ids-notification-banner').all();
      expect(element).toHaveLength(4);
    });

    test('fires notificationRemove on dismiss', async ({ page }) => {
      await page.exposeFunction('mockCallback', () => {
        let calls = 0;
        calls++;
        return calls;
      });
      const mockCallback = await idsNotifBanner.evaluate(async (banner: IdsNotificationBanner) => {
        const response = await (window as any).mockCallback();
        banner?.addEventListener('notificationRemove', () => response);
        banner.dismiss();
        return response;
      });
      expect(await mockCallback).toBe(1);
      const element = await page.locator('ids-notification-banner').all();
      expect(element).toHaveLength(4);
    });

    test('fires afterNotificationRemove on dismiss', async ({ page }) => {
      await page.exposeFunction('mockCallback', () => {
        let calls = 0;
        calls++;
        return calls;
      });
      const mockCallback = await idsNotifBanner.evaluate(async (banner: IdsNotificationBanner) => {
        const response = await (window as any).mockCallback();
        banner?.addEventListener('afterNotificationRemove', () => response);
        banner.dismiss();
        return response;
      });
      expect(await mockCallback).toBe(1);
      const element = await page.locator('ids-notification-banner').all();
      expect(element).toHaveLength(4);
    });

    test('can render different icons based on type', async () => {
      const alertIcon = idsNotifBanner.locator('ids-alert');
      await idsNotifBanner.evaluate((banner: IdsNotificationBanner) => { banner.type = 'success'; banner.template(); });
      await expect(alertIcon).toHaveAttribute('icon', 'success');
      const newIcon = await idsNotifBanner.evaluate((banner: IdsNotificationBanner) => {
        const icon = banner.shadowRoot?.querySelector('ids-alert') as IdsAlert;
        banner.type = 'alert';
        banner.template();
        icon.icon = 'alert';
        return icon.icon;
      });
      await expect(newIcon).toEqual('alert');
    });

    test('can render with or without a link', async () => {
      let idsLink;
      idsLink = await idsNotifBanner.evaluate((banner: IdsNotificationBanner) => {
        banner.link = null;
        banner.template();
        return banner.link;
      });
      await expect(idsLink).toEqual(null);
      await expect(idsNotifBanner).not.toHaveAttribute('link');

      idsLink = await idsNotifBanner.evaluate((banner: IdsNotificationBanner) => {
        banner.link = 'https://infor.com';
        banner.linkText = 'Click to view';
        banner.template();
        return {
          link: banner.link,
          linkText: banner.linkText,
        };
      });
      expect(await idsNotifBanner.evaluate((banner: IdsNotificationBanner) => banner.container?.querySelector<IdsHyperlink>('.ids-notification-banner-link ids-hyperlink')?.href)).toBe('https://infor.com');
      expect(await idsLink.link).toEqual('https://infor.com');
      expect(await idsLink.linkText).toEqual('Click to view');
    });

    test('can render default messageText', async () => {
      const messageText = await idsNotifBanner.evaluate((banner: IdsNotificationBanner) => {
        banner.messageText = 'Lorem ipsum dolor set';
        banner.template();
        return banner.messageText;
      });
      await expect(messageText).toEqual('Lorem ipsum dolor set');
      await expect(idsNotifBanner).not.toHaveAttribute('messageText');
    });

    test('can create notification dynamically with add()', async ({ page }) => {
      const objParent = await page.evaluate(() => {
        const banner = document.createElement('ids-notification-banner') as IdsNotificationBanner;
        const notificationObj: any = {
          id: 'ids-notification-banner-5',
          type: 'alert',
          messageText: 'the quick brown fox jumps over five litlle monkeys.',
        };
        banner.add(notificationObj);
        notificationObj.parent = 'notification-container';
        const parentEl = document.createElement('div');
        parentEl.setAttribute('id', notificationObj.parent);
        banner.appendChild(parentEl);
        return notificationObj.parent;
      });
      const parent = await idsNotifBanner.evaluate((banner: IdsNotificationBanner) => banner.querySelector('div')?.getAttribute('id'));
      await expect(parent).toEqual('notification-container');
      await expect(objParent).toEqual('notification-container');

      await page.evaluate(() => {
        const banner2 = document.createElement('ids-notification-banner') as IdsNotificationBanner;
        const notificationObj2: any = {
          type: 'alert',
          parent: 'notification-container',
          messageText: 'DTO accepted by your manager for May 20, 2024.',
          link: 'https://infor.com',
          linkText: 'Learn More'
        };
        banner2.add(notificationObj2);
      });
      const idsNotifBanner2 = await page.locator('#notification-container ids-notification-banner');
      const banner2Props = await idsNotifBanner2.evaluate((banner: IdsNotificationBanner) => ({
        id: banner.id,
        linkText: banner.linkText,
      }));
      await expect(idsNotifBanner2).not.toHaveAttribute('id');
      await expect(banner2Props.id).toBe('');
      await expect(banner2Props.linkText).toEqual('Learn More');

      await page.evaluate(() => {
        const banner3 = document.createElement('ids-notification-banner') as IdsNotificationBanner;
        const idsContainer = document.createElement('ids-container');
        const notificationObj3 = {
          id: 'ids-notification-banner-6',
          type: 'info',
          messageText: 'DTO accepted by your manager for Sept 30, 2023.',
          link: 'https://infor.com',
        };
        document.body.prepend(idsContainer);
        banner3.add(notificationObj3);
      });
      const idsNotifBanner3 = await page.locator('#ids-notification-banner-6');
      const banner3Props = await idsNotifBanner3.evaluate((banner: IdsNotificationBanner) => ({
        id: banner.id,
        messageText: banner.messageText,
      }));
      await expect(idsNotifBanner3).toHaveAttribute('id', 'ids-notification-banner-6');
      await expect(banner3Props.id).toBe('ids-notification-banner-6');
      await expect(banner3Props.messageText).toContain('DTO accepted by your manager for Sept 30, 2023.');
    });
  });
});