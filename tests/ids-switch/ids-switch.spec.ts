import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsSwitch from '../../src/components/ids-switch/ids-switch';

test.describe('IdsSwitch tests', () => {
  const url = '/ids-switch/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Switch Component');
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
      const html = await page.evaluate(() => {
        const elem = document.querySelector('ids-switch')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem?.outerHTML;
      });
      await expect(html).toMatchSnapshot('switch-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const html = await page.evaluate(() => {
        const elem = document.querySelector('ids-switch')!;
        elem.shadowRoot?.querySelector('style')?.remove();
        return elem.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('switch-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-switch-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should render checked attribute', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.querySelector<IdsSwitch>('ids-switch')!;
        elem.checked = true;
        return elem.checked;
      });
      await expect(await page.locator('ids-switch').first()).toHaveAttribute('checked');
    });

    test('should render as disabled', async ({ page }) => {
      await expect(await page.locator('ids-switch').first()).not.toHaveAttribute('checked');
      await page.evaluate(() => {
        const elem = document.querySelector<IdsSwitch>('ids-switch')!;
        elem.disabled = true;
        return elem.disabled;
      });
      await expect(await page.locator('ids-switch').first()).toHaveAttribute('disabled');
      await page.evaluate(() => {
        const elem = document.querySelector<IdsSwitch>('ids-switch')!;
        elem.disabled = false;
        return elem.disabled;
      });
      await expect(await page.locator('ids-switch').first()).not.toHaveAttribute('disabled');
    });

    test('should be able set label text', async ({ page }) => {
      const innerValue = await page.evaluate(() => {
        const elem = document.querySelector<IdsSwitch>('ids-switch')!;
        elem.label = 'test';
        return elem.labelEl?.querySelector('.label-text')?.textContent;
      });

      expect(innerValue).toBe('test');

      const innerValue2 = await page.evaluate(() => {
        const elem = document.querySelector<IdsSwitch>('ids-switch')!;
        elem.label = '';
        return elem.labelEl?.querySelector('.label-text')?.textContent;
      });

      expect(innerValue2).toBe('');
    });

    test('should render value', async ({ page }) => {
      let values = await page.evaluate(() => {
        const elem = document.querySelector<IdsSwitch>('ids-switch')!;
        elem.checked = true;
        const before = elem.value;
        elem.value = 'test';
        return [before, elem.value];
      });
      await expect(values[0]).toBe('on');
      await expect(values[1]).toBe('test');

      values = await page.evaluate(() => {
        const elem = document.querySelector<IdsSwitch>('ids-switch')!;
        elem.checked = false;
        const before = elem.value;
        elem.value = 'test';
        return [before, elem.value];
      });
      await expect(values[0]).toBe('');
      await expect(values[1]).toBe('');
    });

    test('should dispatch native events', async ({ page }) => {
      const values = await page.evaluate(() => {
        const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
        const triggered = Array<string>();
        events.forEach((evt: string) => {
          let response = null;
          const el = document.querySelector<IdsSwitch>('ids-switch')!;
          el.addEventListener(evt, () => {
            response = 'triggered';
            triggered.push(response);
          });
          const event = new Event(evt);
          el.input?.dispatchEvent(event);
        });
        return triggered;
      });

      await expect(values[0]).toBe('triggered');
      await expect(values[1]).toBe('triggered');
      await expect(values[2]).toBe('triggered');
      await expect(values[3]).toBe('triggered');
      await expect(values[4]).toBe('triggered');
      await expect(values[5]).toBe('triggered');
    });

    test('can focus its inner Input element', async ({ page }) => {
      const value = await page.evaluate(() => {
        document.querySelector<IdsSwitch>('ids-switch')!.focus();
        return document.activeElement?.shadowRoot?.innerHTML;
      });

      await expect(value).toContain('Allow notifications');
    });

    test('should set/get label position', async ({ page }) => {
      const switchElem = await page.locator('ids-switch').first();
      await expect(switchElem).not.toHaveAttribute('label-position');
      expect(await switchElem.evaluate((elem: IdsSwitch) => elem.labelPosition)).toBe('end');
      await switchElem.evaluate((elem: IdsSwitch) => {
        elem.labelPosition = 'start';
      });
      await expect(switchElem).toHaveAttribute('label-position', 'start');
      expect(await switchElem.evaluate((elem: IdsSwitch) => elem.labelPosition)).toBe('start');
      await switchElem.evaluate((elem: IdsSwitch) => {
        elem.labelPosition = null;
      });
      await expect(switchElem).not.toHaveAttribute('label-position');
      expect(await switchElem.evaluate((elem: IdsSwitch) => elem.labelPosition)).toBe('end');
    });

    test('should set/get size', async ({ page }) => {
      const switchElem = await page.locator('ids-switch').first();
      const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
      const checkSize = async (size: string) => {
        await switchElem.evaluate((elem: any, arg: string) => {
          elem.size = arg;
        }, size);
        expect(await switchElem.getAttribute('size')).toEqual(size);
        expect(await switchElem.evaluate((elem: IdsSwitch) => elem.size)).toEqual(size);
      };

      expect(await switchElem.evaluate((elem: IdsSwitch) => elem.size)).toBeNull();
      expect(await switchElem.getAttribute('size')).toBeNull();

      for (const size of sizes) {
        await checkSize(size);
      }

      await switchElem.evaluate((elem: any) => {
        elem.size = null;
      });
      expect(await switchElem.evaluate((elem: IdsSwitch) => elem.size)).toBeNull();
      expect(await switchElem.getAttribute('size')).toBeNull();
    });
  });
});
