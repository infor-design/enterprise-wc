import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, Page, expect } from '@playwright/test';
import { test, pasteClipBoard } from '../base-fixture';

import IdsEditor from '../../src/components/ids-editor/ids-editor';
import IdsButton from '../../src/components/ids-button/ids-button';
import IdsMenuButton from '../../src/components/ids-menu-button/ids-menu-button';

test.describe('IdsEditor tests', () => {
  const url = '/ids-editor/example.html';

  // async timeout
  const utilTimer = (ms: number) => new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

  // set selection range to 20 characters of the second paragraph in example.html
  const selectEditorText = async (page: Page) => {
    await page.evaluate(async () => {
      const editor = document.querySelector('ids-editor')!;
      const paragraph = editor.querySelector('p:last-child')!;
      const selection = document.getSelection();
      const range = document.createRange();

      range.setStart(paragraph.childNodes[0], 0);
      range.setEnd(paragraph.childNodes[0], 20);
      selection?.removeAllRanges();
      selection?.addRange(range);
    });

    // account for 400ms needed for editor to cache selection
    await utilTimer(500);
  };

  // click action button
  const clickActionButton = async (page: Page, btnSelector: string) => {
    await page.evaluate((selector) => {
      document.querySelector<IdsButton>(`ids-editor ${selector}`)?.click();
    }, btnSelector);
  };

  // queries for element existence in ids-editor
  const containsElement = async (page: Page, tagName: string): Promise<boolean> => {
    const bool = await page.evaluate((selector) => {
      const editor = document.querySelector('ids-editor')!;
      return editor.querySelectorAll(selector).length > 0;
    }, tagName);

    return bool;
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Editor Component');
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
        .disableRules('nested-interactive')
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-editor');
      const html = await handle?.evaluate((el: IdsEditor) => el?.outerHTML);
      await expect(html).toMatchSnapshot('editor-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-editor');
      const html = await handle?.evaluate((el: IdsEditor) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('editor-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-editor-light');
    });
  });

  test.describe('IdsEditor actions', () => {
    test.beforeEach(async ({ page }) => {
      await selectEditorText(page);
    });

    test('applying formatblock action', async ({ page }) => {
      await page.evaluate(() => {
        const editor = document.querySelector('ids-editor')!;
        const menuBtn = editor.querySelector<IdsMenuButton>('ids-menu-button[editor-action="formatblock"]')!;
        menuBtn.value = 'h1';
      });
      expect(await containsElement(page, 'h1')).toEqual(true);
    });

    test('applying bold action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="bold"]');
      expect(await containsElement(page, 'b')).toEqual(true);
    });

    test('applying italic action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="italic"]');
      expect(await containsElement(page, 'i')).toEqual(true);
    });

    test('applying underline action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="underline"]');
      expect(await containsElement(page, 'u')).toEqual(true);
    });

    test('applying strikethrough action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="strikethrough"]');
      expect(await containsElement(page, 'strike')).toEqual(true);
    });

    test('applying blockquote action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="blockquote"]');
      expect(await containsElement(page, 'blockquote')).toEqual(true);
    });

    test('applying orderedlist action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="orderedlist"]');
      expect(await containsElement(page, 'ol')).toEqual(true);
    });

    test('applying unorderedlist action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="unorderedlist"]');
      expect(await containsElement(page, 'ul')).toEqual(true);
    });

    test('applying aligncenter action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="aligncenter"]');
      const textAlign = await page.evaluate(() => {
        const editor = document.querySelector<IdsEditor>('ids-editor')!;
        const secondParagraph = editor.querySelector<HTMLElement>('p:last-child')!;
        return secondParagraph.style.textAlign;
      });
      expect(textAlign).toEqual('center');
    });

    test('applying alignright action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="alignright"]');
      const textAlign = await page.evaluate(() => {
        const editor = document.querySelector<IdsEditor>('ids-editor')!;
        const secondParagraph = editor.querySelector<HTMLElement>('p:last-child')!;
        return secondParagraph.style.textAlign;
      });
      expect(textAlign).toEqual('right');
    });
  });

  test.describe('functionality tests', async () => {
    let idsEditor: Locator;

    test.beforeEach(async ({ page }) => {
      idsEditor = await page.locator('#editor-demo');
    });

    test('can get value', async () => {
      expect(await idsEditor.evaluate((element: IdsEditor) => element.value)).toBeTruthy();
    });

    test('can set/get disabled', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];
      const container = await idsEditor.locator('div.ids-editor').first();
      const textarea = await idsEditor.locator('#source-textarea').first();
      const label = await idsEditor.locator('#editor-label').first();
      const contentEditable = await idsEditor.locator('#editor-container').first();
      const editorLinks = await contentEditable.locator('a').all();

      expect(await idsEditor.evaluate((element: IdsEditor) => element.disabled)).toBeFalsy();
      await expect(idsEditor).not.toHaveAttribute('disabled');
      await expect(container).not.toHaveAttribute('disabled');
      await expect(textarea).not.toHaveAttribute('disabled');
      await expect(label).not.toHaveAttribute('disabled');
      await expect(contentEditable).toHaveAttribute('contenteditable', 'true');
      for (const link of editorLinks) await expect(link).not.toHaveAttribute('tabIndex');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.disabled = tData as any;
          return element.disabled;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsEditor).toHaveAttribute('disabled');
          await expect(container).toHaveAttribute('disabled');
          await expect(textarea).toHaveAttribute('disabled');
          await expect(label).toHaveAttribute('disabled');
          await expect(contentEditable).toHaveAttribute('contenteditable', 'false');
          for (const link of editorLinks) await expect(link).toHaveAttribute('tabIndex', '-1');
        } else {
          await expect(idsEditor).not.toHaveAttribute('disabled');
          await expect(container).not.toHaveAttribute('disabled');
          await expect(textarea).not.toHaveAttribute('disabled');
          await expect(label).not.toHaveAttribute('disabled');
          await expect(contentEditable).toHaveAttribute('contenteditable', 'true');
          for (const link of editorLinks) await expect(link).not.toHaveAttribute('tabIndex');
        }
      }
    });

    test('can set/get label', async () => {
      const defLabel = 'Ids Editor';
      const testData = [
        { data: 'Test', expected: 'Test' },
        { data: '<a>Test</a>', expected: 'Test' },
        { data: '<svg>', expected: '' },
        { data: null, expected: '' }
      ];

      expect(await idsEditor.evaluate((element: IdsEditor) => element.label)).toEqual(defLabel);
      await expect(idsEditor).toHaveAttribute('label', defLabel);

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.label = tData as any;
          return element.label;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsEditor).toHaveAttribute('label', data.expected);
        } else {
          await expect(idsEditor).not.toHaveAttribute('label');
        }
      }
    });

    test('can set/get labelState', async () => {
      const testData = [
        { data: 'hidden', expected: 'hidden' },
        { data: 'test', expected: null },
        { data: 'collapsed', expected: 'collapsed' },
        { data: null, expected: null },
        { data: '', expected: null }
      ];
      expect(await idsEditor.evaluate((element: IdsEditor) => element.labelState)).toBeNull();
      await expect(idsEditor).not.toHaveAttribute('label-state');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.labelState = tData as any;
          return element.labelState;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsEditor).toHaveAttribute('label-state', data.expected);
        } else {
          await expect(idsEditor).not.toHaveAttribute('label-state');
        }
      }
    });

    test('can set/get labeRequired', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: true }
      ];

      expect(await idsEditor.evaluate((element: IdsEditor) => element.labelRequired)).toBeTruthy();
      await expect(idsEditor).not.toHaveAttribute('label-required');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.labelRequired = tData;
          return element.labelRequired;
        }, data.data)).toEqual(data.expected);
        if (data.data !== null) {
          await expect(idsEditor).toHaveAttribute('label-required', data.expected.toString());
        } else {
          await expect(idsEditor).not.toHaveAttribute('label-required');
        }
      }
    });

    test('can set/get paragraphSeparator', async () => {
      const defSeparator = 'p';
      const testData = [
        { data: 'div', expected: 'div' },
        { data: 'br', expected: 'br' },
        { data: 'p', expected: defSeparator },
        { data: 'a', expected: defSeparator },
        { data: null, expected: defSeparator }
      ];
      expect(await idsEditor.evaluate((element: IdsEditor) => element.paragraphSeparator)).toEqual(defSeparator);
      await expect(idsEditor).not.toHaveAttribute('paragraph-separator');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.paragraphSeparator = tData as any;
          return element.paragraphSeparator;
        }, data.data)).toEqual(data.expected);
        if (data.data && ['p', 'div', 'br'].indexOf(data.data) > -1) {
          await expect(idsEditor).toHaveAttribute('paragraph-separator', data.expected);
        } else {
          await expect(idsEditor).not.toHaveAttribute('paragraph-separator');
        }
      }
    });

    test('can set/get pasteAsPlainText', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsEditor.evaluate((element: IdsEditor) => element.pasteAsPlainText)).toBeFalsy();
      await expect(idsEditor).not.toHaveAttribute('paste-as-plain-text');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.pasteAsPlainText = tData as any;
          return element.pasteAsPlainText;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsEditor).toHaveAttribute('paste-as-plain-text');
        } else {
          await expect(idsEditor).not.toHaveAttribute('paste-as-plain-text');
        }
      }
    });

    test('can set/get placeholder', async () => {
      const testData = [
        { data: 'test', expected: 'test' },
        { data: '', expected: null },
        { data: 123, expected: '123' },
        { data: null, expected: null }
      ];

      expect(await idsEditor.evaluate((element: IdsEditor) => element.placeholder)).toBeNull();
      await expect(idsEditor).not.toHaveAttribute('placeholder');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.placeholder = tData as any;
          return element.placeholder;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsEditor).toHaveAttribute('placeholder', data.expected);
        } else {
          await expect(idsEditor).not.toHaveAttribute('placeholder');
        }
      }
    });

    test('can set/get readonly', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];
      const container = await idsEditor.locator('div.ids-editor').first();
      const textarea = await idsEditor.locator('#source-textarea').first();
      const label = await idsEditor.locator('#editor-label').first();
      const contentEditable = await idsEditor.locator('#editor-container').first();

      expect(await idsEditor.evaluate((element: IdsEditor) => element.readonly)).toBeFalsy();
      await expect(idsEditor).not.toHaveAttribute('readonly');
      await expect(container).not.toHaveAttribute('readonly');
      await expect(textarea).not.toHaveAttribute('readonly');
      await expect(label).not.toHaveAttribute('readonly');
      await expect(contentEditable).toHaveAttribute('contenteditable', 'true');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.readonly = tData as any;
          return element.readonly;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsEditor).toHaveAttribute('readonly');
          await expect(container).toHaveAttribute('readonly');
          await expect(textarea).toHaveAttribute('readonly');
          await expect(label).toHaveAttribute('readonly');
          await expect(contentEditable).toHaveAttribute('contenteditable', 'false');
        } else {
          await expect(idsEditor).not.toHaveAttribute('readonly');
          await expect(container).not.toHaveAttribute('readonly');
          await expect(textarea).not.toHaveAttribute('readonly');
          await expect(label).not.toHaveAttribute('readonly');
          await expect(contentEditable).toHaveAttribute('contenteditable', 'true');
        }
      }
    });

    test('can set/get sourceFormatter', async () => {
      const testData = [
        { data: true, expected: true },
        { data: 'false', expected: false },
        { data: '', expected: true },
        { data: null, expected: false }
      ];

      expect(await idsEditor.evaluate((element: IdsEditor) => element.sourceFormatter)).toBeFalsy();
      await expect(idsEditor).not.toHaveAttribute('source-formatter');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.sourceFormatter = tData as any;
          return element.sourceFormatter;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsEditor).toHaveAttribute('source-formatter');
        } else {
          await expect(idsEditor).not.toHaveAttribute('source-formatter');
        }
      }
    });

    test('can set/get view', async () => {
      const defView = 'editor';
      const testData = [
        { data: 'source', expected: 'source' },
        { data: 'source', expected: 'source' },
        { data: 'editor', expected: 'editor' },
        { data: 'test', expected: defView }
      ];
      const btnSource = await idsEditor.locator('ids-button[editor-action="sourcemode"]').first();
      const btnSourceBtn = await btnSource.locator('button[editor-action="sourcemode"]').first();
      const btnEditor = await idsEditor.locator('ids-button[editor-action="editormode"]').first();
      const btnEditorBtn = await btnEditor.locator('button[editor-action="editormode"]').first();
      const toolBar = await idsEditor.locator('ids-toolbar').first();
      const validateElements = async (mode: 'editor' | 'source') => {
        if (mode === 'editor') {
          await expect(btnSource).not.toHaveAttribute('hidden');
          await expect(btnSourceBtn).not.toHaveAttribute('hidden');
          await expect(btnEditor).toHaveAttribute('hidden');
          await expect(btnEditorBtn).toHaveAttribute('hidden');
          await expect(toolBar).not.toHaveAttribute('disabled');
          return;
        }
        await expect(btnSource).toHaveAttribute('hidden');
        await expect(btnSourceBtn).toHaveAttribute('hidden');
        await expect(btnEditor).not.toHaveAttribute('hidden');
        await expect(btnEditorBtn).not.toHaveAttribute('hidden');
        await expect(toolBar).toHaveAttribute('disabled');
      };

      expect(await idsEditor.evaluate((element: IdsEditor) => element.view)).toEqual(defView);
      await expect(idsEditor).not.toHaveAttribute('view');
      await validateElements('editor');

      for (const data of testData) {
        expect(await idsEditor.evaluate((element: IdsEditor, tData) => {
          element.view = tData;
          return element.view;
        }, data.data)).toEqual(data.expected);
        if (['editor', 'source'].includes(data.data)) {
          await expect(idsEditor).toHaveAttribute('view', data.expected);
          await validateElements(data.data as any);
        } else {
          await expect(idsEditor).not.toHaveAttribute('view');
          await validateElements('editor');
        }
      }
    });

    test('can get editorSlot', async () => {
      expect(await idsEditor.evaluate((element:IdsEditor) => element.editorSlot)).toBeTruthy();
    });

    test('can get hiddenSlot', async () => {
      expect(await idsEditor.evaluate((element:IdsEditor) => element.hiddenSlot)).toBeTruthy();
    });

    test('can paste as text', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      // add paste event listener
      await idsEditor.evaluate((element: IdsEditor) => {
        (<any>window).pasteTriggered = false;
        element.addEventListener('paste', () => { (<any>window).pasteTriggered = true; });
        element.pasteAsPlainText = true;
      });
      const textarea = await idsEditor.locator('#editor-container').first();
      const textToCopy = '<h1>test1234567890</h1>';
      await expect(textarea).not.toContainText(textToCopy);
      await textarea.clear();
      await pasteClipBoard(textarea, textToCopy);
      // validate if paste event is triggered
      expect(await page.evaluate(() => (<any>window).pasteTriggered)).toBeTruthy();
      await expect(textarea).toContainText(textToCopy);
    });

    test('can paste as html', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      // add paste event listener
      await idsEditor.evaluate((element: IdsEditor) => {
        (<any>window).pasteTriggered = false;
        element.addEventListener('paste', () => { (<any>window).pasteTriggered = true; });
      });
      const textarea = await idsEditor.locator('#editor-container').first();
      const textToCopy = '<h1>test1234567890</h1>';
      const textNoTags = textToCopy.replaceAll(/<[^>]*>/g, '');
      await expect(textarea).not.toContainText(textToCopy);
      await textarea.clear();
      await pasteClipBoard(textarea, textToCopy, { format: 'text/html' });
      // validate if paste event is triggered
      expect(await page.evaluate(() => (<any>window).pasteTriggered)).toBeTruthy();
      await expect(textarea).toHaveText(textNoTags);
    });

    test('can set/get dirtyTracker', async () => {
      expect(await idsEditor.evaluate((element: IdsEditor) => element.dirtyTracker)).toBeFalsy();
      await expect(idsEditor).not.toHaveAttribute('dirty-tracker');
      await expect(idsEditor.locator('ids-icon.icon-dirty')).not.toBeAttached();

      expect(await idsEditor.evaluate((element: IdsEditor) => {
        element.dirtyTracker = true;
        return element.dirtyTracker;
      })).toBeTruthy();
      await expect(idsEditor).toHaveAttribute('dirty-tracker', 'true');
      await idsEditor.locator('#editor-container').first().fill('another test');
      await expect(idsEditor.locator('ids-icon.icon-dirty')).toBeAttached();
    });

    test('setting text in textarea', async ({ page }) => {
      const htmlTextareaHandle = await page.locator('ids-editor #source-textarea').first();

      // switch to html editor
      await page.locator('ids-editor ids-button[editor-action="sourcemode"]').first().click();

      // set html text value
      await htmlTextareaHandle.evaluate((textarea: HTMLTextAreaElement) => {
        textarea.value = '<p>Test this is stored</p>';
      });

      // switch to visual editor
      await page.locator('ids-editor ids-button[editor-action="editormode"]').first().click();

      await expect(await page.getByText('Test this is stored')).toBeVisible();
    });
  });
});
