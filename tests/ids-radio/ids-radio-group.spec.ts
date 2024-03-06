import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsRadio from '../../src/components/ids-radio/ids-radio';
import IdsRadioGroup from '../../src/components/ids-radio/ids-radio-group';
import IdsContainer from '../../src/components/ids-container/ids-container';

test.describe('IdsRadioGroup tests', () => {
  const url = '/ids-radio/example.html';
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
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
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('functional tests', () => {
    let container: any;
    let rg: any;
    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
      });
    });

    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => {
        container = document.createElement('ids-container') as IdsContainer;
        const rb1 = document.createElement('ids-radio') as IdsRadio;
        const rb2 = document.createElement('ids-radio') as IdsRadio;
        const elem = document.createElement('ids-radio-group') as IdsRadioGroup;

        rb1.value = 'Test radio button 1';
        rb2.value = 'Test radio button 2';
        rb1.label = 'Test radio 1';
        rb2.label = 'Test radio 2';
        elem.label = 'Test radio group label';
        elem.appendChild(rb1);
        elem.appendChild(rb2);
        container.appendChild(elem);
        document.body.appendChild(container);
      });
    });

    test('should render as disabled', async ({ page }) => {
      const rgAttr = await page.evaluate(() => {
        rg = document.querySelector<IdsRadioGroup>('ids-radio-group');
        return rg?.getAttribute('disabled');
      });

      await expect(rgAttr).toEqual(null);

      const groupDisabled = await page.evaluate(() => {
        const radioArr = Array.from(document.querySelectorAll('ids-radio'));
        return radioArr.map((radio) => radio.getAttribute('group-disabled'));
      });

      await expect(groupDisabled).toEqual(Array(groupDisabled.length).fill(null));

      let rootEl: any = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
        return Array.from(element.classList);
      });

      const rgDisabled = await page.evaluate(() => {
        const element = rg.shadowRoot.querySelector('.ids-radio-group');
        return element.getAttribute('disabled');
      });

      expect(rootEl).not.toContain('disabled');
      expect(rgDisabled).toEqual(null);

      await page.evaluate(() => {
        rg.disabled = true;
      });

      expect(await page.evaluate(() => rg.getAttribute('disabled'))).toEqual('true');

      rootEl = await page.evaluate(() => {
        rg.shadowRoot.querySelector('.ids-radio-group') as IdsRadioGroup;
      });
    });
  });
});
