import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCard from '../../src/components/ids-card/ids-card';

test.describe('IdsCard tests', () => {
  const url = '/ids-card/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Card Component');
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
      const handle = await page.$('ids-card');
      const html = await handle?.evaluate((el: IdsCard) => el?.outerHTML);
      await expect(html).toMatchSnapshot('card-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-card');
      const html = await handle?.evaluate((el: IdsCard) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('card-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-card-light');
    });
  });

  test.describe('cards tests', () => {
    test('can set auto-height', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('auto-height');
      await card.evaluate((element: IdsCard) => element.setAttribute('auto-height', 'true'));
      await expect(card).toHaveAttribute('auto-height', 'true');
      await card.evaluate((element: IdsCard) => element.setAttribute('auto-height', 'false'));
      await expect(card).not.toHaveAttribute('auto-height');
      await card.evaluate((element: IdsCard) => { element.autoHeight = 'true'; });
      await expect(card).toHaveAttribute('auto-height', 'true');
      await card.evaluate((element: IdsCard) => { element.autoHeight = 'false'; });
      await expect(card).not.toHaveAttribute('auto-height');
    });

    test('can render auto-fit from an attribute', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('auto-fit');
      await card.evaluate((element: IdsCard) => element.setAttribute('auto-fit', 'true'));
      await expect(card).toHaveAttribute('auto-fit', 'true');
      await card.evaluate((element: IdsCard) => element.setAttribute('auto-fit', 'false'));
      await expect(card).not.toHaveAttribute('auto-fit');
      await card.evaluate((element: IdsCard) => { element.autoFit = true; });
      await expect(card).toHaveAttribute('auto-fit', 'true');
      await card.evaluate((element: IdsCard) => { element.autoFit = false; });
      await expect(card).not.toHaveAttribute('auto-fit', 'true');
    });

    test('can render overflow setting from the api', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      const cardContent = card.locator('div[part="content"]');
      await card.evaluate((element: IdsCard) => { element.overflow = 'hidden'; });
      await expect(card).toHaveAttribute('overflow', 'hidden');
      await expect(cardContent).toHaveClass(/overflow-hidden/);
      await card.evaluate((element: IdsCard) => { element.overflow = 'auto'; });
      await expect(card).not.toHaveAttribute('overflow');
      await expect(cardContent).not.toHaveClass(/overflow-hidden/);
    });

    test('can remove the clickable attribute when reset', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      await card.evaluate((element: IdsCard) => { element.autoHeight = 'true'; });
      await expect(card).toHaveAttribute('auto-height');
      await card.evaluate((element: IdsCard) => { element.autoHeight = 'false'; });
      await expect(card).not.toHaveAttribute('auto-height');
    });

    test('can set no header setting', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('no-header');
      await card.evaluate((element: IdsCard) => { element.noHeader = 'false'; });
      await expect(card).not.toHaveAttribute('no-header', 'true');
    });

    test('can support card selection single', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('selected');
      await expect(card).not.toHaveAttribute('selection');
      await card.evaluate((element: IdsCard) => { element.selection = 'single'; });
      await expect(card).toHaveAttribute('selection', 'single');
      await card.click({ timeout: 300 });
      await expect(card).toHaveAttribute('selected', 'true');
    });

    test('can support card selection multiple', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('selected');
      await expect(card).not.toHaveAttribute('selection');
      await card.evaluate((element: IdsCard) => {
        element.selection = 'multiple';
      });
      await card.click();
      await expect(card.locator('ids-checkbox')).toHaveAttribute('checked', 'true');
      await card.click();
      await expect(card.locator('ids-checkbox')).not.toHaveAttribute('checked');
    });

    test('can trigger selectionchanged event', async ({ page }) => {
      let isEventTriggered = false;
      const card = await page.locator('ids-card').first();
      await expect(card).not.toHaveAttribute('selected');
      await expect(card).not.toHaveAttribute('selection');
      isEventTriggered = await card.evaluate((element: IdsCard) => {
        let isTriggered = false;
        element.selection = 'multiple';
        element.addEventListener('selectionchanged', () => { isTriggered = true; });
        element.dispatchEvent(new Event('click'));
        return isTriggered;
      });
      expect(isEventTriggered).toBeTruthy();
    });

    test('can set css class for footer', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const elem = document.createElement('ids-card') as IdsCard;
        elem.innerHTML = `
          <div slot="card-header"></div>
          <div slot="card-content"></div>
          <div slot="card-footer"></div>
        `;
        document.body.appendChild(elem);
      });
      const card = await page.locator('ids-card');
      await expect(card.locator('div[part="card"]')).toHaveClass(/has-footer/);
    });
  });

  test.describe('actionable ids card', () => {
    test('can allow setting href', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      let href = await card.evaluate((element: IdsCard) => element.href);
      expect(href).toBeNull();
      href = await card.evaluate((element: IdsCard) => {
        element.href = '#section';
        return element.href;
      });
      expect(href).toEqual('#section');
      href = await card.evaluate((element: IdsCard) => {
        element.href = '';
        return element.href;
      });
      expect(href).toBeNull();
    });

    test('can allow setting actionable', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      let act = await card.evaluate((element: IdsCard) => element.actionable);
      act = true;
      expect(act).toBeTruthy();
      act = false;
      expect(act).toBeFalsy();
    });

    test('can allow setting target', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      let expectedTarget = await card.evaluate((element: IdsCard) => element.target);
      expect(expectedTarget).toBeNull();
      expectedTarget = '_blank';
      expect(expectedTarget).toEqual('_blank');
      expectedTarget = null;
      expect(expectedTarget).toBeNull();
    });

    test('can allow setting height', async ({ page }) => {
      const card = await page.locator('ids-card').first();
      let actionableCardHeight: string | null = await card.evaluate((element: IdsCard) => element.height);
      actionableCardHeight = '100';
      expect(actionableCardHeight).toEqual('100');
      actionableCardHeight = null;
      expect(actionableCardHeight).toBeNull();
    });
  });
});
