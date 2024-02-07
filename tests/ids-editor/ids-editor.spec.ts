import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Page, expect } from '@playwright/test';
import { test } from '../base-fixture';

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
      const editor = document.querySelector<IdsEditor>('ids-editor')!;
      const paragraph = editor.editorSlot.assignedElements()[1];
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
        const editor = document.querySelector<IdsEditor>('ids-editor');
        const secondParagraph = editor?.editorSlot.assignedElements()[1] as HTMLElement;
        return secondParagraph.style.textAlign;
      });
      expect(textAlign).toEqual('center');
    });

    test('applying alignright action', async ({ page }) => {
      await clickActionButton(page, 'ids-button[editor-action="alignright"]');
      const textAlign = await page.evaluate(() => {
        const editor = document.querySelector<IdsEditor>('ids-editor');
        const secondParagraph = editor?.editorSlot.assignedElements()[1] as HTMLElement;
        return secondParagraph.style.textAlign;
      });
      expect(textAlign).toEqual('right');
    });
  });
});
