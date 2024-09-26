import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsTreeShared from '../../src/components/ids-tree/ids-tree-shared';
import IdsTree from '../../src/components/ids-tree/ids-tree';
import { IdsTreeNodeData } from '../../src/components/ids-tree/ids-tree-node';

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
    let idsTree: Locator;

    test.beforeEach(async ({ page }) => {
      idsTree = await page.locator('ids-tree').first();
    });

    const dataset = [
      {
        id: 'home',
        text: 'Home',
        selected: 'true'
      },
      {
        id: 'public-folders',
        text: 'Public Folders',
        expanded: true,
        children: [
          {
            id: 'leadership',
            text: 'Leadership'
          },
          {
            id: 'history',
            text: 'History',
            disabled: 'true'
          },
          {
            id: 'careers-last',
            text: 'Careers last'
          }
        ]
      },
      {
        id: 'icons',
        text: 'Icons',
        expanded: false,
        children: [
          {
            id: 'audio',
            text: 'Audio',
            icon: 'tree-audio',
            badge: {
              color: 'info',
              text: '0',
              shape: 'round',
              textAudible: 'audible text',
              icon: 'pending'
            }
          }
        ]
      }
    ];

    test('should be able to expand/collapse tree nodes', async ({ page }) => {
      expect(await page.locator('ids-tree-node[expanded]').count()).toBe(2);
      await page.getByText('Icons').click();
      expect(await page.locator('ids-tree-node[expanded]').count()).toBe(3);
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
        return [tree!.getNode('#cs-1')?.textElem?.textContent, tree!.getNode('#cs-2')?.textElem?.textContent];
      });

      expect(nodeData[0]).toContain('onload="alert()">');
      expect(nodeData[1]).toContain('# $ % &');
      expect(nodeData[1]).toContain('¡, ¢, £, ¤, ¥, ¦, §, ©');
    });

    test('including custom properties in the tree data', async ({ page }) => {
      const nodeData = await page.evaluate(() => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        const data = [{
          id: 'cp-1',
          text: 'Custom Properties',
          customString: 'foo',
          customObject: {
            foo: 'bar'
          },
        }];
        tree!.data = data;
        return tree!.getNode('#cp-1')?.data;
      });

      expect(nodeData).toMatchObject({
        customString: 'foo',
        customObject: {
          foo: 'bar'
        },
      });
    });

    test('can set node to selectable', async ({ page }) => {
      const handle = await page.$('ids-tree');
      let selectable = await handle?.evaluate((tree: IdsTree) => tree!.getNode('#home')?.selectable);
      expect(selectable).toEqual('single');

      selectable = await page.evaluate(() => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        tree!.getNode('#home')!.selectable = 'none';
        return tree!.getNode('#home')?.selectable;
      });

      expect(selectable).toEqual('none');

      selectable = await page.evaluate(() => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        tree!.getNode('#home')!.selectable = 'test';
        return tree!.getNode('#home')?.selectable;
      });
      expect(selectable).toEqual('single');
    });

    test('should update with container language change', async ({ page }) => {
      await page.evaluate(async () => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        await window?.IdsGlobal?.locale?.setLanguage('ar');
        tree!.getNode('#home')!.selectable = 'none';
        return tree!.getNode('#home')?.selectable;
      });

      expect(await page.locator('ids-tree').getAttribute('dir')).toEqual('rtl');
    });

    test('can set the tree group collapse icon', async () => {
      const icon = 'user-folder-closed';
      let collapseIcon: any;
      await expect(idsTree).not.toHaveAttribute('collapse-icon');
      collapseIcon = await idsTree.evaluate((el: IdsTree) => el.collapseIcon);
      await expect(collapseIcon).toEqual(IdsTreeShared.DEFAULTS.collapseIcon);
      await idsTree.evaluate((el: IdsTree, ic0n: any) => { el.collapseIcon = ic0n; }, icon);
      await expect(idsTree).toHaveAttribute('collapse-icon', icon);
      await idsTree.evaluate((el: IdsTree) => { el.collapseIcon = null; });
      await expect(idsTree).not.toHaveAttribute('collapse-icon');
      collapseIcon = await idsTree.evaluate((el: IdsTree) => el.collapseIcon);
      await expect(collapseIcon).toEqual(IdsTreeShared.DEFAULTS.collapseIcon);
    });

    test('can set the tree as disabled', async () => {
      let disbabled: any;
      await expect(idsTree).not.toHaveAttribute('disabled');
      disbabled = await idsTree.evaluate((el: IdsTree) => el.disabled);
      await expect(disbabled).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => { el.disabled = true; });
      disbabled = await idsTree.evaluate((el: IdsTree) => el.disabled);
      await expect(disbabled).toEqual(true);
      await expect(idsTree).toHaveAttribute('disabled', '');
      await idsTree.evaluate((el: IdsTree) => { el.disabled = false; });
      disbabled = await idsTree.evaluate((el: IdsTree) => el.disabled);
      await expect(disbabled).toEqual(false);
      await expect(idsTree).not.toHaveAttribute('disabled');
    });

    test('can set the tree group expand icon', async () => {
      const icon = 'user-folder-open';
      let expand: any;
      await expect(idsTree).not.toHaveAttribute('expand-icon');
      expand = await idsTree.evaluate((el: IdsTree) => el.expandIcon);
      await expect(expand).toEqual(IdsTreeShared.DEFAULTS.expandIcon);
      await idsTree.evaluate((el: IdsTree, ic0n: any) => { el.expandIcon = ic0n; }, icon);
      await expect(idsTree).toHaveAttribute('expand-icon', icon);
      await idsTree.evaluate((el: IdsTree) => { el.expandIcon = null; });
      await expect(idsTree).not.toHaveAttribute('expand-icon');
      expand = await idsTree.evaluate((el: IdsTree) => el.expandIcon);
      await expect(expand).toEqual(IdsTreeShared.DEFAULTS.expandIcon);
    });

    test('can set the tree as expanded', async () => {
      let expanded: any;
      await expect(idsTree).not.toHaveAttribute('expanded');
      expanded = await idsTree.evaluate((el: IdsTree) => el.expanded);
      await expect(expanded).toEqual(IdsTreeShared.DEFAULTS.expanded);
      await idsTree.evaluate((el: IdsTree) => { el.expanded = true; });
      expanded = await idsTree.evaluate((el: IdsTree) => el.expanded);
      await expect(expanded).toEqual(true);
      await expect(idsTree).toHaveAttribute('expanded', '');
      await idsTree.evaluate((el: IdsTree) => { el.expanded = false; });
      expanded = await idsTree.evaluate((el: IdsTree) => el.expanded);
      await expect(expanded).toEqual(false);
      await expect(idsTree).not.toHaveAttribute('expanded');
      await idsTree.evaluate((el: IdsTree) => { el.expanded = null as unknown as string; });
      expanded = await idsTree.evaluate((el: IdsTree) => el.expanded);
      await expect(expanded).toEqual(IdsTreeShared.DEFAULTS.expanded);
      await expect(idsTree).not.toHaveAttribute('expanded');
    });

    test('can set the tree node icon', async () => {
      const icon = 'tree-doc';
      let ic0n: any;
      await expect(idsTree).not.toHaveAttribute('icon');
      ic0n = await idsTree.evaluate((el: IdsTree) => el.icon);
      await expect(ic0n).toEqual(IdsTreeShared.DEFAULTS.icon);
      await idsTree.evaluate((el: IdsTree, icOn: any) => { el.icon = icOn; }, icon);
      await expect(idsTree).toHaveAttribute('icon', icon);
      await idsTree.evaluate((el: IdsTree) => { el.icon = null; });
      await expect(idsTree).not.toHaveAttribute('icon');
      ic0n = await idsTree.evaluate((el: IdsTree) => el.icon);
      await expect(ic0n).toEqual(IdsTreeShared.DEFAULTS.icon);
    });

    test('can set the tree as selectable', async () => {
      let selectable: any = 'single';

      await expect(idsTree).not.toHaveAttribute('selectable');
      selectable = await idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selectable).toEqual(IdsTreeShared.DEFAULTS.selectable);
      await idsTree.evaluate((el: IdsTree, iselectable: any) => { el.selectable = iselectable; }, selectable);
      selectable = await idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selectable).toEqual(selectable);
      await idsTree.evaluate((el: IdsTree) => { el.selectable = 'multiple'; });
      selectable = await idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selectable).toEqual('multiple');
      await expect(idsTree).toHaveAttribute('selectable', 'multiple');
      await idsTree.evaluate((el: IdsTree) => { el.selectable = 'none'; });
      selectable = await idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selectable).toEqual('none');
      await expect(idsTree).toHaveAttribute('selectable', 'none');
      await idsTree.evaluate((el: IdsTree) => { el.selectable = 'test'; });
      selectable = await idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selectable).toEqual(IdsTreeShared.DEFAULTS.selectable);
      await expect(idsTree).not.toHaveAttribute('selectable');
      await idsTree.evaluate((el: IdsTree) => { el.selectable = null; });
      selectable = await idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selectable).toEqual(IdsTreeShared.DEFAULTS.selectable);
      await expect(idsTree).not.toHaveAttribute('selectable');
    });

    test('can update toggle collapse icon', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await idsTree.evaluate((el: IdsTree) => { el.expandTarget = 'icon'; });
      const icon = 'chevron-right';
      await expect(idsTree).not.toHaveAttribute('toggle-collapse-icon');
      let toggleCollapseIcon = await idsTree.evaluate((el: IdsTree) => el.toggleCollapseIcon);
      await expect(toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
      await idsTree.evaluate((el: IdsTree, ic0n: any) => { el.toggleCollapseIcon = ic0n; }, icon);
      toggleCollapseIcon = await idsTree.evaluate((el: IdsTree) => el.toggleCollapseIcon);
      await expect(idsTree).toHaveAttribute('toggle-collapse-icon', icon);
      await expect(toggleCollapseIcon).toEqual(icon);
    });

    test('can set the tree toggle collapse icon', async () => {
      const icon = 'chevron-right';
      await idsTree.evaluate((el: IdsTree) => { el.expandTarget = 'icon'; });
      await expect(idsTree).not.toHaveAttribute('toggle-collapse-icon');
      let toggleCollapseIcon = await idsTree.evaluate((el: IdsTree) => el.toggleCollapseIcon);
      await expect(toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
      await idsTree.evaluate((el: IdsTree, ic0n: any) => { el.toggleCollapseIcon = ic0n; }, icon);
      toggleCollapseIcon = await idsTree.evaluate((el: IdsTree) => el.toggleCollapseIcon);
      await expect(idsTree).toHaveAttribute('toggle-collapse-icon', icon);
      await expect(toggleCollapseIcon).toEqual(icon);
      await idsTree.evaluate((el: IdsTree) => { el.toggleCollapseIcon = null; });
      toggleCollapseIcon = await idsTree.evaluate((el: IdsTree) => el.toggleCollapseIcon);
      await expect(idsTree).not.toHaveAttribute('toggle-collapse-icon');
      await expect(toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
    });

    test('can set the tree toggle expand icon', async () => {
      const icon = 'chevron-down';
      await idsTree.evaluate((el: IdsTree) => { el.expandTarget = 'icon'; });
      await expect(idsTree).not.toHaveAttribute('toggle-collapse-icon');
      let toggleCollapseIcon = await idsTree.evaluate((el: IdsTree) => el.toggleCollapseIcon);
      await expect(toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
      await idsTree.evaluate((el: IdsTree, ic0n: any) => { el.toggleCollapseIcon = ic0n; }, icon);
      toggleCollapseIcon = await idsTree.evaluate((el: IdsTree) => el.toggleCollapseIcon);
      await expect(idsTree).toHaveAttribute('toggle-collapse-icon', icon);
      await expect(toggleCollapseIcon).toEqual(icon);
      await idsTree.evaluate((el: IdsTree) => { el.toggleCollapseIcon = null; });
      toggleCollapseIcon = await idsTree.evaluate((el: IdsTree) => el.toggleCollapseIcon);
      await expect(idsTree).not.toHaveAttribute('toggle-collapse-icon');
      await expect(toggleCollapseIcon).toEqual(IdsTreeShared.DEFAULTS.toggleCollapseIcon);
    });

    test('can set the tree toggle icon rotate', async () => {
      await expect(idsTree).not.toHaveAttribute('toggle-icon-rotate');
      let toggleIconRotate = await idsTree.evaluate((el: IdsTree) => el.toggleIconRotate);
      await expect(toggleIconRotate).toEqual(IdsTreeShared.DEFAULTS.toggleIconRotate);
      await idsTree.evaluate((el: IdsTree) => { el.toggleIconRotate = true; });
      toggleIconRotate = await idsTree.evaluate((el: IdsTree) => el.toggleIconRotate);
      await expect(idsTree).toHaveAttribute('toggle-icon-rotate', '');
      await expect(toggleIconRotate).toEqual(true);
      await idsTree.evaluate((el: IdsTree) => { el.toggleIconRotate = false; });
      toggleIconRotate = await idsTree.evaluate((el: IdsTree) => el.toggleIconRotate);
      await expect(idsTree).not.toHaveAttribute('toggle-icon-rotate');
      await expect(toggleIconRotate).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => { el.toggleIconRotate = null; });
      toggleIconRotate = await idsTree.evaluate((el: IdsTree) => el.toggleIconRotate);
      await expect(toggleIconRotate).toEqual(IdsTreeShared.DEFAULTS.toggleIconRotate);
      await expect(idsTree).not.toHaveAttribute('toggle-icon-rotate');
    });

    test('can use icon expand target', async () => {
      await expect(idsTree).not.toHaveAttribute('expand-target');
      let expandTarget = await idsTree.evaluate((el: IdsTree) => el.expandTarget);
      await expect(expandTarget).toEqual(IdsTreeShared.DEFAULTS.expandTarget);
      await idsTree.evaluate((el: IdsTree) => { el.expandTarget = 'icon'; });
      expandTarget = await idsTree.evaluate((el: IdsTree) => el.expandTarget);
      await expect(idsTree).toHaveAttribute('expand-target', 'icon');
      await expect(expandTarget).toEqual('icon');
      await idsTree.evaluate((el: IdsTree) => { el.expandTarget = 'node'; });
      expandTarget = await idsTree.evaluate((el: IdsTree) => el.expandTarget);
      await expect(idsTree).toHaveAttribute('expand-target', 'node');
      await expect(expandTarget).toEqual('node');
      await idsTree.evaluate((el: IdsTree) => { el.expandTarget = null as unknown as string; });
      expandTarget = await idsTree.evaluate((el: IdsTree) => el.expandTarget);
      await expect(expandTarget).toEqual(IdsTreeShared.DEFAULTS.expandTarget);
      await expect(idsTree).not.toHaveAttribute('expand-target');
    });

    test('can set the tree to use dataset', async () => {
      await idsTree.evaluate((el: IdsTree) => { el.data = 'test' as any; });
      const treeData = await idsTree.evaluate((el: IdsTree) => el.data);
      await expect(treeData).toEqual(expect.arrayContaining([]));
      await expect(treeData.length).toEqual(0);
      await idsTree.evaluate((el: IdsTree) => { el.data = []; });
      await expect(treeData).toEqual(expect.arrayContaining([]));
      await expect(treeData.length).toEqual(0);
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      const results = await idsTree.evaluate((tree: IdsTree) => {
        const home: any[] = [];
        home.push(tree.getNode('#home')!.isGroup);
        home.push(tree.getNode('#home')!.level);
        home.push(tree.getNode('#home')!.posinset);
        home.push(tree.getNode('#home')!.setsize);
        const publicFolders: any[] = [];
        publicFolders.push(tree.getNode('#public-folders')!.isGroup);
        publicFolders.push(tree.getNode('#public-folders')!.level);
        publicFolders.push(tree.getNode('#public-folders')!.posinset);
        publicFolders.push(tree.getNode('#public-folders')!.setsize);
        const leadership: any[] = [];
        leadership.push(tree.getNode('#leadership')!.isGroup);
        leadership.push(tree.getNode('#leadership')!.level);
        leadership.push(tree.getNode('#leadership')!.posinset);
        leadership.push(tree.getNode('#leadership')!.setsize);
        const history: any[] = [];
        history.push(tree.getNode('#history')!.isGroup);
        history.push(tree.getNode('#history')!.level);
        history.push(tree.getNode('#history')!.posinset);
        history.push(tree.getNode('#history')!.setsize);
        const carreerLast: any[] = [];
        carreerLast.push(tree.getNode('#careers-last')!.isGroup);
        carreerLast.push(tree.getNode('#careers-last')!.level);
        carreerLast.push(tree.getNode('#careers-last')!.posinset);
        carreerLast.push(tree.getNode('#careers-last')!.setsize);
        const icons: any[] = [];
        icons.push(tree.getNode('#icons')!.isGroup);
        icons.push(tree.getNode('#icons')!.level);
        icons.push(tree.getNode('#icons')!.posinset);
        icons.push(tree.getNode('#icons')!.setsize);
        const audio: any[] = [];
        audio.push(tree.getNode('#audio')!.isGroup);
        audio.push(tree.getNode('#audio')!.level);
        audio.push(tree.getNode('#audio')!.posinset);
        audio.push(tree.getNode('#audio')!.setsize);
        return {
          home,
          publicFolders,
          leadership,
          history,
          carreerLast,
          icons,
          audio
        };
      });
      await expect(results.home).toEqual([false, 1, 1, 3]);
      await expect(results.publicFolders).toEqual([true, 1, 2, 3]);
      await expect(results.leadership).toEqual([false, 2, 1, 3]);
      await expect(results.history).toEqual([false, 2, 2, 3]);
      await expect(results.carreerLast).toEqual([false, 2, 3, 3]);
      await expect(results.icons).toEqual([true, 1, 3, 3]);
      await expect(results.audio).toEqual([false, 2, 1, 1]);
    });

    test('can set init icons', async () => {
      await idsTree.evaluate((el: IdsTree) => { el.icon = 'tree-node'; });
      const treeIcon = await idsTree.evaluate((el: IdsTree) => el.icon);
      await expect(treeIcon).toEqual('tree-node');
      await idsTree.evaluate((el: IdsTree) => { el.collapseIcon = 'closed-folder'; });
      const collapseIcon = await idsTree.evaluate((el: IdsTree) => el.collapseIcon);
      await expect(collapseIcon).toEqual('closed-folder');
      await idsTree.evaluate((el: IdsTree) => { el.expandIcon = 'open-folder'; });
      const expandIcon = await idsTree.evaluate((el: IdsTree) => el.expandIcon);
      await expect(expandIcon).toEqual('open-folder');
    });

    test('can set the tree node single selection', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      let id = '#home';
      const homeNode = await idsTree.evaluate((tree: IdsTree) => tree.getNode('#home'));
      expect(await idsTree.evaluate((el: IdsTree, iD: any) => el.isSelected(iD), id)).toEqual(true);
      expect(await idsTree.evaluate((el: IdsTree) => el.selected)).toEqual(homeNode);
      await idsTree.evaluate((el: IdsTree) => el.unselect('#home'));
      expect(await idsTree.evaluate((el: IdsTree, iD: any) => el.isSelected(iD), id)).toEqual(false);
      expect(await idsTree.evaluate((el: IdsTree) => el.selected)).toEqual(null);

      id = '#public-folders';
      const publicFoldersNode = await idsTree.evaluate((tree: IdsTree) => tree.getNode('#public-folders'));
      expect(await idsTree.evaluate((el: IdsTree, iD: any) => el.isSelected(iD), id)).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.select('#public-folders'));
      expect(await idsTree.evaluate((el: IdsTree, iD: any) => el.isSelected(iD), id)).toEqual(true);
      expect(await idsTree.evaluate((el: IdsTree) => el.selected)).toEqual(publicFoldersNode);
      id = '#leadership';
      const leadershipNode = await idsTree.evaluate((tree: IdsTree) => tree.getNode('#leadership'));
      await idsTree.evaluate((el: IdsTree) => el.select('#leadership'));
      expect(await idsTree.evaluate((el: IdsTree, iD: any) => el.isSelected(iD), id)).toEqual(true);
      expect(await idsTree.evaluate((el: IdsTree) => el.isSelected('#home'), id)).toEqual(false);
      expect(await idsTree.evaluate((el: IdsTree) => el.isSelected('#public-folders'), id)).toEqual(false);
      expect(await idsTree.evaluate((el: IdsTree) => el.selected)).toEqual(leadershipNode);
    });

    test('can set the tree node multiple selection', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; el.selectable = 'multiple'; }, dataset);
      await expect(idsTree).toHaveAttribute('selectable', 'multiple');
      const selectable = await idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selectable).toEqual('multiple');
      const selected = idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selected).toEqual(expect.arrayContaining([]));
      await page.evaluate(() => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        tree!.getNode('#home')!.selected = true;
      });
      expect(await page.evaluate(() => {
        const tree = document.querySelector<IdsTree>('ids-tree');
        return tree!.isSelected('#home');
      })).toEqual(true);
      await idsTree.evaluate((el: IdsTree) => { el.getNode('#public-folders')!.selected = true; });
      expect(await idsTree.evaluate((el: IdsTree) => el.isSelected('#public-folders'))).toEqual(true);
    });

    test('can get the tree node for selection none', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await idsTree.evaluate((el: IdsTree) => { el.selectable = 'none'; });
      const selectable = await idsTree.evaluate((el: IdsTree) => el.selectable);
      await expect(selectable).toEqual('none');
      await expect(idsTree).toHaveAttribute('selectable', 'none');
      const selected = await idsTree.evaluate((el: IdsTree) => el.selected);
      await expect(selected).toEqual(null);
    });

    test('can collapse all attached nodes', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await idsTree.evaluate((el: IdsTree) => { el.selectable = 'none'; });
      const node1 = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.isGroup);
      const node2 = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.isGroup);
      await expect(node1).toEqual(true);
      await expect(node2).toEqual(true);
      let node1Expanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      let node2Expanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(node1Expanded).toEqual(true);
      await expect(node2Expanded).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.collapseAll());
      node1Expanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      node2Expanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(node1Expanded).toEqual(false);
      await expect(node2Expanded).toEqual(false);
    });

    test('can expand all attached nodes', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await idsTree.evaluate((el: IdsTree) => { el.selectable = 'none'; });
      const node1 = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.isGroup);
      const node2 = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.isGroup);
      await expect(node1).toEqual(true);
      await expect(node2).toEqual(true);
      let node1Expanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      let node2Expanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(node1Expanded).toEqual(true);
      await expect(node2Expanded).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.expandAll());
      node1Expanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      node2Expanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(node1Expanded).toEqual(true);
      await expect(node2Expanded).toEqual(true);
    });

    test('can collapse node', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      let node = await idsTree.evaluate((el: IdsTree) => el.getNode('#leadership')!.isGroup);
      await expect(node).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.collapse('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.isGroup);
      await expect(node).toEqual(true);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(true);
      await idsTree.evaluate((el: IdsTree) => el.collapse('#public-folders'));
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(false);
    });

    test('can expand node', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      const node = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.isGroup);
      await expect(node).toEqual(true);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(nodeExpanded).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.expand('#icons'));
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(nodeExpanded).toEqual(true);
    });

    test('can toggle node', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      let node = await idsTree.evaluate((el: IdsTree) => el.getNode('#leadership')!.isGroup);
      await expect(node).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.toggle('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.isGroup);
      await expect(node).toEqual(true);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(true);
      await idsTree.evaluate((el: IdsTree) => el.toggle('#public-folders'));
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.toggle('#public-folders'));
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(true);
    });

    test('can toggle node and select on click', async () => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      const node = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.isGroup);
      await expect(node).toEqual(true);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(true);
      expect(await idsTree.evaluate((el: IdsTree) => el.isSelected('#public-folders'))).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.nodeContainer!.click());
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(false);
      expect(await idsTree.evaluate((el: IdsTree) => el.isSelected('#public-folders'))).toEqual(true);
    });

    test('can prevent keys', async () => {
      const keys = ['home', 'public-folders', 'leadership', 'history', 'careers-last', 'icons', 'audio'];
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree, key: any) => el.getNode(`#${key[1]}`)!.expanded, keys);
      await expect(nodeExpanded).toEqual(true);
      await idsTree.evaluate((el: IdsTree, key: any) => {
        let event = new KeyboardEvent('keydown', { code: 'Space' });
        el.getNode(`#${key[1]}`)!.nodeContainer!.dispatchEvent(event);
        el.getNode(`#${key[1]}`)!.nodeContainer!.dispatchEvent(event);
        event = new KeyboardEvent('keydown', { code: 'Test' });
        el.getNode(`#${key[1]}`)!.nodeContainer!.dispatchEvent(event);
        el.getNode(`#${key[3]}`)!.nodeContainer!.dispatchEvent(event);
      }, keys);
      nodeExpanded = await idsTree.evaluate((el: IdsTree, key: any) => el.getNode(`#${key[1]}`)!.expanded, keys);
      await expect(nodeExpanded).toEqual(true);
      await idsTree.evaluate((el: IdsTree, key: any) => {
        const event = new KeyboardEvent('keyup', { code: 'Test' });
        el.getNode(`#${key[1]}`)!.nodeContainer!.dispatchEvent(event);
        el.getNode(`#${key[3]}`)!.nodeContainer!.dispatchEvent(event);
      }, keys);
      nodeExpanded = await idsTree.evaluate((el: IdsTree, key: any) => el.getNode(`#${key[1]}`)!.expanded, keys);
      await expect(nodeExpanded).toEqual(true);
    });

    test('can veto before collapse responses', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await page.evaluate(() => {
        const tree = document.querySelector('ids-tree');
        tree?.addEventListener('collapsed', (e: any) => {
          e.detail.response(false); // veto
        });
      });
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      const node = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.isGroup);
      await expect(node).toEqual(true);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(true);
      await idsTree.evaluate((el: IdsTree) => el.collapse('#public-folders'));
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(false);
    });

    test('can trigger collapsed event', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await idsTree.evaluate((tree: IdsTree) => {
        (window as any).isEventTriggered = false;
        tree.addEventListener('collapsed', () => { (window as any).isEventTriggered = true; });
      });

      const node = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.isGroup);
      await expect(node).toEqual(true);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(true);
      await idsTree.evaluate((el: IdsTree) => el.collapse('#public-folders'));
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#public-folders')!.expanded);
      await expect(nodeExpanded).toEqual(false);

      const isEventTriggered = async () => {
        await page.evaluate(() => (window as any).isEventTriggered);
      };
      await expect(isEventTriggered()).toBeTruthy();
    });

    test('can veto before expand responses', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await page.evaluate(() => {
        const tree = document.querySelector('ids-tree');
        tree?.addEventListener('beforeexpanded', (e: any) => {
          e.detail.response(false); // veto
        });
      });
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      const node = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.isGroup);
      await expect(node).toEqual(true);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(nodeExpanded).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.expand('#icons'));
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(nodeExpanded).toEqual(false);
    });

    test('can trigger expand event', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await idsTree.evaluate((tree: IdsTree) => {
        (window as any).isEventTriggered = false;
        tree.addEventListener('expanded', () => { (window as any).isEventTriggered = true; });
      });

      const node = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.isGroup);
      await expect(node).toEqual(true);
      let nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(nodeExpanded).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.expand('#icons'));
      nodeExpanded = await idsTree.evaluate((el: IdsTree) => el.getNode('#icons')!.expanded);
      await expect(nodeExpanded).toEqual(true);

      const isEventTriggered = async () => {
        await page.evaluate(() => (window as any).isEventTriggered);
      };
      await expect(isEventTriggered()).toBeTruthy();
    });

    test('can veto selection response', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await page.evaluate(() => {
        const tree = document.querySelector('ids-tree');
        tree?.addEventListener('beforeselected', (e: any) => {
          e.detail.response(false); // veto
        });
      });
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      let node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.select('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(false);
    });

    test('can trigger selected event', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await idsTree.evaluate((tree: IdsTree) => {
        (window as any).isEventTriggered = false;
        tree.addEventListener('selected', () => { (window as any).isEventTriggered = true; });
      });

      let node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.select('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(true);
      const isEventTriggered = async () => {
        await page.evaluate(() => (window as any).isEventTriggered);
      };
      await expect(isEventTriggered()).toBeTruthy();
    });

    test('can veto unselection response', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await page.evaluate(() => {
        const tree = document.querySelector('ids-tree');
        tree?.addEventListener('beforeunselected', (e: any) => {
          e.detail.response(false); // veto
        });
      });
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      let node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.unselect('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.select('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(true);
      await idsTree.evaluate((el: IdsTree) => el.unselect('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(true);
    });

    test('can trigger unselected event', async ({ page }) => {
      await idsTree.evaluate((el: IdsTree, dtaset: any) => { el.data = dtaset; }, dataset);
      await idsTree.evaluate((tree: IdsTree) => {
        (window as any).isEventTriggered = false;
        tree.addEventListener('unselected', () => { (window as any).isEventTriggered = true; });
      });

      let node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(false);
      await idsTree.evaluate((el: IdsTree) => el.select('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(true);
      await idsTree.evaluate((el: IdsTree) => el.unselect('#leadership'));
      node = await idsTree.evaluate((el: IdsTree) => el.isSelected('#leadership'));
      await expect(node).toEqual(false);
      const isEventTriggered = async () => {
        await page.evaluate(() => (window as any).isEventTriggered);
      };
      await expect(isEventTriggered()).toBeTruthy();
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

    test.skip('should add node to the top/bottom of the tree', async ({ page }) => {
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
        const topNodeDatasourceIndex = elem.data?.findIndex((item) => item.id === 'top-node');
        const bottomNodeDataIndex = elem.nodesData?.findIndex((item) => item.id === 'bottom-node');
        const bottomNodeDatasourceIndex = elem.data?.findIndex((item) => item.id === 'bottom-node');

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
        const firstNode = elem.getNode('#home')!;
        const lastNode = elem.getNode('#contacts')!;
        elem.addNodes([{
          id: 'before-first-node',
          text: 'Before first node'
        }], 'before', firstNode);
        elem.addNodes([{
          id: 'before-last-node',
          text: 'Before last node'
        }], 'before', lastNode);
        elem.addNodes([{
          id: 'after-first-node',
          text: 'After first node'
        }], 'after', firstNode);
        elem.addNodes([{
          id: 'after-last-node',
          text: 'After last node'
        }], 'after', lastNode);

        const beforeFirstNodeDataIndex = elem.nodesData!.findIndex((item) => item.id === 'before-first-node');
        const beforeFirstNodeDatasourceIndex = elem?.data?.findIndex((item) => item.id === 'before-first-node');
        const beforeLastNodeDataIndex = elem.nodesData!.findIndex((item) => item.id === 'before-last-node');
        const beforeLastNodeDatasourceIndex = elem?.data?.findIndex((item) => item.id === 'before-last-node');
        const afterFirstNodeDataIndex = elem.nodesData!.findIndex((item) => item.id === 'after-first-node');
        const afterFirstNodeDatasourceIndex = elem?.data?.findIndex((item) => item.id === 'after-first-node');
        const afterLastNodeDataIndex = elem.nodesData!.findIndex((item) => item.id === 'after-last-node');
        const afterLastNodeDatasourceIndex = elem?.data?.findIndex((item) => item.id === 'after-last-node');

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
      expect(results.afterLastNodeDataIndex).toEqual(46);
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
        const withParentNode = elem!.getNode('#leadership')!;
        elem!.addNodes([{
          id: 'before-node-with-parent',
          text: 'Before node-with-parent'
        }], 'before', withParentNode);
        elem!.addNodes([{
          id: 'after-node-with-parent',
          text: 'After node-with-parent'
        }], 'after', withParentNode);

        const beforeDataIndex = elem!.treeNodes?.findIndex((item) => item.id === 'before-node-with-parent');
        const beforeDatasourceIndex = elem!.data?.[2]?.children?.findIndex((item) => item.id === 'before-node-with-parent');
        const afterDataIndex = elem!.treeNodes?.findIndex((item) => item.id === 'after-node-with-parent');
        const afterDatasourceIndex = elem!.data?.[2]?.children?.findIndex((item) => item.id === 'after-node-with-parent');

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
      const addNodes = async (id: string, data: Array<IdsTreeNodeData>) => {
        await tree.evaluate((elem: IdsTree, arg: { id: string, data: Array<IdsTreeNodeData> }) => {
          const node = elem.getNode(arg.id)!;
          elem.addNodes(arg.data, 'child', node);
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
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item) => item.id === 'home')?.children?.length)).toBe(1);
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item) => item.id === 'home')?.children?.length)).toBe(1);
      await page.getByText('About Us').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('about-us');
      await page.getByText('New node').click();
      expect(await page.evaluate(() => (window as any).nodeData.id)).toBe('newa');
      await addNodes('#home', multiNode);
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item) => item.id === 'home')?.children?.length)).toBe(4);
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item) => item.id === 'home')?.children?.length)).toBe(4);
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
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item) => item.id === 'contacts')?.children?.length)).toBe(4);
      expect(await tree.evaluate((elem: IdsTree) => elem.data.find((item) => item.id === 'contacts')?.children?.length)).toBe(4);
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

    test.skip('should fire selected event with correct data on node click', async ({ page }) => {
      const selectedNode = await page.evaluate(() => {
        let data: any = null;
        const tree = document.querySelector<IdsTree>('ids-tree');
        tree?.addEventListener('selected', (e: any) => {
          data = e.detail.node.data;
        });
        const parentNode = tree!.getNode('#home')!;
        tree!.addNodes([{
          id: 'child-node',
          text: 'Child node'
        }], 'child', parentNode);
        tree?.container?.querySelector<any>('#about-us')?.container?.querySelector('.node-container')?.click();

        return data;
      });

      expect(selectedNode?.id).toEqual('about-us');
    });
  });
});
