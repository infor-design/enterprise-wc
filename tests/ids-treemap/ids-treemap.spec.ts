import AxeBuilder from '@axe-core/playwright';
import { Locator } from '@playwright/test';
import { test, expect } from '../base-fixture';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsTreeMap from '../../src/components/ids-treemap/ids-treemap';

test.describe('IdsTreemap tests', () => {
  let treemap: Locator;
  const url = '/ids-treemap/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Treemap Component');
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
    const el = 'ids-treemap';
    let container: IdsContainer;

    const setupComponent = async (component: any) => {
      await treemap.evaluate((treemapEl: typeof component) => {
        treemapEl.title = 'Storage Utilization (78 GB)';
      });
    };

    const checkProperties = async (component: any) => {
      const title = await treemap.evaluate((treemapEl: typeof component) => treemapEl.title);
      expect(title).toEqual('Storage Utilization (78 GB)');
    };

    test.beforeEach(async ({ page }) => {
      treemap = await page.locator('ids-treemap').first();

      await page.evaluate(() => {
        container = document.createElement('ids-container') as IdsContainer;
        document.body.appendChild(container);
      });
    });

    test.skip('can resize the width when the viewport changes', async ({ page }) => {
      // removes the padding of the ids-container and return the tree map width
      await page.evaluate(() => { document.querySelector<IdsContainer>('ids-container')!.padding = '0'; });
      let currWidth = await treemap.evaluate((element: IdsTreeMap) => element.width);
      expect(currWidth).toBeInAllowedBounds(page.viewportSize()!.width, 5);

      let expWidth = 589;
      await page.setViewportSize({ width: expWidth, height: 9999 });
      await page.waitForFunction((width) => (window.innerWidth === width), expWidth);
      currWidth = await treemap.evaluate((element: IdsTreeMap) => element.width);
      expect(currWidth).toBeInAllowedBounds(expWidth, 5);

      expWidth = 989;
      await page.setViewportSize({ width: expWidth, height: 9999 });
      await page.waitForFunction((width) => (window.innerWidth === width), expWidth);
      currWidth = await treemap.evaluate((element: IdsTreeMap) => element.width);
      expect(currWidth).toBeInAllowedBounds(expWidth, 5);
    });

    test('can render via document.createElement (append early)', async ({ page }) => {
      const element = await page.evaluate(async () => {
        document.body.appendChild(container);
        const elem: any = document.createElement('ids-treemap') as IdsTreeMap;
        container.appendChild(elem);
        return elem;
      });

      await setupComponent(element);
      await checkProperties(element);
    });

    test('can render via document.createElement (append late)', async ({ page }) => {
      const element = await page.evaluate(async (id) => {
        document.body.appendChild(container);
        const elem: any = document.createElement('ids-treemap') as IdsTreeMap;
        document.querySelector<typeof element>(id)!.title = 'Storage Utilization (78 GB)';
        container.appendChild(elem);
        return elem;
      }, el);

      await checkProperties(element);
    });

    test('can render html template', async ({ page }) => {
      const element = await page.evaluate(async () => {
        document.body.innerHTML = '';
        document.body.appendChild(container);
        const elem: any = document.createElement('ids-treemap') as IdsTreeMap;
        container.insertAdjacentHTML('beforeend', `<ids-treemap title="Storage Utilization (78 GB)"></ids-treemap>`);
        return elem;
      });
      await checkProperties(element);
    });

    test('can set the treemap title', async () => {
      let title = await treemap.evaluate((treemapEl: IdsTreeMap) => treemapEl.title);
      expect(title).toEqual('Storage Utilization (78 GB)');

      await treemap.evaluate((treemapEl: IdsTreeMap) => {
        treemapEl.title = 'New Title';
      });
      title = await treemap.evaluate((treemapEl: IdsTreeMap) => treemapEl.title);
      expect(title).toEqual('New Title');

      await treemap.evaluate((treemapEl: IdsTreeMap) => treemapEl.removeAttribute('title'));
      title = await treemap.evaluate((treemapEl: IdsTreeMap) => treemapEl.title);
      expect(title).toBe('');
      await expect(treemap).not.toHaveAttribute('title');
    });

    test('can set the treemap height', async () => {
      await treemap.evaluate((treemapEl: IdsTreeMap) => {
        treemapEl.height = 300;
      });
      const height = await treemap.evaluate((treemapEl: IdsTreeMap) => treemapEl.height);
      expect(height).toBe(300);
    });

    test('can set the treemap width', async () => {
      expect(await treemap.evaluate((treemapEl: IdsTreeMap) => {
        treemapEl.width = 300;
        return treemapEl.width;
      })).toEqual(300);
    });
  });
});
