import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsTree, { IdsTreeData } from '../../src/components/ids-tree/ids-tree';

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

    test.skip('should add node to the top/bottom of the tree', async ({ page }) => {
      const treeProps = await page.evaluate(async () => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        tree!.addNodes([{
          id: 'top-node',
          text: 'Top node'
        }], 'top');
        tree!.addNodes([{
          id: 'bottom-node',
          text: 'Bottom node'
        }], 'bottom');

        const topNodeDataIndex = tree!.nodesData?.findIndex((item) => item.id === 'top-node');
        const topNodeDatasourceIndex = tree!.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'top-node');
        const bottomNodeDataIndex = tree!.nodesData?.findIndex((item) => item.id === 'bottom-node');
        const bottomNodeDatasourceIndex = tree!.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'bottom-node');

        return {
          topNodeDataIndex,
          topNodeDatasourceIndex,
          bottomNodeDataIndex,
          bottomNodeDatasourceIndex,
        };
      });

      expect(treeProps.topNodeDataIndex).toEqual(0);
      expect(treeProps.topNodeDatasourceIndex).toEqual(0);
      expect(treeProps.bottomNodeDataIndex).toEqual(45);
      expect(treeProps.bottomNodeDatasourceIndex).toEqual(7);
    });

    test('should add node before/after root node', async ({ page }) => {
      const treeProps = await page.evaluate(async () => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        const firstNode = tree!.getNode('#home');
        const lastNode = tree!.getNode('#contacts');
        tree!.addNodes([{
          id: 'before-first-node',
          text: 'Before first node'
        }], 'before', firstNode.elem);
        tree!.addNodes([{
          id: 'before-last-node',
          text: 'Before last node'
        }], 'before', lastNode.elem);
        tree!.addNodes([{
          id: 'after-first-node',
          text: 'After first node'
        }], 'after', firstNode.elem);
        tree!.addNodes([{
          id: 'after-last-node',
          text: 'After last node'
        }], 'after', lastNode.elem);

        const beforeFirstNodeDataIndex = tree!.nodesData?.findIndex((item) => item.id === 'before-first-node');
        const beforeFirstNodeDatasourceIndex = tree!.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'before-first-node');
        const beforeLastNodeDataIndex = tree!.nodesData?.findIndex((item) => item.id === 'before-last-node');
        const beforeLastNodeDatasourceIndex = tree!.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'before-last-node');
        const afterFirstNodeDataIndex = tree!.nodesData?.findIndex((item) => item.id === 'after-first-node');
        const afterFirstNodeDatasourceIndex = tree!.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'after-first-node');
        const afterLastNodeDataIndex = tree!.nodesData?.findIndex((item) => item.id === 'after-last-node');
        const afterLastNodeDatasourceIndex = tree!.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'after-last-node');

        return {
          beforeFirstNodeDataIndex,
          beforeFirstNodeDatasourceIndex,
          beforeLastNodeDataIndex,
          beforeLastNodeDatasourceIndex,
          afterFirstNodeDataIndex,
          afterFirstNodeDatasourceIndex,
          afterLastNodeDataIndex,
          afterLastNodeDatasourceIndex,
        };
      });

      expect(treeProps.beforeFirstNodeDataIndex).toEqual(0);
      expect(treeProps.beforeFirstNodeDatasourceIndex).toEqual(0);
      expect(treeProps.beforeLastNodeDataIndex).toEqual(44);
      expect(treeProps.beforeLastNodeDatasourceIndex).toEqual(7);
      expect(treeProps.afterFirstNodeDataIndex).toEqual(2);
      expect(treeProps.afterFirstNodeDatasourceIndex).toEqual(2);
      expect(treeProps.afterLastNodeDataIndex).toEqual(46);
      expect(treeProps.afterLastNodeDatasourceIndex).toEqual(9);
    });

    test.skip('should add node before/after a node with parent', async ({ page }) => {
      const treeProps = await page.evaluate(async () => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        const withParentNode = tree!.getNode('#leadership');
        tree!.addNodes([{
          id: 'before-node-with-parent',
          text: 'Before node-with-parent'
        }], 'before', withParentNode.elem);
        tree!.addNodes([{
          id: 'after-node-with-parent',
          text: 'After node-with-parent'
        }], 'after', withParentNode.elem);

        const beforeDataIndex = tree!.nodesData?.findIndex((item) => item.id === 'before-node-with-parent');
        const beforeDatasourceIndex = tree!.datasource?.data?.[2]?.children?.findIndex((item: IdsTreeData) => item.id === 'before-node-with-parent');
        const afterDataIndex = tree!.nodesData?.findIndex((item) => item.id === 'after-node-with-parent');
        const afterDatasourceIndex = tree!.datasource?.data?.[2]?.children?.findIndex((item: IdsTreeData) => item.id === 'after-node-with-parent');

        return {
          beforeDataIndex,
          beforeDatasourceIndex,
          afterDataIndex,
          afterDatasourceIndex,
        };
      });

      expect(treeProps.beforeDataIndex).toEqual(3);
      expect(treeProps.beforeDatasourceIndex).toEqual(0);
      expect(treeProps.afterDataIndex).toEqual(5);
      expect(treeProps.afterDatasourceIndex).toEqual(2);
    });

    test.skip('should add node as children of a node', async ({ page }) => {
      const treeProps = await page.evaluate(async () => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        const parentNode = tree!.getNode('#home');
        tree!.addNodes([{
          id: 'child-node',
          text: 'Child node'
        }], 'child', parentNode.elem);

        const dataIndex = tree!.nodesData?.findIndex((item) => item.id === 'child-node');
        const datasourceIndex = tree!.datasource?.data?.[0]?.children?.findIndex((item: IdsTreeData) => item.id === 'child-node');
        const childrenCount = tree!.datasource?.data?.[0]?.children?.length;

        return {
          dataIndex,
          datasourceIndex,
          childrenCount
        };
      });

      expect(treeProps.dataIndex).toEqual(1);
      expect(treeProps.datasourceIndex).toEqual(0);
      expect(treeProps.childrenCount).toEqual(1);
    });
  });

  test.describe('event tests', () => {
    test('should be able to load children', async ({ page }) => {
      await page.goto('/ids-tree/load-children.html');

      await page.getByText('Parent one').click();
      await expect(page.getByText('New dynamic node')).toBeVisible();
    });

    test.skip('should fire selected event with correct data on node click', async ({ page }) => {
      const selectedNode = await page.evaluate(async () => {
        let data: any = null;
        const tree = document.querySelector<IdsTree>('ids-tree');
        tree?.addEventListener('selected', (e: any) => {
          data = e.detail.node.data;
        });
        const parentNode = tree!.getNode('#home');
        tree!.addNodes([{
          id: 'child-node',
          text: 'Child node'
        }], 'child', parentNode.elem);
        tree?.container?.querySelector<any>('#about-us')?.container?.querySelector('.node-container')?.click();

        return data;
      });

      expect(selectedNode?.id).toEqual('about-us');
    });
  });
});
