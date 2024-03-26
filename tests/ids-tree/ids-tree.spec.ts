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
  });

  test.describe('adding nodes tests', () => {
    const singleNode = [
      {
        id: 'newa',
        text: 'New node'
      }
    ];
    const multiNode = [
      {
        id: 'newb',
        text: 'New node 1'
      },
      {
        id: 'newc',
        text: 'New node 2',
        expanded: false,
        children: [
          {
            id: 'newd',
            text: 'New node 2.1'
          },
          {
            id: 'newe',
            text: 'New node 2.1'
          }
        ]
      },
      {
        id: 'newf',
        text: 'New node 3',
        icon: 'building'
      }
    ];

    test('should add node to the top/bottom of the tree', async ({ page }) => {
      const tree = await page.locator('ids-tree');
      await tree.evaluate((elem: IdsTree) => {
        (window as any).nodeData = {};
        elem.addEventListener('selected', (e: any) => {
          (window as any).nodeData = e.detail.node.data;
        });
      });
      const results = await tree.evaluate((elem: IdsTree) => {
        elem.addNodes([{
          id: 'top-node',
          text: 'Top node'
        }], 'top');
        elem.addNodes([{
          id: 'bottom-node',
          text: 'Bottom node'
        }], 'bottom');

        const topNodeDataIndex = elem.nodesData?.findIndex((item) => item.id === 'top-node');
        const topNodeDatasourceIndex = elem.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'top-node');
        const bottomNodeDataIndex = elem.nodesData?.findIndex((item) => item.id === 'bottom-node');
        const bottomNodeDatasourceIndex = elem.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'bottom-node');

        return {
          topNodeDataIndex,
          topNodeDatasourceIndex,
          bottomNodeDataIndex,
          bottomNodeDatasourceIndex,
        };
      });

      expect(results.topNodeDataIndex).toEqual(0);
      expect(results.topNodeDatasourceIndex).toEqual(0);
      expect(results.bottomNodeDataIndex).toEqual(45);
      expect(results.bottomNodeDatasourceIndex).toEqual(7);

      await page.getByText('Top node').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('top-node');
      await page.getByText('Home').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('home');
      await page.getByText('Bottom node').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('bottom-node');
      await page.getByText('About Us').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('about-us');
      await page.getByText('Contacts').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('contacts');
    });

    test('should add node before/after root node', async ({ page }) => {
      const tree = await page.locator('ids-tree');
      await tree.evaluate((elem: IdsTree) => {
        (window as any).nodeData = {};
        elem.addEventListener('selected', (e: any) => {
          (window as any).nodeData = e.detail.node.data;
        });
      });
      const results = await tree.evaluate((elem: IdsTree) => {
        const firstNode = elem.getNode('#home');
        const lastNode = elem.getNode('#contacts');
        elem.addNodes([{
          id: 'before-first-node',
          text: 'Before first node'
        }], 'before', firstNode.elem);
        elem.addNodes([{
          id: 'before-last-node',
          text: 'Before last node'
        }], 'before', lastNode.elem);
        elem.addNodes([{
          id: 'after-first-node',
          text: 'After first node'
        }], 'after', firstNode.elem);
        elem.addNodes([{
          id: 'after-last-node',
          text: 'After last node'
        }], 'after', lastNode.elem);

        const beforeFirstNodeDataIndex = elem.nodesData?.findIndex((item) => item.id === 'before-first-node');
        const beforeFirstNodeDatasourceIndex = elem.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'before-first-node');
        const beforeLastNodeDataIndex = elem.nodesData?.findIndex((item) => item.id === 'before-last-node');
        const beforeLastNodeDatasourceIndex = elem.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'before-last-node');
        const afterFirstNodeDataIndex = elem.nodesData?.findIndex((item) => item.id === 'after-first-node');
        const afterFirstNodeDatasourceIndex = elem.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'after-first-node');
        const afterLastNodeDataIndex = elem.nodesData?.findIndex((item) => item.id === 'after-last-node');
        const afterLastNodeDatasourceIndex = elem.datasource?.data?.findIndex((item: IdsTreeData) => item.id === 'after-last-node');

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

      expect(results.beforeFirstNodeDataIndex).toEqual(0);
      expect(results.beforeFirstNodeDatasourceIndex).toEqual(0);
      expect(results.beforeLastNodeDataIndex).toEqual(44);
      expect(results.beforeLastNodeDatasourceIndex).toEqual(7);
      expect(results.afterFirstNodeDataIndex).toEqual(2);
      expect(results.afterFirstNodeDatasourceIndex).toEqual(2);
      expect(results.afterLastNodeDataIndex).toEqual(47);
      expect(results.afterLastNodeDatasourceIndex).toEqual(9);

      await page.getByText('Before first node').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('before-first-node');
      await page.getByText('Home').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('home');
      await page.getByText('After last node').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('after-last-node');
      await page.getByText('Contacts').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('contacts');
      await page.getByText('Before last node').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('before-last-node');
      await page.getByText('Contacts').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('contacts');
      await page.getByText('About Us').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('about-us');
      await page.getByText('After first node').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('after-first-node');
      await page.getByText('Home').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('home');
    });

    test('should add node before/after a node with parent', async ({ page }) => {
      const tree = await page.locator('ids-tree');
      await tree.evaluate((elem: IdsTree) => {
        (window as any).nodeData = {};
        elem.addEventListener('selected', (e: any) => {
          (window as any).nodeData = e.detail.node.data;
        });
      });
      const results = await tree.evaluate((elem: IdsTree) => {
        const withParentNode = elem!.getNode('#leadership');
        elem!.addNodes([{
          id: 'before-node-with-parent',
          text: 'Before node-with-parent'
        }], 'before', withParentNode.elem);
        elem!.addNodes([{
          id: 'after-node-with-parent',
          text: 'After node-with-parent'
        }], 'after', withParentNode.elem);

        const beforeDataIndex = elem!.nodesData?.findIndex((item) => item.id === 'before-node-with-parent');
        const beforeDatasourceIndex = elem!.datasource?.data?.[2]?.children?.findIndex((item: IdsTreeData) => item.id === 'before-node-with-parent');
        const afterDataIndex = elem!.nodesData?.findIndex((item) => item.id === 'after-node-with-parent');
        const afterDatasourceIndex = elem!.datasource?.data?.[2]?.children?.findIndex((item: IdsTreeData) => item.id === 'after-node-with-parent');

        return {
          beforeDataIndex,
          beforeDatasourceIndex,
          afterDataIndex,
          afterDatasourceIndex,
        };
      });

      expect(results.beforeDataIndex).toEqual(3);
      expect(results.beforeDatasourceIndex).toEqual(0);
      expect(results.afterDataIndex).toEqual(8);
      expect(results.afterDatasourceIndex).toEqual(2);

      await page.getByText('Before node-with-parent').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('before-node-with-parent');
      await page.getByText('Leadership').first().click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('leadership');
      await page.getByText('After node-with-parent').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('after-node-with-parent');
      await page.getByText('History 2nd').first().click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('history-2');
      await page.getByText('Contacts').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('contacts');
      await page.getByText('Careers', { exact: true }).first().click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('careers');
    });

    test('should add node as children of a node', async ({ page }) => {
      const tree = await page.locator('ids-tree');
      const addNodes = async (id: string, data: Array<IdsTreeData>) => {
        await tree.evaluate((elem: IdsTree, arg: { id: string, data: Array<IdsTreeData> }) => {
          const node = elem.getNode(arg.id);
          elem.addNodes(arg.data, 'child', node.elem);
        }, {
          id,
          data
        });
      };
      await tree.evaluate((elem: IdsTree) => {
        (window as any).nodeData = {};
        elem.addEventListener('selected', (e: any) => {
          (window as any).nodeData = e.detail.node.data;
        });
      });
      await addNodes('#home', singleNode);
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item: IdsTreeData) => item.id === 'home')?.children?.length)).toBe(1);
      expect(await tree.evaluate((elem: IdsTree) => elem.datasource.data.find((item: IdsTreeData) => item.id === 'home')?.children?.length)).toBe(1);
      await page.getByText('About Us').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('about-us');
      await page.getByText('New node').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('newa');
      await addNodes('#home', multiNode);
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item: IdsTreeData) => item.id === 'home')?.children?.length)).toBe(4);
      expect(await tree.evaluate((elem: IdsTree) => elem.datasource.data.find((item: IdsTreeData) => item.id === 'home')?.children?.length)).toBe(4);
      await page.getByText('About Us').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('about-us');
      await page.getByText('Public Folders').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('public-folders');
      await page.getByText('New node 2').first().click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('newc');
      await page.getByText('New node 2.1').first().click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('newd');
      await page.getByText('Contacts').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('contacts');
      await addNodes('#contacts', singleNode);
      await addNodes('#contacts', multiNode);
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item: IdsTreeData) => item.id === 'contacts')?.children?.length)).toBe(4);
      expect(await tree.evaluate((elem: IdsTree) => elem.datasource.data.find((item: IdsTreeData) => item.id === 'contacts')?.children?.length)).toBe(4);
      await page.getByText('About Us').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('about-us');
      await page.getByText('Public Folders').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('public-folders');
      await page.getByText('Contacts').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('contacts');
    });
  });

  test.describe('event tests', () => {
    test('should be able to load children', async ({ page }) => {
      await page.goto('/ids-tree/load-children.html');

      await page.getByText('Parent one').click();
      await expect(page.getByText('New dynamic node')).toBeVisible();
    });

    test('should fire selected event with correct data on node click', async ({ page }) => {
      const selectedNode = await page.evaluate(() => {
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
