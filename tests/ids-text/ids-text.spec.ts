import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsText from '../../src/components/ids-text/ids-text';

test.describe('IdsText tests', () => {
  const url = '/ids-text/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Text Component');
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
      const handle = await page.$('ids-text');
      const html = await handle?.evaluate((el: IdsText) => el?.outerHTML);
      await expect(html).toMatchSnapshot('text-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-text');
      const html = await handle?.evaluate((el: IdsText) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('text-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-text-light');
    });
  });

  test.describe('setting/attribute tests', () => {
    test('should set font-size', async ({ page }) => {
      const locator = await page.locator('ids-text').first();
      const handle = await page.$('ids-text');

      // set font size to 24
      await handle?.evaluate((el: IdsText) => { el.fontSize = '24'; });
      await expect(await locator.getAttribute('font-size')).toEqual('24');

      // remove font size setting
      await handle?.evaluate((el: IdsText) => { el.fontSize = null; });
      await expect(await locator.getAttribute('font-size')).toEqual(null);
    });

    test('should set font-weight', async ({ page }) => {
      const locator = await page.locator('ids-text').first();
      const handle = await page.$('ids-text');

      // set to bold
      await handle?.evaluate((el: IdsText) => { el.fontWeight = 'bold'; });
      await expect(await locator.getAttribute('font-weight')).toEqual('bold');

      // set to lighter
      await handle?.evaluate((el: IdsText) => { el.fontWeight = 'lighter'; });
      await expect(await locator.getAttribute('font-weight')).toEqual('lighter');

      // set to semi-bold
      await handle?.evaluate((el: IdsText) => { el.fontWeight = 'semi-bold'; });
      await expect(await locator.getAttribute('font-weight')).toEqual('semi-bold');

      // set to null
      await handle?.evaluate((el: IdsText) => { el.fontWeight = null; });
      await expect(await locator.getAttribute('font-weight')).toEqual(null);
    });

    test('should set overflow', async ({ page }) => {
      const locator = await page.locator('ids-text').first();
      const handle = await page.$('ids-text');

      // set to invalid value
      await handle?.evaluate((el: IdsText) => { el.overflow = 'invalid-value'; });
      await expect(await locator.getAttribute('overflow')).toEqual(null);

      // set to lighter
      await handle?.evaluate((el: IdsText) => { el.overflow = 'ellipsis'; });
      await expect(await locator.getAttribute('overflow')).toEqual('ellipsis');
    });

    test('should set disabled', async ({ page }) => {
      const locator = await page.locator('ids-text').first();
      const handle = await page.$('ids-text');

      // set disabled to true
      await handle?.evaluate(async (el: IdsText) => { el.disabled = true; });
      await expect(await locator.getAttribute('disabled')).toEqual('');

      // set disabled to false
      await handle?.evaluate(async (el: IdsText) => { el.disabled = false; });
      await expect(await locator.getAttribute('disabled')).toEqual(null);
    });

    test('should handle color setting', async ({ page }) => {
      const locator = await page.locator('ids-text').first();
      const handle = await page.$('ids-text');

      // set to color palette
      await handle?.evaluate((el: IdsText) => { el.color = 'neutral-10'; });
      await expect(await locator.getAttribute('color')).toEqual('neutral-10');

      // set to unset
      await handle?.evaluate((el: IdsText) => { el.color = 'unset'; });
      await expect(await locator.getAttribute('color')).toEqual('unset');
    });

    test('should set type', async ({ page }) => {
      const locator = await page.locator('ids-text').first();
      const handle = await page.$('ids-text');

      // set to h1
      const h1Elem = await handle?.evaluate(async (el: IdsText) => {
        el.type = 'h1';
        return el.shadowRoot?.querySelector('h1');
      });
      await expect(await locator.getAttribute('type')).toEqual('h1');
      expect(h1Elem).not.toBeNull();

      // set to label
      const labelElm = await handle?.evaluate((el: IdsText) => {
        el.type = 'label';
        return el.shadowRoot?.querySelector('label');
      });
      await expect(await locator.getAttribute('type')).toEqual('label');
      expect(labelElm).not.toBeNull();
    });

    test('should handle label setting', async ({ page }) => {
      const handle = await page.$('ids-text');
      let hasLabelClass;

      // set label to true
      hasLabelClass = await handle?.evaluate(async (el: IdsText) => {
        el.label = true;
        return el.container?.classList.contains('label');
      });
      expect(hasLabelClass).toBeTruthy();

      // set label to false
      hasLabelClass = await handle?.evaluate(async (el: IdsText) => {
        el.label = false;
        return el.container?.classList.contains('label');
      });
      expect(hasLabelClass).toBeFalsy();
    });

    test('should handle data setting', async ({ page }) => {
      const handle = await page.$('ids-text');
      let hasDataClass;

      // set data to true
      hasDataClass = await handle?.evaluate(async (el: IdsText) => {
        el.data = true;
        return el.container?.classList.contains('data');
      });
      expect(hasDataClass).toBeTruthy();

      // set data to false
      hasDataClass = await handle?.evaluate(async (el: IdsText) => {
        el.data = false;
        return el.container?.classList.contains('data');
      });
      expect(hasDataClass).toBeFalsy();
    });

    test('should handle audible setting', async ({ page }) => {
      const handle = await page.$('ids-text');
      const container = await page.$('ids-container');
      let isAudible;

      // set audible to true
      isAudible = await handle?.evaluate(async (el: IdsText) => {
        el.audible = true;
        return !!el.shadowRoot?.querySelector('.audible');
      });
      expect(isAudible).toBeTruthy();

      // set audible to false
      isAudible = await handle?.evaluate(async (el: IdsText) => {
        el.audible = false;
        return !!el.shadowRoot?.querySelector('.audible');
      });
      expect(isAudible).toBeFalsy();

      // create and append
      isAudible = await container?.evaluate(async (el: HTMLElement) => {
        const template = document.createElement('template');
        template.innerHTML = '<ids-text audible>Hello World, Can you hear me?</ids-text>';
        const textElem = template.content.childNodes[0] as IdsText;
        el.appendChild(textElem);
        return !!textElem?.shadowRoot?.querySelector('.audible');
      });
      expect(isAudible).toBeTruthy();
    });

    test('should handle error setting', async ({ page }) => {
      const handle = await page.$('ids-text');
      let hasError;

      // set error to true
      hasError = await handle?.evaluate(async (el: IdsText) => {
        el.error = true;
        return !!el.shadowRoot?.querySelector('.error');
      });
      expect(hasError).toBeTruthy();

      // set error to false
      hasError = await handle?.evaluate(async (el: IdsText) => {
        el.error = false;
        return !!el.shadowRoot?.querySelector('.error');
      });
      expect(hasError).toBeFalsy();
    });

    test('should render via document.createElement', async ({ page }) => {
      const container = await page.$('ids-container');
      await container?.evaluate(async () => {
        const textElem = document.createElement('ids-text') as IdsText;
        textElem.id = 'text-test';
        textElem.type = 'h1';
        textElem.fontSize = 24;
        textElem.fontWeight = 'bold';
        textElem.textContent = 'Test Text';
        document.body.appendChild(textElem);
      });

      const locator = await page.locator('#text-test').first();
      await expect(await locator?.getAttribute('type')).toEqual('h1');
      await expect(await locator?.getAttribute('font-size')).toEqual('24');
      await expect(await locator?.getAttribute('font-weight')).toEqual('bold');
      const handle = await page.$('#text-test');
      const content = await handle?.evaluate(async (el: IdsText) => el.textContent);
      expect(content).toEqual('Test Text');
    });

    test.skip('should translate text', async ({ page }) => {
      const container = await page.$('ids-container');

      // create text elem
      await container?.evaluate(async (el: HTMLElement) => {
        const text = document.createElement('ids-text') as IdsText;
        text.id = 'text-translate';
        text.setAttribute('translation-key', 'BrowserLanguage');
        text.textContent = 'Browser Language';
        text.translateText = true;
        el.appendChild(text);
      });

      const textHandle = await page.$('#text-translate');

      // set lang to fi
      await textHandle?.evaluate(async () => {
        await window.IdsGlobal.locale?.setLanguage('es');
      });
      const textContent = await textHandle?.evaluate(async (el: IdsText) => el.textContent) || '';
      expect(textContent).toEqual('Idioma del explorador');
    });
  });
});
