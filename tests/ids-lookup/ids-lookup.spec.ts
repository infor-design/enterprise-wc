import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsLookup from '../../src/components/ids-lookup/ids-lookup';

test.describe('IdsLookup tests', () => {
  const url = '/ids-lookup/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Lookup Component');
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
        .disableRules(['empty-table-header', 'aria-dialog-name'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-lookup');
      const html = await handle?.evaluate((el: IdsLookup) => el?.outerHTML);
      await expect(html).toMatchSnapshot('lookup-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-lookup');
      const html = await handle?.evaluate((el: IdsLookup) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('lookup-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-lookup-light');
    });

    test('should match the visual snapshot in percy (mobile mode)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      page.setViewportSize({ width: 600, height: 600 });
      await percySnapshot(page, 'ids-lookup-mobile-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should be able to set label', async ({ page }) => {
      const locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('label')).toEqual('Normal Lookup (dirty-tracker)');

      let triggerLabel = await page.evaluate(() => (document.querySelector('ids-lookup') as any)?.triggerField.label);
      expect(triggerLabel).toEqual('Normal Lookup (dirty-tracker)');

      await page.evaluate(() => {
        (document.querySelector('ids-lookup') as any).label = 'Test New Label';
      });
      triggerLabel = await page.evaluate(() => (document.querySelector('ids-lookup') as any)?.triggerField.label);
      expect(triggerLabel).toEqual('Test New Label');
      expect(await locator.getAttribute('label')).toEqual('Test New Label');

      await page.evaluate(() => {
        (document.querySelector('ids-lookup') as any).label = '';
      });
      triggerLabel = await page.evaluate(() => (document.querySelector('ids-lookup') as any)?.triggerField.label);
      expect(triggerLabel).toEqual('');
      expect(await locator.getAttribute('label')).toEqual('');
    });

    test('should be able to set value', async ({ page }) => {
      const fireCount = await page.evaluate(() => {
        let eventCount = 0;
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup?.addEventListener('change', () => { eventCount++; });
        lookup.value = '218901';
        return eventCount;
      });

      const locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('value')).toEqual('218901');
      expect(fireCount).toEqual(1);
    });

    test('should be able to set tabbable with the property', async ({ page }) => {
      const values = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.tabbable = true;
        return [lookup.triggerField?.tabbable, lookup.getAttribute('tabbable')];
      });
      expect(values[0]).toEqual(true);
      expect(values[1]).toEqual('true');

      const values2 = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.tabbable = false;
        return [lookup.triggerField?.tabbable, lookup.getAttribute('tabbable')];
      });

      expect(values2[0]).toEqual(false);
      expect(values2[1]).toEqual('false');

      const values3 = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.triggerField = null;
        lookup.tabbable = false;
        return [lookup.tabbable, lookup.getAttribute('tabbable')];
      });

      expect(values3[0]).toEqual(false);
      expect(values3[1]).toEqual('false');
    });

    test('should be able to set clearable', async ({ page }) => {
      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.value = '102';
      });
      let locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('value')).toEqual('102');

      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        const clearableBtn = lookup?.triggerField?.container?.querySelector('[part="clearable-button"]');
        (clearableBtn as any).click();
      });

      locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('value')).toEqual('');
    });

    test('should open on click and close on the modal buttons', async ({ page }) => {
      let isVisible = await page.evaluate(() => (document.querySelector('ids-lookup') as IdsLookup).modal?.visible);
      expect(isVisible).toBe(false);

      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.triggerButton?.click();
      });

      isVisible = await page.evaluate(() => (document.querySelector('ids-lookup') as IdsLookup).modal?.visible);
      expect(isVisible).toBe(true);

      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.modal?.buttons[0].click();
      });

      isVisible = await page.evaluate(() => (document.querySelector('ids-lookup') as IdsLookup).modal?.visible);
      expect(isVisible).toBe(false);
    });

    test('should open on down arrow', async ({ page }) => {
      let isVisible = await page.evaluate(() => (document.querySelector('ids-lookup') as IdsLookup).modal?.visible);
      expect(isVisible).toBe(false);

      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        lookup.dispatchEvent(event);
      });

      isVisible = await page.evaluate(() => (document.querySelector('ids-lookup') as IdsLookup).modal?.visible);
      expect(isVisible).toBe(true);
    });

    test('should set size', async ({ page }) => {
      let locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('size')).toEqual(null);

      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.size = 'full';
      });

      locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('size')).toEqual('full');

      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.size = '';
      });
      locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('size')).toEqual(null);
    });

    test('should set compact height', async ({ page }) => {
      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.compact = true;
      });
      let locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('compact')).toBe('');

      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.compact = false;
      });
      locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('compact')).toBe(null);
    });

    test('supports setting dirty tracker', async ({ page }) => {
      const values = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        const initial = lookup?.triggerField?.shadowRoot?.querySelector('.icon-dirty');
        lookup.value = '';
        lookup.dirtyTracker = true;
        lookup.value = '100';
        const during = lookup?.triggerField?.shadowRoot?.querySelector('.icon-dirty');
        lookup.value = '';
        lookup.onDirtyTrackerChange(false);
        const after = lookup?.triggerField?.shadowRoot?.querySelector('.icon-dirty');
        return [initial, during, after];
      });
      expect(values[0]).toBeFalsy();
      expect(values[1]).toBeTruthy();
      expect(values[2]).toBeFalsy();
    });

    test('supports setting autocomplete', async ({ page }) => {
      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.autocomplete = true;
      });
      let locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('autocomplete')).toBe('');
      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.autocomplete = false;
      });
      locator = await page.locator('ids-lookup').first();
      expect(await locator.getAttribute('autocomplete')).toBeFalsy();
    });

    test('supports custom modals', async ({ page }) => {
      await page.locator('#lookup-5 ids-trigger-button').first().click();
      expect(await page.locator('#custom-lookup-modal')).toBeVisible();
    });
  });

  test.describe('page append tests', () => {
    test('should be able to set attributes before append', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-lookup');
        elem.id = 'test-tag';
        document.body.appendChild(elem);
      });
      await expect(await page.locator('#test-tag')).toHaveAttribute('id');
    });

    test('should be able to set attributes after append', async ({ page }) => {
      await page.evaluate(() => {
        const elem = document.createElement('ids-lookup');
        document.body.appendChild(elem);
        elem.id = 'test-tag';
      });
      await expect(await page.locator('#test-tag')).toHaveAttribute('id');
    });
  });

  test.describe('event tests', () => {
    test('should fire selectionchanged event', async ({ page }) => {
      const fireCount = await page.evaluate(async () => {
        let eventCount = 0;
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.addEventListener('selectionchanged', () => { eventCount++; });

        lookup!.modal!.visible = true;
        (lookup!.dataGrid!.shadowRoot!.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(8) .ids-data-grid-cell:nth-child(1) span')! as any).click();

        return eventCount;
      });

      expect(await fireCount).toEqual(1);
    });

    test('should be able to select two rows from the modal', async ({ page }) => {
      const results = await page.evaluate(async () => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup)!;
        lookup!.modal!.visible = true;
        (lookup!.dataGrid!.shadowRoot!.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(1) .ids-data-grid-cell:nth-child(1)') as any)!.click();
        (lookup!.dataGrid!.shadowRoot!.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(8) .ids-data-grid-cell:nth-child(1)') as any)!.click();
        return [lookup!.dataGrid!.selectedRows.length, lookup.value];
      });

      expect(results[0]).toEqual(4);
      expect(results[1]).toEqual('102,103');
    });

    test('should be able to set the delimiter', async ({ page }) => {
      expect(await page.locator('ids-lookup').first().getAttribute('delimiter')).toBeFalsy();
      await page.evaluate(async () => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup)!;
        lookup.delimiter = '|';
      });
      expect(await page.locator('ids-lookup').first().getAttribute('delimiter')).toBe('|');
    });

    test('should default the field id', async ({ page }) => {
      expect(await page.locator('ids-lookup').first().getAttribute('field')).toEqual('description');
    });

    test('should set selected rows on init', async ({ page }) => {
      const selectedRows = await page.evaluate(async () => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup)!;
        return lookup!.dataGrid!.selectedRows.length;
      });
      expect(selectedRows).toEqual(2);
    });

    test('can render with validation', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const lookup = (document.querySelector('#lookup-4') as IdsLookup)!;
        return [lookup.validate, lookup.validationEvents];
      });
      expect(values[0]).toEqual('required');
      expect(values[1]).toEqual('change blur');
    });

    test('can reset validation and validation-events', async ({ page }) => {
      const values = await page.evaluate(async () => {
        const lookup = (document.querySelector('#lookup-4') as IdsLookup)!;
        lookup.validate = 'required';
        lookup.validationEvents = 'blur change';
        lookup.validate = null;
        lookup.validationEvents = '';
        return [lookup.validate, lookup.validationEvents];
      });
      expect(values[0]).toBeFalsy();
      expect(values[1]).toBe('change blur');
    });
  });

  test.describe('state tests', () => {
    test('can render as disabled', async ({ page }) => {
      const locator = await page.locator('ids-lookup[disabled]');
      expect(await locator.getAttribute('readonly')).toBe(null);
      expect(await locator.getAttribute('disabled')).toBeTruthy();
    });

    test('should not open on click if readonly / disabled', async ({ page }) => {
      let isVisible = await page.evaluate(() => (document.querySelector('ids-lookup') as IdsLookup).modal?.visible);
      expect(isVisible).toBe(false);
      await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.readonly = true;
        lookup.triggerButton?.click();
      });

      isVisible = await page.evaluate(() => (document.querySelector('ids-lookup') as IdsLookup).modal?.visible);
      expect(isVisible).toBe(false);
    });

    test('can render as readonly', async ({ page }) => {
      const locator = await page.locator('ids-lookup[readonly]');
      expect(await locator.getAttribute('readonly')).toBeTruthy();
      expect(await locator.getAttribute('disabled')).toBe(null);
    });

    test('should be able to set readonly with the property', async ({ page }) => {
      const values = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.readonly = true;
        return [lookup?.triggerField?.readonly, lookup.getAttribute('readonly')];
      });

      expect(values[0]).toEqual(true);
      expect(values[1]).toEqual('true');

      const values2 = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.readonly = false;
        return [lookup?.triggerField?.readonly, lookup.getAttribute('readonly')];
      });

      expect(values2[0]).toEqual(false);
      expect(values2[1]).toEqual(null);
    });

    test('should be able to set readonly with the attribute', async ({ page }) => {
      const values = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.setAttribute('readonly', 'true');
        return [lookup?.triggerField?.readonly, lookup.readonly];
      });

      expect(values[0]).toEqual(true);
      expect(values[1]).toEqual(true);

      const values2 = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.setAttribute('readonly', 'false');
        return [lookup?.triggerField?.readonly, lookup.readonly];
      });

      expect(values2[0]).toEqual(false);
      expect(values2[1]).toEqual(false);

      const values3 = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.setAttribute('readonly', 'true');
        lookup.removeAttribute('readonly');
        return [lookup?.triggerField?.readonly, lookup.readonly];
      });
      expect(values3[0]).toEqual(false);
      expect(values3[1]).toEqual(false);
    });

    test('should be able to set disabled with the property', async ({ page }) => {
      const values = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.disabled = true;
        return [lookup?.triggerField?.disabled, lookup.getAttribute('disabled')];
      });

      expect(values[0]).toEqual(true);
      expect(values[1]).toEqual('true');

      const values2 = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.disabled = false;
        return [lookup?.triggerField?.disabled, lookup.getAttribute('disabled')];
      });

      expect(values2[0]).toEqual(false);
      expect(values2[1]).toEqual(null);
    });

    test('should be able to set disabled with the attribute', async ({ page }) => {
      const values = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.setAttribute('disabled', 'true');
        return [lookup?.triggerField?.disabled, lookup.disabled];
      });

      expect(values[0]).toEqual(true);
      expect(values[1]).toEqual(true);

      const values2 = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.setAttribute('disabled', 'false');
        return [lookup?.triggerField?.disabled, lookup.disabled];
      });

      expect(values2[0]).toEqual(false);
      expect(values2[1]).toEqual(false);

      const values3 = await page.evaluate(() => {
        const lookup = (document.querySelector('ids-lookup') as IdsLookup);
        lookup.setAttribute('disabled', 'true');
        lookup.removeAttribute('disabled');
        return [lookup?.triggerField?.disabled, lookup.disabled];
      });
      expect(values3[0]).toEqual(false);
      expect(values3[1]).toEqual(false);
    });
  });
});
