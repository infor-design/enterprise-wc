import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsUpload from '../../src/components/ids-upload/ids-upload';

test.describe('IdsUpload tests', () => {
  const url = '/ids-upload/example.html';
  let uploadSingle : any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    uploadSingle = await page.locator('#ids-upload-single');
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Upload Component');
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
      const handle = await page.$('ids-upload');
      const html = await handle?.evaluate((el: IdsUpload) => el?.outerHTML);
      await expect(html).toMatchSnapshot('upload-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-upload');
      const html = await handle?.evaluate((el: IdsUpload) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('upload-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-upload-light');
    });
  });

  test.describe('functionality tests', () => {
    test('renders placeholder', async () => {
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.placeholder = 'Placeholder Text'; upload.template(); });
      await expect(uploadSingle).toHaveAttribute('placeholder', 'Placeholder Text');
      let placeholder = await uploadSingle.evaluate((upload: IdsUpload) => upload.placeholder);
      await expect(placeholder).toEqual('Placeholder Text');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.placeholder = null; });
      await expect(uploadSingle).not.toHaveAttribute('placeholder');
      placeholder = await uploadSingle.evaluate((upload: IdsUpload) => upload.placeholder);
      await expect(placeholder).toEqual(null);
    });

    test('can handle events', async () => {
      const fileInput = uploadSingle.locator('#ids-upload-id');
      const triggeBtn = uploadSingle.locator('ids-trigger-button').first();
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      let isFilePickerOpened = await uploadSingle.evaluate((upload: IdsUpload) => upload.isFilePickerOpened);
      await expect(isFilePickerOpened).toBe(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.value = 'test'; upload.isFilePickerOpened = true; });
      isFilePickerOpened = await uploadSingle.evaluate((upload: IdsUpload) => upload.isFilePickerOpened);
      await expect(isFilePickerOpened).toBe(true);
      await uploadSingle.dispatchEvent('focus', { bubbles: true });
      await fileInput.dispatchEvent('filescancel', { bubbles: true });
      await triggeBtn.dispatchEvent('click', { bubbles: true });
      isFilePickerOpened = await uploadSingle.evaluate((upload: IdsUpload) => upload.isFilePickerOpened);
      await expect(isFilePickerOpened).toBe(true);
      let uploadValue = await uploadSingle.evaluate((upload: IdsUpload) => upload.value);
      await expect(uploadValue).toEqual('test');
      await textInput.dispatchEvent('keydown', { code: 'Backspace' });
      uploadValue = await uploadSingle.evaluate((upload: IdsUpload) => upload.value);
      await expect(uploadValue).toEqual(null);
      await textInput.dispatchEvent('cleared', { bubbles: true });
      uploadValue = await uploadSingle.evaluate((upload: IdsUpload) => upload.value);
      await expect(uploadValue).toEqual(null);
      await textInput.dispatchEvent('change', { bubbles: true });
      await textInput.dispatchEvent('keydown', { code: 'Enter' });
      await textInput.dispatchEvent('keydown', { code: 'ArrowDown' });
      isFilePickerOpened = await uploadSingle.evaluate((upload: IdsUpload) => upload.isFilePickerOpened);
      await expect(isFilePickerOpened).toBe(true);
    });

    test('can drag drop', async () => {
      const fileInput = uploadSingle.locator('#ids-upload-id');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.disabled = true; upload.handleTextInputDragDrop(); });
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.disabled = false; upload.handleTextInputDragDrop(); });
      await expect(fileInput).toHaveCSS('z-index', '-1');
      await fileInput.dispatchEvent('dragenter', { clientX: 0, clientY: 0 });
      await expect(fileInput).toHaveCSS('z-index', '-1');
      await fileInput.dispatchEvent('drop', { clientX: 0, clientY: 1 });
      await expect(fileInput).toHaveCSS('z-index', '-1');
    });

    test('can call template', async () => {
      await uploadSingle.evaluate((upload: IdsUpload) => {
        upload.accept = '.jpg';
        upload.dirtyTracker = true;
        upload.disabled = 'true';
        upload.textEllipsis = 'true'; // changed from noTextEllipsis to textEllipsis coz noTextEllipsis does not exist
        upload.label = 'test';
        upload.multiple = 'true';
        upload.readonly = 'true';
        upload.size = 'sm';
        upload.validate = 'required';
        upload.value = 'test-value';
        upload.colorVariant = 'alternate-formatter';
        upload.fieldHeight = 'lg';
        upload.labelState = 'hidden';
        upload.noMargins = true;
        upload.compact = true;
      });
      const fileInput = uploadSingle.locator('#ids-upload-id');
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      await expect(fileInput).toHaveAttribute('accept', '.jpg');
      await expect(fileInput).toHaveAttribute('multiple', 'multiple');
      await expect(textInput).toHaveAttribute('dirty-tracker', 'true');
      await expect(textInput).toHaveAttribute('disabled', 'true');
      await expect(textInput).toHaveAttribute('text-ellipsis', 'true');
      await expect(textInput).toHaveAttribute('label', 'test');
      await expect(textInput).toHaveAttribute('readonly', 'true');
      await expect(textInput).toHaveAttribute('size', 'sm');
      await expect(textInput).toHaveAttribute('validate', 'required');
      const fileUpload = await uploadSingle.evaluate((upload: IdsUpload) => {
        const value = upload.value;
        const colorVariant = upload.colorVariant;
        const fieldHeight = upload.fieldHeight;
        const labelState = upload.labelState;
        const noMargins = upload.noMargins;
        const compact = upload.compact;
        return {
          value,
          colorVariant,
          fieldHeight,
          labelState,
          noMargins,
          compact
        };
      });
      await expect(fileUpload.value).toEqual('test-value');
      await expect(fileUpload.colorVariant).toEqual('alternate-formatter');
      await expect(fileUpload.labelState).toEqual('hidden');
      await expect(fileUpload.noMargins).toEqual(true);
      await expect(fileUpload.compact).toEqual(true);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.fieldHeight = 'lg'; });
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.fieldHeight = 'lg'; });
      const fieldHeight = await uploadSingle.evaluate((upload: IdsUpload) => upload.fieldHeight);
      await expect(fieldHeight).toEqual('lg');
    });

    test('can set hasAccess', async () => {
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      await expect(textInput).toContainText('');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.value = 'test'; });
      let value = await uploadSingle.evaluate((upload: IdsUpload) => upload.value);
      await expect(value).toBe('test');
      await uploadSingle.evaluate((upload: IdsUpload) => upload.clear());
      value = await uploadSingle.evaluate((upload: IdsUpload) => upload.value);
      await expect(value).toBeNull();
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.value = 'test2'; });
      value = await uploadSingle.evaluate((upload: IdsUpload) => upload.value);
      await expect(value).toBe('test2');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.clear(); upload.disabled = 'true'; });
      value = await uploadSingle.evaluate((upload: IdsUpload) => upload.value);
      await expect(value).toBeNull();
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.open(); });
      let isFilePickerOpened = await uploadSingle.evaluate((upload: IdsUpload) => upload.isFilePickerOpened);
      await expect(isFilePickerOpened).toBe(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.disabled = null as any; upload.open(); });
      isFilePickerOpened = await uploadSingle.evaluate((upload: IdsUpload) => upload.isFilePickerOpened);
      await expect(isFilePickerOpened).toBe(true);
    });

    test('can disable and enable', async () => {
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      await expect(uploadSingle).not.toHaveAttribute('disabled');
      await expect(textInput).toHaveAttribute('readonly', 'true');
      await expect(textInput).not.toHaveAttribute('disabled');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.disabled = true; });
      await expect(uploadSingle).toHaveAttribute('disabled');
      await expect(textInput).not.toHaveAttribute('readonly');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.disabled = false; });
      await expect(uploadSingle).not.toHaveAttribute('disabled');
      await expect(textInput).not.toHaveAttribute('readonly');
    });

    test('renders field as readonly', async () => {
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      await expect(textInput).toHaveAttribute('readonly');
      // let readonlyBackground = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.readonlyBackground);
      let readonlyBackground = await textInput.evaluate((el: any) => el.readonlyBackground);
      await expect(readonlyBackground).toBeTruthy();
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.readonly = false; upload.textInput.readonly = false; });
      readonlyBackground = await textInput.evaluate((el: any) => el.readonlyBackground);
      await expect(readonlyBackground).toBeTruthy();
      await expect(textInput).not.toHaveAttribute('readonly');
      const readOnly = await textInput.evaluate((el: any) => el.readonly);
      await expect(readOnly).toBe(false);
    });

    test('renders as limit types accept', async () => {
      const fileInput = uploadSingle.locator('#ids-upload-id');
      await expect(uploadSingle).not.toHaveAttribute('accept');
      await expect(fileInput).not.toHaveAttribute('accept');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.accept = '.jpg'; });
      await expect(uploadSingle).toHaveAttribute('accept', '.jpg');
      await expect(fileInput).toHaveAttribute('accept', '.jpg');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.accept = null; });
      await expect(uploadSingle).not.toHaveAttribute('accept');
      await expect(fileInput).not.toHaveAttribute('accept');
    });

    test('renders as multiple files', async () => {
      const fileInput = uploadSingle.locator('#ids-upload-id');
      await expect(uploadSingle).not.toHaveAttribute('multiple');
      await expect(fileInput).not.toHaveAttribute('multiple');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.multiple = true; });
      await expect(uploadSingle).toHaveAttribute('multiple', 'true');
      await expect(fileInput).toHaveAttribute('multiple', 'multiple');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.multiple = null as any; });
      await expect(uploadSingle).not.toHaveAttribute('multiple');
      await expect(fileInput).not.toHaveAttribute('multiple');
    });

    test('can set text-ellipsis', async () => {
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      await expect(uploadSingle).not.toHaveAttribute('text-ellipsis');
      await expect(textInput).toHaveAttribute('text-ellipsis');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.textEllipsis = true; });
      await expect(uploadSingle).toHaveAttribute('text-ellipsis', 'true');
      await expect(textInput).toHaveAttribute('text-ellipsis', 'true');
      let textEllipsis = await uploadSingle.evaluate((upload: IdsUpload) => upload.textEllipsis);
      await expect(textEllipsis).toBeTruthy();
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.textEllipsis = false as any; });
      await expect(uploadSingle).toHaveAttribute('text-ellipsis', 'false');
      await expect(textInput).not.toHaveAttribute('text-ellipsis');
      textEllipsis = await uploadSingle.evaluate((upload: IdsUpload) => upload.textEllipsis);
      await expect(textEllipsis).toBeFalsy();
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.textEllipsis = null as any; });
      await expect(uploadSingle).not.toHaveAttribute('text-ellipsis');
      await expect(textInput).toHaveAttribute('text-ellipsis', 'true');
      textEllipsis = await uploadSingle.evaluate((upload: IdsUpload) => upload.textEllipsis);
      await expect(textEllipsis).toBeTruthy();
    });

    test('can render validate', async () => {
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      await expect(uploadSingle).not.toHaveAttribute('validate');
      await expect(textInput).not.toHaveAttribute('validate');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.validate = 'required'; });
      await expect(uploadSingle).toHaveAttribute('validate', 'required');
      await expect(textInput).toHaveAttribute('validate', 'required');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.validate = null; });
      await expect(uploadSingle).not.toHaveAttribute('validate');
      await expect(textInput).not.toHaveAttribute('validate');
    });

    test('can render validation-events', async () => {
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      await expect(uploadSingle).not.toHaveAttribute('validation-events');
      await expect(textInput).toHaveAttribute('validation-events', 'blur change');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.validationEvents = 'blur'; });
      await expect(uploadSingle).toHaveAttribute('validation-events', 'blur');
      await expect(textInput).toHaveAttribute('validation-events', 'blur');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.validationEvents = null; });
      await expect(uploadSingle).not.toHaveAttribute('validation-events');
      await expect(textInput).toHaveAttribute('validation-events', 'blur change');
    });

    test('can render value', async () => {
      await expect(uploadSingle).not.toHaveAttribute('value');
      let value = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.value);
      await expect(value).toBe('');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.textInput.value = 'test'; });
      value = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.value);
      await expect(value).toBe('test');
      await expect(uploadSingle).not.toHaveAttribute('value');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.textInput.value = null; });
      value = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.value);
      await expect(value).toBe('');
      await expect(uploadSingle).not.toHaveAttribute('value');
    });

    test('can render label', async () => {
      await expect(uploadSingle).toHaveAttribute('label', 'Single File');
      let label = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.label);
      await expect(label).toBe('Single File');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.label = 'test'; });
      label = await uploadSingle.evaluate((upload: IdsUpload) => upload.label);
      let textInputlabel = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.label);
      await expect(label).toBe('test');
      await expect(textInputlabel).toBe('test');
      await expect(uploadSingle).toHaveAttribute('label', 'test');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.label = null as any; });
      label = await uploadSingle.evaluate((upload: IdsUpload) => upload.label);
      textInputlabel = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.label);
      await expect(label).toBe('');
      await expect(textInputlabel).toBe('');
      await expect(uploadSingle).not.toHaveAttribute('label');
    });

    test('can set color variant', async () => {
      await expect(uploadSingle).not.toHaveAttribute('color-variant');
      let colorVariant = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.colorVariant);
      await expect(colorVariant).toBeNull();
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.colorVariant = 'alternate-formatter'; });
      await expect(uploadSingle).toHaveAttribute('color-variant', 'alternate-formatter');
      colorVariant = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.colorVariant);
      await expect(colorVariant).toBe('alternate-formatter');
    });

    test('can set label state', async () => {
      await expect(uploadSingle).not.toHaveAttribute('label-state');
      let labelState = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.labelState);
      await expect(labelState).toBeNull();
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.labelState = 'hidden'; });
      await expect(uploadSingle).toHaveAttribute('label-state', 'hidden');
      labelState = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.labelState);
      await expect(labelState).toBe('hidden');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.labelState = null; });
      await expect(uploadSingle).not.toHaveAttribute('label-state');
      labelState = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.labelState);
      await expect(labelState).toBeNull();
    });

    test('can set label required', async () => {
      await expect(uploadSingle).not.toHaveAttribute('label-required');
      let labelRequired = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.labelRequired);
      await expect(labelRequired).toBe(true);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.labelRequired = 'false'; });
      await expect(uploadSingle).toHaveAttribute('label-required', 'false');
      labelRequired = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.labelRequired);
      await expect(labelRequired).toBe(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.labelRequired = null as any; });
      await expect(uploadSingle).toHaveAttribute('label-required', 'true');
      labelRequired = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.labelRequired);
      await expect(labelRequired).toBe(true);
    });

    test('can set no margins', async () => {
      await expect(uploadSingle).not.toHaveAttribute('no-margins');
      let noMargins = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.noMargins);
      await expect(noMargins).toBe(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.noMargins = false; });
      await expect(uploadSingle).toHaveAttribute('no-margins', 'false');
      noMargins = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.noMargins);
      await expect(noMargins).toBe(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.noMargins = null as any; });
      await expect(uploadSingle).not.toHaveAttribute('no-margins');
      noMargins = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.noMargins);
      await expect(noMargins).toBe(false);
    });

    test('can set tabbable', async () => {
      await expect(uploadSingle).not.toHaveAttribute('tabbable');
      let tabbable = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.tabbable);
      await expect(tabbable).toBe(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.tabbable = false; });
      await expect(uploadSingle).toHaveAttribute('tabbable', 'false');
      tabbable = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.tabbable);
      await expect(tabbable).toBe(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.tabbable = null as any; });
      await expect(uploadSingle).not.toHaveAttribute('tabbable');
      tabbable = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.tabbable);
      await expect(tabbable).toBe(false);
    });

    test('can set field-height and compact', async () => {
      await expect(uploadSingle).not.toHaveAttribute('field-height');
      await expect(uploadSingle).not.toHaveAttribute('compact');
      let fieldHeight = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.fieldHeight);
      await expect(fieldHeight).toBe('md');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.fieldHeight = 'lg'; });

      await expect(uploadSingle).toHaveAttribute('field-Height', 'lg');
      await expect(uploadSingle).not.toHaveAttribute('compact');
      fieldHeight = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.fieldHeight);
      await expect(fieldHeight).toBe('lg');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.fieldHeight = null as any; upload.compact = true; });
      await expect(uploadSingle).not.toHaveAttribute('field-Height');
      await expect(uploadSingle).toHaveAttribute('compact', '');
      fieldHeight = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.fieldHeight);
      await expect(fieldHeight).toBe('md');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.compact = null as any; upload.onFieldHeightChange(''); });
      await expect(uploadSingle).not.toHaveAttribute('field-Height');
      await expect(uploadSingle).not.toHaveAttribute('compact');
      fieldHeight = await uploadSingle.evaluate((upload: IdsUpload) => upload.textInput.fieldHeight);
      await expect(fieldHeight).toBe('md');
    });

    test('can render label filetype', async () => {
      const labelDefault = 'Single File, Press Enter to Browse for files';
      await expect(uploadSingle).not.toHaveAttribute('label-filetype');
      const label = await uploadSingle.locator('.label-filetype');
      await expect(label).toHaveText(labelDefault);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.labelFiletype = 'test'; });
      await expect(uploadSingle).toHaveAttribute('label-filetype', 'test');
      await expect(label).toHaveText('test');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.labelFiletype = null; });
      await expect(uploadSingle).not.toHaveAttribute('label-filetype');
      await expect(label).toHaveText(labelDefault);
    });

    test('can render label trigger', async () => {
      const labelDefault = 'trigger button for Single File';
      await expect(uploadSingle).not.toHaveAttribute('trigger-label');
      const label = await uploadSingle.locator('.trigger-label');
      await expect(label).toHaveText(labelDefault);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.triggerLabel = 'test'; });
      await expect(uploadSingle).toHaveAttribute('trigger-label', 'test');
      await expect(label).toHaveText('test');
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.triggerLabel = null; });
      await expect(uploadSingle).not.toHaveAttribute('trigger-label');
      await expect(label).toHaveText(labelDefault);
    });

    test('can setup dirty tracking', async () => {
      const textInput = uploadSingle.locator('ids-trigger-field').first();
      await expect(uploadSingle).not.toHaveAttribute('dirty-tracker');
      await expect(textInput).not.toHaveAttribute('dirty-tracker');
      let dirtyTracker = await uploadSingle.evaluate((upload: IdsUpload) => upload.dirtyTracker);
      await expect(dirtyTracker).toEqual(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.dirtyTracker = true; });
      await expect(uploadSingle).toHaveAttribute('dirty-tracker', 'true');
      await expect(textInput).toHaveAttribute('dirty-tracker', 'true');
      dirtyTracker = await uploadSingle.evaluate((upload: IdsUpload) => upload.dirtyTracker);
      await expect(dirtyTracker).toEqual(true);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.dirtyTracker = false; });
      await expect(uploadSingle).not.toHaveAttribute('dirty-tracker');
      await expect(textInput).not.toHaveAttribute('dirty-tracker');
      dirtyTracker = await uploadSingle.evaluate((upload: IdsUpload) => upload.dirtyTracker);
      await expect(dirtyTracker).toEqual(false);
      await uploadSingle.evaluate((upload: IdsUpload) => { upload.dirtyTracker = null as any; });
      await expect(uploadSingle).not.toHaveAttribute('dirty-tracker');
      await expect(textInput).not.toHaveAttribute('dirty-tracker');
      dirtyTracker = await uploadSingle.evaluate((upload: IdsUpload) => upload.dirtyTracker);
      await expect(dirtyTracker).toEqual(false);
    });

    test('can render upload sizes', async () => {
      const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full', null];
      for await (const size of sizes) {
        await uploadSingle.evaluate((upload: IdsUpload, sze: any) => { upload.size = sze; }, size);
        if (size !== null) {
          const uploadSize = await uploadSingle.evaluate((upload: IdsUpload) => upload.size);
          await expect(uploadSize).toBe(size);
          await expect(uploadSingle).toHaveAttribute('size', size as any);
        } else {
          const uploadSize = await uploadSingle.evaluate((upload: IdsUpload) => upload.size);
          await expect(uploadSize).toBe(size);
          await expect(uploadSingle).not.toHaveAttribute('size');
        }
      }
    });
  });
});
