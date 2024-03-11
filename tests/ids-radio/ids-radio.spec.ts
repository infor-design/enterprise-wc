import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsRadio from '../../src/components/ids-radio/ids-radio';
import IdsContainer from '../../src/components/ids-container/ids-container';

test.describe('IdsRadio tests', () => {
  const url = '/ids-radio/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functional tests', () => {
    let rb: any;
    let container: any;

    test.beforeEach(async ({ page }) => page.evaluate(async () => {
      container = document.querySelector<IdsContainer>('ids-container');
      await window.IdsGlobal.locale?.setLanguage('de');
      const elem = document.querySelector<IdsRadio>('ids-radio');
      await container.appendChild(elem);
      await document.body.appendChild(container);
      rb = document.querySelector<IdsRadio>('ids-radio');
    }));

    test('should render as checked', async ({ page }) => {
      await page.evaluate(() => {
        rb.checked = true;
      });

      const isChecked = await page.evaluate(() => rb.checked);
      expect(isChecked).toBeTruthy();
    });

    test('should render as disabled', async ({ page }) => {
      expect(await page.evaluate(() => rb.getAttribute('disabled'))).toEqual(null);
      expect(await page.evaluate(() => rb.input.hasAttribute('disabled'))).toBe(false);

      let rootEl = await page.evaluate(() => {
        const element = rb.shadowRoot.querySelector('.ids-radio') as IdsRadio;
        return Array.from(element.classList);
      });

      expect(rootEl).not.toContain('disabled');

      await page.evaluate(() => {
        rb.disabled = true;
      });

      expect(await page.evaluate(() => rb.getAttribute('disabled'))).toEqual('true');
      expect(await page.evaluate(() => rb.input.hasAttribute('disabled'))).toBe(true);

      rootEl = await page.evaluate(() => {
        const element = rb.shadowRoot.querySelector('.ids-radio') as IdsRadio;
        return Array.from(element.classList);
      });

      expect(rootEl).toContain('disabled');
      expect(await page.evaluate(() => rb.shadowRoot.querySelector('.ids-radio').getAttribute('tabindex'))).toEqual('-1');

      await page.evaluate(() => {
        rb.disabled = false;
      });

      expect(await page.evaluate(() => rb.getAttribute('disabled'))).toEqual(null);
      expect(await page.evaluate(() => rb.input.hasAttribute('disabled'))).toBe(false);

      rootEl = await page.evaluate(() => {
        const element = rb.shadowRoot.querySelector('.ids-radio') as IdsRadio;
        return Array.from(element.classList);
      });

      expect(rootEl).not.toContain('disabled');
    });

    test('should render as grouped disabled', async ({ page }) => {
      expect(await page.evaluate(() => rb.getAttribute('group-disabled'))).toEqual(null);
      expect(await page.evaluate(() => rb.input.hasAttribute('disabled'))).toBe(false);

      let rootEl = await page.evaluate(() => {
        const element = rb.shadowRoot.querySelector('.ids-radio') as IdsRadio;
        return Array.from(element.classList);
      });

      expect(rootEl).not.toContain('disabled');

      await page.evaluate(() => {
        rb.groupDisabled = true;
      });

      expect(await page.evaluate(() => rb.getAttribute('group-disabled'))).toEqual('true');
      expect(await page.evaluate(() => rb.input.hasAttribute('disabled'))).toBe(true);

      rootEl = await page.evaluate(() => {
        const element = rb.shadowRoot.querySelector('.ids-radio') as IdsRadio;
        return Array.from(element.classList);
      });

      expect(rootEl).toContain('disabled');
      expect(await page.evaluate(() => rb.shadowRoot.querySelector('.ids-radio').getAttribute('tabindex'))).toEqual('-1');

      await page.evaluate(() => {
        rb.groupDisabled = false;
      });

      expect(await page.evaluate(() => rb.getAttribute('group-disabled'))).toEqual(null);
      expect(await page.evaluate(() => rb.input.hasAttribute('disabled'))).toBe(false);

      rootEl = await page.evaluate(() => {
        const element = rb.shadowRoot.querySelector('.ids-radio') as IdsRadio;
        return Array.from(element.classList);
      });

      expect(rootEl).not.toContain('disabled');
    });

    test('should render as validation has-error', async ({ page }) => {
      expect(await page.evaluate(() => rb.getAttribute('validation-has-error'))).toEqual(null);
      expect(await page.evaluate(() => rb.input.classList.contains('error'))).toBe(false);
      expect(await page.evaluate(() => rb.validationHasError)).toBe(false);

      await page.evaluate(() => {
        rb.validationHasError = true;
      });

      expect(await page.evaluate(() => rb.getAttribute('validation-has-error'))).toEqual('true');
      expect(await page.evaluate(() => rb.input.classList.contains('error'))).toBe(true);
      expect(await page.evaluate(() => rb.validationHasError)).toBe(true);

      await page.evaluate(() => {
        rb.validationHasError = false;
      });

      expect(await page.evaluate(() => rb.getAttribute('validation-has-error'))).toEqual(null);
      expect(await page.evaluate(() => !rb.input.classList.contains('error'))).toBe(true);
    });

    test('should set the label text', async ({ page }) => {
      const setupTest = async (label: string) => {
        await page.evaluate((labelValue) => {
          const labelElement = (window as any).rb.labelEl.querySelector('.label-text');
          labelElement?.remove();
          document.body.innerHTML = '';
          const html = `<ids-radio label="${labelValue}"></ids-radio>`;
          document.body.innerHTML = html;
          (window as any).rb = document.querySelector('ids-radio');
        }, label);
      };

      // Test 1: should set label text
      await setupTest('test');
      expect(await page.evaluate(() => (window as any).rb.label)).toEqual('test');

      // Test 2: should set null or empty label text
      await setupTest('');
      expect(await page.evaluate(() => (window as any).rb.label)).toEqual('');

      // Test 3: should set "test2" text
      await setupTest('test2');
      expect(await page.evaluate(() => (window as any).rb.label)).toEqual('test2');
    });

    test('should render a value', async ({ page }) => {
      expect(await page.evaluate(() => rb.getAttribute('value'))).toEqual('opt2');
      await page.evaluate(() => {
        rb.value = 'test';
      });
      expect(await page.evaluate(() => rb.getAttribute('value'))).toEqual('test');
      await page.evaluate(() => {
        rb.value = null;
      });
      expect(await page.evaluate(() => rb.getAttribute('value'))).toEqual(null);
    });

    test('should render display horizontally', async ({ page }) => {
      expect(await page.evaluate(() => rb.getAttribute('horizontal'))).toEqual(null);
      expect(await page.evaluate(() => rb.horizontal)).toEqual(false);

      await page.evaluate(() => {
        rb.horizontal = true;
      });

      expect(await page.evaluate(() => rb.getAttribute('horizontal'))).toEqual('true');
      expect(await page.evaluate(() => rb.horizontal)).toEqual(true);

      await page.evaluate(() => {
        rb.horizontal = false;
      });

      expect(await page.evaluate(() => rb.getAttribute('horizontal'))).toEqual(null);
      expect(await page.evaluate(() => rb.horizontal)).toEqual(false);
    });

    test('should render template', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const html = '<ids-radio label="test" value="test-val" disabled="true" horizontal="true" checked="true"></ids-radio>';
        document.body.innerHTML = html;
        rb = document.querySelector<IdsRadio>('ids-radio');
        rb.template();
      });

      expect(await page.evaluate(() => rb.getAttribute('disabled'))).toEqual('true');

      const rootEl = await page.evaluate(() => {
        const element = rb.shadowRoot.querySelector('.ids-radio') as IdsRadio;
        return Array.from(element.classList);
      });
      expect(rootEl).toContain('disabled');
      expect(rootEl).toContain('horizontal');
      expect(await page.evaluate(() => rb.getAttribute('horizontal'))).toEqual('true');
      expect(await page.evaluate(() => rb.getAttribute('checked'))).toEqual('true');
      expect(await page.evaluate(() => rb.checked)).toEqual(true);
    });

    test('can change language from the container', async ({ page }) => {
      await page.evaluate(() => {
        container.language = 'de';
      });
      expect(await page.evaluate(() => rb.getAttribute('language'))).toEqual('de');
    });

    test('can focus its inner input element', async ({ page }) => {
      const focused = await page.evaluate(() => {
        rb.focus();
        return rb.shadowRoot.activeElement === rb.input;
      });
      expect(focused).toBeTruthy();
    });

    test('should trigger native events', async ({ page }) => {
      const eventsToTest = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dblclick'];

      const calls: { [key: string]: number } = {};

      for (const eventName of eventsToTest) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        calls[eventName] = await page.evaluate((event) => {
          let eventCalls = 0;
          rb.addEventListener(event, () => { eventCalls++; });
          const eventObj = new Event(event, { bubbles: true });
          rb.dispatchEvent(eventObj);
          return eventCalls;
        }, eventName);
      }

      // Add assertions for each event
      expect(calls.click).toBe(1);
      expect(calls.dblclick).toBe(1);
      expect(calls.change).toBe(1);
      expect(calls.focus).toBe(1);
      expect(calls.keydown).toBe(1);
      expect(calls.keypress).toBe(1);
      expect(calls.keyup).toBe(1);
    });
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Radio Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      expect(exceptions).toBeNull();
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
      const handle = await page.$('ids-radio');
      const html = await handle?.evaluate((el: IdsRadio) => el?.outerHTML);
      expect(html).toMatchSnapshot('radio-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-radio');
      const html = await handle?.evaluate((el: IdsRadio) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      expect(html).toMatchSnapshot('radio-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-radio-light');
    });
  });
});
