import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsInput from '../../src/components/ids-input/ids-input';

test.describe('IdsInput tests', () => {
  const url = '/ids-input/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Input Component');
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

  test.describe('functionality tests', () => {
    test('should be able to set value', async ({ page }) => {
      await expect(await page.locator('#test-input').first().getAttribute('value')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.value = 'test';
      });

      await expect(await page.locator('#test-input').first().getAttribute('value')).toEqual('test');
      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.value = null;
      });

      await expect(await page.locator('#test-input').first().getAttribute('value')).toEqual('');
    });

    test('should be able to set label text', async ({ page }) => {
      await expect(await page.locator('#test-input').first().getAttribute('label')).toEqual('First Name');

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.label = 'test';
      });

      await expect(await page.locator('#test-input').first().getAttribute('label')).toEqual('test');

      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', '<ids-input label="Hello World" id="test-id"></ids-input>');
      });

      await expect(await page.locator('#test-id').first().getAttribute('label')).toEqual('Hello World');

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.label = '';
      });

      await expect(await page.locator('#test-input').first().getAttribute('label')).toEqual(null);
    });

    test('should be able to set label required indicator', async ({ page }) => {
      await expect(await page.locator('#test-input').first().getAttribute('validate')).toEqual(null);
      await expect(await page.locator('#test-input').first().getAttribute('label-required')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.validate = 'required';
      });

      await expect(await page.locator('#test-input').first().getAttribute('validate')).toEqual('required');
      await expect(await page.locator('#test-input').first().getAttribute('label-required')).toEqual(null);

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.labelRequired = false;
      });
      await expect(await page.locator('#test-input').first().getAttribute('validate')).toEqual('required');
      await expect(await page.locator('#test-input').first().getAttribute('label-required')).toEqual('false');

      await page.evaluate(() => {
        const elem = document.querySelector('#test-input') as IdsInput;
        elem.labelRequired = true;
      });
      await expect(await page.locator('#test-input').first().getAttribute('validate')).toEqual('required');
      await expect(await page.locator('#test-input').first().getAttribute('label-required')).toEqual('true');
    });
  });

  test('should fire dirty tracker events', async ({ page }) => {
    const inputDirtyTracker = await page.locator('ids-input#e2e-dirty-tracker-input');

    // test `dirty` event being fired
    const inputDirtyEvent = inputDirtyTracker.evaluate((input: IdsInput) => new Promise((resolve) => {
      input.addEventListener('dirty', (e) => { resolve(e); });
    }));
    await inputDirtyTracker.evaluate((input: IdsInput) => { input.value = '020061'; });
    const dirtyEventFired = await inputDirtyEvent;
    expect(dirtyEventFired).toBeDefined();

    // test `pristine` event being fired
    const inputPrisineEvent = inputDirtyTracker.evaluate((input: IdsInput) => new Promise((resolve) => {
      input.addEventListener('pristine', (e) => { resolve(e); });
    }));
    await inputDirtyTracker.evaluate((input: IdsInput) => { input.value = '02006'; });
    const pristineEventFired = await inputPrisineEvent;
    expect(pristineEventFired).toBeDefined();

    // test `` event being fired
    const inputAfterResetEvent = inputDirtyTracker.evaluate((input: IdsInput) => new Promise((resolve) => {
      input.addEventListener('afterresetdirty', (e) => { resolve(e); });
    }));
    await inputDirtyTracker.evaluate((input: IdsInput) => { input.resetDirtyTracker(); });
    const afterResetEventFired = await inputAfterResetEvent;
    expect(afterResetEventFired).toBeDefined();
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-input');
      const html = await handle?.evaluate((el: IdsInput) => el?.outerHTML);
      await expect(html).toMatchSnapshot('input-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-input');
      const html = await handle?.evaluate((el: IdsInput) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('input-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-input-light');
    });

    test('should match the visual snapshot in percy for sizes', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-input/sizes.html');
      await percySnapshot(page, 'ids-input-sizes-light');
    });
  });

  test.describe('edge case tests', () => {
    test('should still handle required after reattaching', async ({ page }) => {
      await page.goto('/ids-input/reattach.html');
      expect(await page.locator('#input-id-error').count()).toBe(0);
      await page.locator('#reattach').click();
      await page.evaluate(() => {
        document.querySelector<IdsInput>('ids-input')!.value = 'x';
        document.querySelector<IdsInput>('ids-input')!.value = '';
      });
      await expect(await page.locator('#input-id-error')).toBeVisible();
    });
  });
});
