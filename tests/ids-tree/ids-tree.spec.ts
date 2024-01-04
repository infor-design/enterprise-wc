import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsTree from '../../src/components/ids-tree/ids-tree';

test.describe('IdsTree tests', () => {
  const url = '/ids-tree/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Tree Component');
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
      const handle = await page.$('ids-tree');
      const html = await handle?.evaluate((el: IdsTree) => el?.outerHTML);
      await expect(html).toMatchSnapshot('tree-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-tree');
      const html = await handle?.evaluate((el: IdsTree) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('tree-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-tree-light');
    });

    test('should match the visual snapshot in percy (sandbox)', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await page.goto('/ids-tree/sandbox.html');
      await percySnapshot(page, 'ids-tree-sandbox-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should be able to expand/collapse tree nodes', async ({ page }) => {
      expect(await page.locator('ids-tree-node[expanded="false"]').count()).toBe(2);
      await page.getByText('Icons').click();
      expect(await page.locator('ids-tree-node[expanded="false"]').count()).toBe(1);
    });

    test('should render characters and symbols', async ({ page }) => {
      const nodeData = await page.evaluate(() => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        const data = [{
          id: 'cs-1',
          text: '<online onload="alert()">'
        }, {
          id: 'cs-2',
          text: `& "
              &#33; &#34; &#35; &#36; &#37; &#38; &#39;
              &#40; &#41; &#42; &#43; &#44; &#45; &#46; &#47;
              &#161;, &#162;, &#163;, &#164;, &#165;, &#166;, &#167;, &#169;`
        }];
        tree!.data = data;
        return [tree!.getNode('#cs-1')?.elem.textContent, tree!.getNode('#cs-2')?.elem.textContent];
      });

      expect(nodeData[0]).toContain('onload="alert()">');
      expect(nodeData[1]).toContain('# $ % &');
      expect(nodeData[1]).toContain('¡, ¢, £, ¤, ¥, ¦, §, ©');
    });

    test('can set node to selectable', async ({ page }) => {
      const handle = await page.$('ids-tree');
      let selectable = await handle?.evaluate((tree: IdsTree) => tree!.getNode('#home')?.elem.selectable);
      expect(selectable).toEqual('single');

      selectable = await page.evaluate(() => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        tree!.getNode('#home').elem.selectable = false;
        return tree!.getNode('#home')?.elem.selectable;
      });

      expect(selectable).toEqual(false);

      selectable = await page.evaluate(() => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        tree!.getNode('#home').elem.selectable = 'test';
        return tree!.getNode('#home')?.elem.selectable;
      });
      expect(selectable).toEqual('single');
    });

    test('should update with container language change', async ({ page }) => {
      await page.evaluate(async () => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        await window?.IdsGlobal?.locale?.setLanguage('ar');
        tree!.getNode('#home').elem.selectable = false;
        return tree!.getNode('#home')?.elem.selectable;
      });

      expect(await page.locator('ids-tree').getAttribute('dir')).toEqual('rtl');
    });
  });

  test.describe('event tests', () => {
    test('should be able to load children', async ({ page }) => {
      await page.goto('/ids-tree/load-children.html');

      await page.getByText('Parent one').click();
      await expect(page.getByText('New dynamic node')).toBeVisible();
    });
  });
});
