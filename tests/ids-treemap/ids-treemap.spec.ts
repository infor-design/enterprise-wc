import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsTreeMap from '../../src/components/ids-treemap/ids-treemap';

test.describe('IdsTreemap tests', () => {
  let treemap: any;
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
      await page.setViewportSize({ width: 589, height: 9999 });
      let treemapWidth = await page.evaluate(`document.querySelector("ids-treemap").width`);
      let containerWidth = await page.evaluate(`document.querySelector("ids-treemap").container.offsetWidth`);
      expect(treemapWidth).toEqual(containerWidth);

      await page.setViewportSize({ width: 989, height: 9999 });
      treemapWidth = await page.evaluate(`document.querySelector("ids-treemap").width`);
      containerWidth = await page.evaluate(`document.querySelector("ids-treemap").container.offsetWidth`);
      expect(treemapWidth).toEqual(containerWidth);
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

    test('can set the treemap width', async ({ page }) => {
      const tmContainer = await page.locator('ids-container').first();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      const tmWidth = await tmContainer.evaluate((treemapEl: IdsTreeMap) => { treemapEl.offsetWidth as number; });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      const width = await treemap.evaluate((treemapEl: IdsTreeMap) => { treemapEl.offsetWidth as number; });
      expect(tmWidth).toBe(width);
    });
  });
});
