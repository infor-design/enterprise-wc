import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsMessage from '../../src/components/ids-message/ids-message';

test.describe('IdsMessage tests', () => {
  const url = '/ids-message/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Message Component');
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
      const handle = await page.$('ids-message');
      const html = await handle?.evaluate((el: IdsMessage) => el?.outerHTML);
      await expect(html).toMatchSnapshot('message-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-message');
      const html = await handle?.evaluate((el: IdsMessage) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('message-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.locator('#message-example-error-trigger').click();
      await percySnapshot(page, 'ids-message-light');
    });
  });

  test.describe('functionality tests', () => {
    let idsMessage: Locator;

    test.beforeEach(async ({ page }) => {
      idsMessage = await page.locator('#message-example-error');
    });

    test('can create component without error', async ({ page, pageErrorsTest }) => {
      await page.evaluate(() => {
        const message = document.createElement('ids-message') as IdsMessage;
        message.id = 'new-message-test';
        message.status = 'info';
        document.querySelector('ids-container')!.appendChild(message);
      });
      expect(pageErrorsTest.hasErrors()).toBeFalsy();
    });

    test('can set/get message', async () => {
      const defText = 'This application has experienced a system error due to the lack of internet access.'
      + ' Please restart the\n        application in order to proceed.';
      const testData = [
        { data: 'Another\n message.', expected: 'Another\n message.' },
        { data: '<svg></svg>', expected: '' },
        { data: null, expected: '' }
      ];

      expect(await idsMessage.evaluate((element: IdsMessage) => element.message)).toEqual(defText);

      for (const data of testData) {
        expect(await idsMessage.evaluate((element: IdsMessage, tData) => {
          element.message = tData as any;
          return element.message;
        }, data.data)).toEqual(data.expected);
      }
    });

    test('can set/get opacity', async () => {
      // data sequence is important
      const testData = [
        { data: '0.1', expected: '0.1' },
        { data: '0.5', expected: '0.5' },
        { data: null, expected: '0.5' },
        { data: '1', expected: '1' }
      ];

      expect(await idsMessage.evaluate((element: IdsMessage) => element.opacity)).toBeUndefined();

      for (const data of testData) {
        expect(await idsMessage.evaluate((element: IdsMessage, tData) => {
          element.opacity = tData as any;
          return element.opacity;
        }, data.data)).toEqual(data.expected);
      }
    });

    test('can set/get status', async () => {
      const defStatus = 'none';
      const testData = [
        { data: 'alert', expected: 'alert' },
        { data: 'invalid', expected: defStatus },
        { data: 'success', expected: 'success' },
        { data: 1, expected: defStatus },
        { data: 'warning', expected: 'warning' },
        { data: null, expected: defStatus },
      ];
      expect(await idsMessage.evaluate((element: IdsMessage) => element.status)).toEqual('error');
      await expect(idsMessage).toHaveAttribute('status', 'error');

      // check getter default
      expect(await idsMessage.evaluate((element: IdsMessage) => {
        element.state.status = null;
        return element.status;
      })).toEqual('default');

      for (const data of testData) {
        const result = await idsMessage.evaluate((element: IdsMessage, tData) => {
          element.status = tData as any;
          return { status: element.status, ariaLabel: element.ariaLabelContent };
        }, data.data);
        expect(result.status).toEqual(data.expected);
        if (data.expected !== 'none') {
          await expect(idsMessage).toHaveAttribute('status', data.expected);
          expect(result.ariaLabel).toContain(data.expected);
        } else {
          await expect(idsMessage).not.toHaveAttribute('status');
          expect(result.ariaLabel).not.toContain(data.expected);
        }
      }
    });

    test('can get buttons', async () => {
      const result = await idsMessage.evaluate((element: IdsMessage) => {
        const butts = element.buttons;
        const ret = {
          nodeNames: [...butts].map((node) => node.nodeName.toLowerCase()),
          buttons: butts
        };
        return ret;
      });
      expect(result.buttons).toBeTruthy();
      expect(result.nodeNames).toEqual(['ids-modal-button', 'ids-modal-button']);
    });

    test('can show/hide message', async () => {
      await expect(idsMessage).not.toHaveAttribute('visible');

      await idsMessage.evaluate(async (element: IdsMessage) => { await element.show(); });
      await expect(idsMessage).toHaveAttribute('visible');

      await idsMessage.evaluate(async (element: IdsMessage) => { await element.hide(); });
      await expect(idsMessage).not.toHaveAttribute('visible');
    });
  });
});
