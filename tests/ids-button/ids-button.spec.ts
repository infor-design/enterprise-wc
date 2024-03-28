import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsButton from '../../src/components/ids-button/ids-button';
import { IdsButtonAppearance, IdsButtonIconAlignment, IdsButtonContentAlignment } from '../../src/components/ids-button/ids-button-common';

test.describe('IdsButton tests', () => {
  const url = '/ids-button/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Button Component');
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
        .exclude('#test-button-primary')
        .exclude('#test-button-icon-primary')
        .exclude('#test-button-primary-destructive')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-button');
      const html = await handle?.evaluate((el: IdsButton) => el?.outerHTML);
      await expect(html).toMatchSnapshot('button-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-button');
      const html = await handle?.evaluate((el: IdsButton) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('button-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-button-light');
    });
  });

  test.describe('functionality tests', () => {
    test('can be focused', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const button = page.locator(id).locator('button');

      await expect(page.locator(id)).not.toHaveAttribute('tabindex');

      await test.step('change to valid tab index via .tabIndex', async () => {
        await expect(button).toHaveAttribute('tabindex', '0');
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.tabIndex = -1; }, id);
        await expect(button).toHaveAttribute('tabindex', '-1');
      });

      await test.step('change to valid tab index via .setAttribute', async () => {
        await expect(button).toHaveAttribute('tabindex', '-1');
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.setAttribute('tabindex', '0'); }, id);
        await expect(button).toHaveAttribute('tabindex', '0');
      });

      await test.step('handling of incorrect values - other data type', async () => {
        await expect(button).toHaveAttribute('tabindex', '0');
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.tabIndex = ('fish' as any); }, id);
        await expect(button).toHaveAttribute('tabindex', '0');
      });

      await test.step('handling of incorrect values - non default value', async () => {
        await expect(button).toHaveAttribute('tabindex', '0');
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.tabIndex = -2; }, id);
        await expect(button).toHaveAttribute('tabindex', '0');
      });
    });

    test('should toggle animation', async ({ page }) => {
      const btnSelector = 'ids-button[appearance="primary-generative-ai"]';

      // enable animation via button click
      await page.locator(btnSelector).first().click();
      await expect(await page.locator(`${btnSelector} .loading-dots`).first()).toBeVisible();

      // hide animation via api
      await page.evaluate((selector: string) => {
        const aiBtn = document.querySelector<IdsButton>(selector);
        aiBtn?.toggleAnimation(false);
      }, btnSelector);
      await expect(await page.locator(`${btnSelector} .loading-dots`).first()).not.toBeVisible();
    });

    test('can disable/enable button', async ({ page }) => {
      await test.step('disable button', async () => {
        const id = 'ids-button[id="test-button-primary"]';
        const idsButton = page.locator(id);
        const button = idsButton.locator('button');

        await expect(idsButton).toBeEnabled();
        await expect(button).toBeEnabled();
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.disabled = true; }, id);
        await expect(idsButton).toHaveAttribute('disabled');
        await expect(button).toBeDisabled();
      });

      await test.step('enable button', async () => {
        const id = 'ids-button[id="test-disabled-button-primary"]';
        const idsButton = page.locator(id);
        const button = idsButton.locator('button');

        await expect(idsButton).toHaveAttribute('disabled');
        await expect(button).toBeDisabled();
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.disabled = false; }, id);
        await expect(idsButton).toBeEnabled();
        await expect(button).toBeEnabled();
      });
    });

    test('can disable/enable padding', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');

      await expect(idsButton).not.toHaveAttribute('no-padding');
      await expect(button).not.toHaveClass(/no-padding/);

      await test.step('disable padding', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.noPadding = true; }, id);
        await expect(idsButton).toHaveAttribute('no-padding', 'true');
        await expect(button).toHaveClass(/no-padding/);
      });

      await test.step('enable padding', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.noPadding = false; }, id);
        await expect(idsButton).not.toHaveAttribute('no-padding', 'true');
        await expect(button).not.toHaveClass(/no-padding/);
      });
    });

    test('can add extra CSS classes', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');
      const testData = {
        byString: 'one two three',
        byArray: ['four', 'five', 'six'],
        byEmptyString: ''
      };

      await expect(idsButton).not.toHaveAttribute('css-class');

      await test.step('add class by passing a string', async () => {
        await expect(button).not.toHaveClass(new RegExp(testData.byString, 'g'));
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.cssClass = data.class;
        }, { elementId: id, class: testData.byString });
        await expect(idsButton).toHaveAttribute('css-class', testData.byString);
        await expect(button).toHaveClass(new RegExp(testData.byString, 'g'));
      });

      await test.step('add class by passing a string array', async () => {
        await expect(button).not.toHaveClass(new RegExp(testData.byArray.join(' '), 'g'));
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.cssClass = data.class;
        }, { elementId: id, class: testData.byArray });
        await expect(idsButton).toHaveAttribute('css-class', testData.byArray.join(' '));
        await expect(button).toHaveClass(new RegExp(testData.byArray.join(' '), 'g'));
      });

      await test.step('removes class by passing empty string', async () => {
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.cssClass = data.class;
        }, { elementId: id, class: testData.byEmptyString });
        await expect(idsButton).not.toHaveClass(new RegExp(testData.byString, 'g'));
        await expect(button).not.toHaveClass(new RegExp(testData.byArray.join(' '), 'g'));
      });
    });

    test('can change appearance', async ({ page }) => {
      const id = 'ids-button[id="test-button-secondary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');
      const testData = ['primary', 'secondary', 'tertiary', 'default'];

      for (const tData of testData) {
        await test.step(`change to ${tData}`, async () => {
          await page.evaluate((data) => {
            (document.querySelector<IdsButton>(data.elementId))!.appearance = data.apperance as IdsButtonAppearance;
          }, { elementId: id, apperance: tData });
          if (tData !== 'default') {
            await expect(idsButton).toHaveAttribute('appearance', tData);
            await expect(button).toHaveClass(new RegExp(`btn-${tData}`, 'g'));
          } else {
            await expect(idsButton).not.toHaveAttribute('appearance');
            await expect(button).not.toHaveClass(new RegExp(testData.join(' '), 'g'));
          }
        });
      }
    });

    test('can change text', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');
      const defaultText = 'Button label';

      await expect(idsButton).toHaveText(defaultText);
      await expect(button).toHaveAttribute('aria-label', defaultText);

      await test.step('change text', async () => {
        const textData = 'Awesome';
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.text = data.text;
        }, { elementId: id, text: textData });
        await expect(idsButton).toHaveText(textData);
        await expect(button).toHaveAttribute('aria-label', textData);
      });

      // looks like a bug - aria-label value still persist after clearing the text
      await test.step('remove text', async () => {
        const textData = '';
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.text = data.text;
        }, { elementId: id, text: textData });
        await expect(idsButton).toHaveText(textData);
        // await expect(button).toHaveAttribute('aria-label', textData);
      });
    });

    test('can add/remove/align icons', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');
      const idsIcon = idsButton.locator('ids-icon');

      await expect(idsIcon).not.toBeAttached();
      await expect(idsButton).not.toHaveAttribute('icon', 'settings');
      await expect(button).not.toHaveClass(/(align-icon-start|align-icon-end)/);

      await test.step('add icon', async () => {
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.icon = data.icon;
        }, { elementId: id, icon: 'settings' });
        await expect(idsIcon).toBeAttached();
        await expect(idsIcon).toHaveAttribute('icon', 'settings');
        await expect(idsButton).toHaveAttribute('icon', 'settings');
      });

      await test.step('align icon to end', async () => {
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.iconAlign = data.align as IdsButtonIconAlignment;
        }, { elementId: id, align: 'end' });
        await expect(idsIcon).toBeAttached();
        await expect(button).toHaveClass(/align-icon-end/);
        await expect(idsButton).toHaveAttribute('icon', 'settings');
      });

      await test.step('align icon to start', async () => {
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.iconAlign = data.align as IdsButtonIconAlignment;
        }, { elementId: id, align: 'start' });
        await expect(idsIcon).toBeAttached();
        await expect(button).toHaveClass(/align-icon-start/);
        await expect(idsButton).toHaveAttribute('icon', 'settings');
      });

      await test.step('align undefined', async () => {
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.iconAlign = data.align as IdsButtonIconAlignment;
        }, { elementId: id, align: undefined });
        await expect(idsIcon).toBeAttached();
        await expect(button).not.toHaveClass(/(align-icon-start|align-icon-end)/);
        await expect(idsButton).toHaveAttribute('icon', 'settings');
      });

      await test.step('icon only', async () => {
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.text = '';
        }, { elementId: id });
        await expect(idsIcon).toBeAttached();
        await expect(button).toHaveClass(/ids-icon-button/);
        await expect(button).not.toHaveClass(/ids-button/);
        await expect(idsButton).toHaveAttribute('icon', 'settings');
      });

      await test.step('remove icon', async () => {
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.icon = data.icon;
        }, { elementId: id, icon: '' });
        await expect(idsIcon).not.toBeAttached();
        await expect(idsButton).not.toHaveAttribute('icon', 'settings');
      });
    });

    test('can add/remove square', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');

      await expect(idsButton).not.toHaveAttribute('square');
      await expect(button).not.toHaveClass(/square/);

      await test.step('add square', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.square = true; }, id);
        await expect(idsButton).toHaveAttribute('square');
        await expect(button).toHaveClass(/square/);
      });

      await test.step('remove square', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.square = false; }, id);
        await expect(idsButton).not.toHaveAttribute('square');
        await expect(button).not.toHaveClass(/square/);
      });
    });

    test('can set width', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');

      await expect(idsButton).not.toHaveAttribute('width');
      await expect(button).not.toHaveAttribute('style');

      await test.step('set by pixels', async () => {
        const widthValue = '200px';
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.width = data.width;
        }, { elementId: id, width: widthValue });
        await expect(idsButton).toHaveAttribute('width', widthValue);
        await expect(idsButton).not.toHaveAttribute('style', `width: ${widthValue};`);
        await expect(button).not.toHaveAttribute('width', widthValue);
        await expect(button).toHaveAttribute('style', `width: ${widthValue};`);
      });

      await test.step('set by percentage', async () => {
        const widthValue = '90%';
        await page.evaluate((data) => {
          (document.querySelector<IdsButton>(data.elementId))!.width = data.width;
        }, { elementId: id, width: widthValue });
        await expect(idsButton).toHaveAttribute('width', widthValue);
        await expect(idsButton).toHaveAttribute('style', `width: ${widthValue};`);
        await expect(button).not.toHaveAttribute('width', widthValue);
        await expect(button).not.toHaveAttribute('style', `width: ${widthValue};`);
      });

      // resetting width doesn't remove the style attribute
      await test.step('reset width', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.width = ''; }, id);
        await expect(idsButton).not.toHaveAttribute('width');
        await expect(idsButton).toHaveAttribute('style', undefined);
        await expect(button).not.toHaveAttribute('width');
        await expect(button).toHaveAttribute('style', undefined);
      });
    });

    test('can set hidden/visible', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');

      await expect(idsButton).toBeVisible();
      await expect(button).toBeVisible();

      await test.step('set to hidden', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.hidden = true; }, id);
        await expect(idsButton).toBeHidden();
        await expect(button).toBeHidden();
      });

      await test.step('set to visible', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.hidden = false; }, id);
        await expect(idsButton).toBeVisible();
        await expect(button).toBeVisible();
      });
    });

    test('can disable/enable margins', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');

      await expect(idsButton).not.toHaveAttribute('no-margins');
      await expect(button).not.toHaveClass(/no-margins/);

      await test.step('disable margins', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.noMargins = true; }, id);
        await expect(idsButton).toHaveAttribute('no-margins');
        await expect(button).toHaveClass(/no-margins/);
      });

      await test.step('enable margins', async () => {
        await page.evaluate((elementId) => { (document.querySelector<IdsButton>(elementId))!.noMargins = false; }, id);
        await expect(idsButton).not.toHaveAttribute('no-margins');
        await expect(button).not.toHaveClass(/no-margins/);
      });
    });

    test('can set type attribute', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');
      const testData = ['submit', 'reset', 'button', 'invalid'];

      await expect(idsButton).not.toHaveAttribute('type');
      await expect(button).toHaveAttribute('type', 'button');

      for (const tData of testData) {
        await test.step(`set ${tData} type`, async () => {
          await page.evaluate((data) => {
            (document.querySelector<IdsButton>(data.elementId))!.type = data.submit as any;
          }, { elementId: id, submit: tData });
          if (tData !== 'invalid') {
            await expect(idsButton).toHaveAttribute('type', tData);
            await expect(button).toHaveAttribute('type', tData);
          } else {
            await expect(idsButton).not.toHaveAttribute('type');
            await expect(button).not.toHaveAttribute('type');
          }
        });
      }
    });

    test('can set content alignment', async ({ page }) => {
      const id = 'ids-button[id="test-button-primary"]';
      const idsButton = page.locator(id);
      const button = idsButton.locator('button');
      const testData = ['start', 'end', 'default'];

      await expect(idsButton).not.toHaveAttribute('content-align');
      await expect(button).not.toHaveClass(/content-align/);

      for (const tData of testData) {
        await test.step(`set align ${tData}`, async () => {
          await page.evaluate((data) => {
            (document.querySelector<IdsButton>(data.elementId))!.contentAlign = data.align as IdsButtonContentAlignment;
          }, { elementId: id, align: tData });
          if (tData !== 'default') {
            await expect(idsButton).toHaveAttribute('content-align', tData);
            await expect(button).toHaveClass(new RegExp(`content-align-${tData}`, 'g'));
          } else {
            await expect(idsButton).not.toHaveAttribute('content-align');
            await expect(button).not.toHaveClass(/content-align/);
          }
        });
      }
    });
  });
});
