import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsTag from '../../src/components/ids-tag/ids-tag';

test.describe('IdsTag tests', () => {
  const url = '/ids-tag/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Tag Component');
    });
  });

  test.describe('page append tests', () => {
    test('should be able to createElement', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-tag');
        elem.id = 'test-tag';
        document.body.appendChild(elem);
      });
      await expect(await page.locator('#test-tag')).toHaveAttribute('id');
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
      const handle = await page.$('ids-tag');
      const html = await handle?.evaluate((el: IdsTag) => el?.outerHTML);
      await expect(html).toMatchSnapshot('tag-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-tag');
      const html = await handle?.evaluate((el: IdsTag) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('tag-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-tag-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should be able set color', async ({ page }) => {
      const locator = await page.locator('ids-tag').first();
      const handle = await page.$('ids-tag');
      await handle?.evaluate((el: IdsTag) => {
        el.color = 'success';
      });
      await expect(await locator.getAttribute('color')).toEqual('success');
      await handle?.evaluate((el: IdsTag) => {
        el.color = '';
      });
      await expect(await locator.getAttribute('color')).toEqual(null);
    });

    test('should set color by attribute', async ({ page }) => {
      const locator = await page.locator('ids-tag').first();
      const handle = await page.$('ids-tag');
      await handle?.evaluate((el: IdsTag) => {
        el.setAttribute('color', 'error');
      });
      await expect(await locator.getAttribute('color')).toEqual('error');
    });

    test('should set color as hex', async ({ page }) => {
      const locator = await page.locator('ids-tag').first();
      const handle = await page.$('ids-tag');
      await handle?.evaluate((el: IdsTag) => {
        el.setAttribute('color', '#800000');
      });
      await expect(await locator.getAttribute('color')).toEqual('#800000');
      const setterValue = await handle?.evaluate((el: IdsTag) => el.color);
      await expect(setterValue).toEqual('#800000');
    });

    test('renders an extra border on secondary tag', async ({ page }) => {
      const locator = await page.locator('ids-tag').first();
      const handle = await page.$('ids-tag');
      await handle?.evaluate((el: IdsTag) => {
        el.color = 'secondary';
      });
      await expect(await locator.getAttribute('color')).toEqual('secondary');
      const setterValue = await handle?.evaluate((el: IdsTag) => el.color);
      await expect(setterValue).toEqual('secondary');
    });

    test('should set disabled', async ({ page }) => {
      const handle = await page.$('ids-tag');
      let result = await handle?.evaluate((el: IdsTag) => {
        el.setAttribute('disabled', 'true');
        return el.disabled;
      });
      await expect(result).toEqual(true);
      result = await handle?.evaluate((el: IdsTag) => {
        el.setAttribute('disabled', 'false');
        return el.disabled;
      });
      await expect(await handle?.getAttribute('disabled')).toEqual(null);
    });

    test('should set dismissible', async ({ page }) => {
      const handle = await page.$('ids-tag');
      const result = await handle?.evaluate((el: IdsTag) => {
        el.setAttribute('dismissible', 'true');
        return el.dismissible;
      });
      await expect(result).toEqual(true);
      await handle?.evaluate((el: IdsTag) => {
        el.setAttribute('dismissible', 'false');
      });
      await expect(await handle?.getAttribute('dismissible')).toEqual(null);
    });

    test('should dismiss on click', async ({ page }) => {
      const handle = await page.$('ids-tag');
      expect(await handle?.evaluate(() => document.querySelectorAll('ids-tag').length)).toEqual(13);
      await handle?.evaluate((el: IdsTag) => {
        el.setAttribute('dismissible', 'true');
      });
      const locator = await page.locator('ids-tag ids-icon[icon="close"]').first();
      await locator.click();
      expect(await handle?.evaluate(() => document.querySelectorAll('ids-tag').length)).toEqual(12);
    });

    test('should dismiss on keyboard', async ({ page }) => {
      expect(await page.evaluate(() => document.querySelectorAll('ids-tag').length)).toEqual(13);
      await page.evaluate(() => {
        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        document.querySelector('ids-tag[dismissible]')?.dispatchEvent(event);
      });
      expect(await page.evaluate(() => document.querySelectorAll('ids-tag').length)).toEqual(12);
    });

    test('should remove the clickable attribute when reset', async ({ page }) => {
      const attr = await page.evaluate(() => {
        const tag = document.querySelector<IdsTag>('ids-tag[clickable]');
        tag!.clickable = false;
        return tag!.getAttribute('clickable');
      });
      expect(await attr).toBeNull();
    });
  });

  test.describe('event tests', () => {
    test('should fire click event on enter', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        const tag = document.querySelector('ids-tag[clickable]');
        tag?.addEventListener('click', () => { calls++; });
        tag?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should veto dismiss in beforetagremove', async ({ page }) => {
      expect(await page.evaluate(() => document.querySelectorAll('ids-tag').length)).toEqual(13);
      await page.evaluate(() => {
        const tag = document.querySelector<IdsTag>('ids-tag[dismissible]');
        tag?.addEventListener('beforetagremove', (e: any) => { e.detail.response(false); });
        tag?.dismiss();
      });
      expect(await page.evaluate(() => document.querySelectorAll('ids-tag').length)).toEqual(13);
    });

    test('should fire tagremove on dismiss', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const tag = document.querySelector<IdsTag>('ids-tag[dismissible]');
        tag?.addEventListener('tagremove', () => { calls++; });
        tag?.dismiss();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should fire aftertagremove on dismiss', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const tag = document.querySelector<IdsTag>('ids-tag[dismissible]');
        tag?.addEventListener('aftertagremove', () => { calls++; });
        tag?.dismiss();
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });

    test('should be clickable when set', async ({ page }) => {
      const noOfCalls = await page.evaluate(() => {
        let calls = 0;
        const tag = document.querySelector<IdsTag>('ids-tag[clickable]');
        tag?.listen('Enter', tag, () => { calls++; });
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        tag?.dispatchEvent(event);
        return calls;
      });
      expect(await noOfCalls).toBe(1);
    });
  });

  test.describe('method tests', () => {
    test('should be able to call dismiss', async ({ page }) => {
      let handle = await page.$('ids-tag[dismissible]:not([disabled])');
      let checkText = await handle?.innerText();
      expect(await checkText?.trim()).toBe('Dismissible Tag 1');

      await handle?.evaluate((el: IdsTag) => el.dismiss());

      handle = await page.$('ids-tag[dismissible]:not([disabled])');
      checkText = await handle?.innerText();
      expect(await checkText?.trim()).toBe('Dismissible Tag 2');
    });

    test('should cancel dismiss when not dismissible', async ({ page }) => {
      expect(await page.evaluate(() => document.querySelectorAll('ids-tag').length)).toEqual(13);
      await page.evaluate(() => {
        document.querySelector<IdsTag>('ids-tag')?.dismiss();
      });
      expect(await page.evaluate(() => document.querySelectorAll('ids-tag').length)).toEqual(13);
    });
  });
});
