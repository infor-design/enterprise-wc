import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsHierarchy from '../../src/components/ids-hierarchy/ids-hierarchy';
import IdsHierarchyItem from '../../src/components/ids-hierarchy/ids-hierarchy-item';
import IdsHierarchyLegendItem from '../../src/components/ids-hierarchy/ids-hierarchy-legend-item';

test.describe('IdsHierarchy tests', () => {
  const url = '/ids-hierarchy/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Hierarchy Component');
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
      const handle = await page.$('ids-hierarchy');
      const html = await handle?.evaluate((el: IdsHierarchy) => el?.outerHTML);
      await expect(html).toMatchSnapshot('hierarchy-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-hierarchy');
      const html = await handle?.evaluate((el: IdsHierarchy) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('hierarchy-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-hierarchy-light');
    });
  });

  test.describe('functionality test', async () => {
    test('can set/get the expanded attribute', async ({ page }) => {
      const hierarchy = await page.locator('ids-hierarchy-item').first();

      await expect(hierarchy).toHaveAttribute('expanded');
      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.setAttribute('expanded', 'false');
        return item.expanded;
      })).toBeNull();
      await expect(hierarchy).not.toHaveAttribute('expanded');

      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.expanded = 'true';
        return item.expanded;
      })).toBeTruthy();
      await expect(hierarchy).toHaveAttribute('expanded', 'true');

      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.expanded = null;
        return item.expanded;
      })).toBeNull();
      await expect(hierarchy).not.toHaveAttribute('expanded');
    });

    test('can set/get the root-item attribute', async ({ page }) => {
      const hierarchy = await page.locator('ids-hierarchy-item').first();

      await expect(hierarchy).toHaveAttribute('root-item');
      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.setAttribute('root-item', 'false');
        return item.rootItem;
      })).toBeNull();
      await expect(hierarchy).not.toHaveAttribute('root-item');

      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.rootItem = 'true';
        return item.rootItem;
      })).toBeTruthy();
      await expect(hierarchy).toHaveAttribute('root-item', 'true');

      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.rootItem = null;
        return item.rootItem;
      })).toBeNull();
      await expect(hierarchy).not.toHaveAttribute('root-item');
    });

    test('can set/get the selected attribute', async ({ page }) => {
      const hierarchy = await page.locator('ids-hierarchy-item').first();

      await expect(hierarchy).not.toHaveAttribute('selected');
      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.setAttribute('selected', 'false');
        return item.selected;
      })).toBeFalsy();
      await expect(hierarchy).not.toHaveAttribute('selected');

      await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.selected = 'true';
      });
      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => item.selected)).toBeTruthy();
      await expect(hierarchy).toHaveAttribute('selected', 'true');

      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => {
        item.selected = null as any;
        return item.selected;
      })).toBeFalsy();
      await expect(hierarchy).not.toHaveAttribute('selected');
    });

    test('can expand and collapse items when clicked', async ({ page }) => {
      const hierarchy = await page.locator('ids-hierarchy-item').first();
      const idsbutton = await hierarchy.locator('#icon-only-button-default button').first();

      await idsbutton.click();
      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => item.expanded)).toBeFalsy();
      await expect(hierarchy).not.toHaveAttribute('expanded');

      await idsbutton.click();
      expect(await hierarchy.evaluate((item: IdsHierarchyItem) => item.expanded)).toBeTruthy();
      await expect(hierarchy).toHaveAttribute('expanded');
    });

    test('can select an item when touchstart', async ({ browser }) => {
      const newPage = await browser.newPage({
        hasTouch: true,
        isMobile: true,
        viewport: {
          width: 430,
          height: 932
        }
      });

      await newPage.goto('/ids-hierarchy/example.html');

      const hierarchyItem = await newPage.locator('#item-1').first();
      const itemLeaf = await hierarchyItem.locator('div[part="leaf"]').first();

      expect(await hierarchyItem.evaluate((element: IdsHierarchyItem) => element.selected)).toBeFalsy();
      await expect(hierarchyItem).not.toHaveAttribute('selected');

      const box = await itemLeaf.boundingBox();
      await newPage.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);

      expect(await hierarchyItem.evaluate((element: IdsHierarchyItem) => element.selected)).toBeTruthy();
      await expect(hierarchyItem).toHaveAttribute('selected');

      await newPage.close();
    });

    test('checks for nested items', async ({ page }) => {
      const hierarchy = await page.locator('ids-hierarchy-item').first();
      const container = await hierarchy.locator('div.has-nested-items').first();

      await hierarchy.waitFor();
      await expect(container).toBeAttached();
    });

    test('can set/get the legend item text attribute', async ({ page }) => {
      const hierarchy = await page.locator('ids-hierarchy-legend-item').first();

      await expect(hierarchy).toHaveAttribute('text');
      expect(await hierarchy.evaluate((item: IdsHierarchyLegendItem) => {
        item.setAttribute('text', 'false');
        return item.text;
      })).toEqual('false');
      await expect(hierarchy).toHaveAttribute('text');

      expect(await hierarchy.evaluate((item: IdsHierarchyLegendItem) => {
        item.text = 'true';
        return item.text;
      })).toBeTruthy();
      await expect(hierarchy).toHaveAttribute('text', 'true');

      expect(await hierarchy.evaluate((item: IdsHierarchyLegendItem) => {
        item.text = null;
        return item.text;
      })).toBeNull();
      await expect(hierarchy).not.toHaveAttribute('text');
    });
  });
});
