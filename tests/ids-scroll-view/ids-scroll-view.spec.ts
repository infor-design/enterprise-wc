import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsScrollView from '../../src/components/ids-scroll-view/ids-scroll-view';
import { attributes } from '../../src/core/ids-attributes';

test.describe('IdsScrollView tests', () => {
  const url = '/ids-scroll-view/example.html';
  let element: any;
  let scrollview: any;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    element = 'ids-scroll-view';
    scrollview = await page.locator('ids-scroll-view').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Scroll View Component');
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
        .disableRules(['nested-interactive', 'scrollable-region-focusable'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-scroll-view');
      const html = await handle?.evaluate((el: IdsScrollView) => el?.outerHTML);
      await expect(html).toMatchSnapshot('scroll-view-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-scroll-view');
      const html = await handle?.evaluate((el: IdsScrollView) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('scroll-view-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-scroll-view-light');
    });

    test.describe('e2e tests', () => {
      test('can set loop', async ({ page }) => {
        let scrollviewLoop = await scrollview.evaluate((scrollviewEl: IdsScrollView) => scrollviewEl.loop);
        await expect(scrollview).not.toHaveAttribute(attributes.LOOP);
        await expect(scrollviewLoop).toEqual(false);
        await page.evaluate((id) => {
          document.querySelector<IdsScrollView>(id)!.loop = true;
        }, element);
        scrollviewLoop = await scrollview.evaluate((scrollviewEl: IdsScrollView) => scrollviewEl.loop);
        await expect(scrollview).toHaveAttribute(attributes.LOOP, '');
        await expect(scrollviewLoop).toEqual(true);
        await scrollview.evaluate((scrollviewEl: IdsScrollView) => {
          scrollviewEl.loop = false;
        });
        scrollviewLoop = await scrollview.evaluate((scrollviewEl: IdsScrollView) => scrollviewEl.loop);
        await expect(scrollview).not.toHaveAttribute(attributes.LOOP);
        await expect(scrollviewLoop).toEqual(false);
      });

      test('can set show tooltip', async ({ page }) => {
        let scrollviewTooltip = await scrollview.evaluate((scrollviewEl: IdsScrollView) => scrollviewEl.showTooltip);
        await expect(scrollview).not.toHaveAttribute(attributes.SHOW_TOOLTIP);
        await expect(scrollviewTooltip).toEqual(false);
        await page.evaluate((id) => {
          document.querySelector<IdsScrollView>(id)!.showTooltip = true;
        }, element);
        scrollviewTooltip = await scrollview.evaluate((scrollviewEl: IdsScrollView) => scrollviewEl.showTooltip);
        await expect(scrollview).toHaveAttribute(attributes.SHOW_TOOLTIP, '');
        await expect(scrollviewTooltip).toEqual(true);
        await scrollview.evaluate((scrollviewEl: IdsScrollView) => {
          scrollviewEl.showTooltip = false;
        });
        scrollviewTooltip = await scrollview.evaluate((scrollviewEl: IdsScrollView) => scrollviewEl.showTooltip);
        await expect(scrollview).not.toHaveAttribute(attributes.LOOP);
        await expect(scrollviewTooltip).toEqual(false);
      });

      test('can set suppress controls', async ({ page }) => {
        let scrollviewSuppressControl = await scrollview.evaluate((El: IdsScrollView) => El.suppressControls);
        await expect(scrollview).not.toHaveAttribute(attributes.SUPPRESS_CONTROLS);
        await expect(scrollviewSuppressControl).toEqual(false);
        await page.evaluate((id) => {
          document.querySelector<IdsScrollView>(id)!.suppressControls = true;
        }, element);
        scrollviewSuppressControl = await scrollview.evaluate((El: IdsScrollView) => El.suppressControls);
        await expect(scrollview).toHaveAttribute(attributes.SUPPRESS_CONTROLS, '');
        await expect(scrollviewSuppressControl).toEqual(true);
        await scrollview.evaluate((scrollviewEl: IdsScrollView) => {
          scrollviewEl.suppressControls = false;
        });
        scrollviewSuppressControl = await scrollview.evaluate((El: IdsScrollView) => El.showTooltip);
        await expect(scrollview).not.toHaveAttribute(attributes.LOOP);
        await expect(scrollviewSuppressControl).toEqual(false);
      });
    });

    test('can call control api', async ({ page }) => {
      let slideExpect = await page.evaluate((id) => {
        const selEl = document.querySelector<IdsScrollView>(id)!.controls?.querySelector('.selected');
        return selEl?.getAttribute('data-slide-number');
      }, element);
      await expect(slideExpect).toEqual('0');

      await scrollview.evaluate((El: IdsScrollView) => El.next());
      slideExpect = await page.evaluate((id) => {
        const selEl = document.querySelector<IdsScrollView>(id)!.controls?.querySelector('.selected');
        return selEl?.getAttribute('data-slide-number');
      }, element);
      await expect(slideExpect).toEqual('1');

      await scrollview.evaluate((El: IdsScrollView) => El.previous());
      slideExpect = await page.evaluate((id) => {
        const selEl = document.querySelector<IdsScrollView>(id)!.controls?.querySelector('.selected');
        return selEl?.getAttribute('data-slide-number');
      }, element);
      await expect(slideExpect).toEqual('0');

      await scrollview.evaluate((El: IdsScrollView) => El.last());
      slideExpect = await page.evaluate((id) => {
        const selEl = document.querySelector<IdsScrollView>(id)!.controls?.querySelector('.selected');
        return selEl?.getAttribute('data-slide-number');
      }, element);
      await expect(slideExpect).toEqual('5');

      await scrollview.evaluate((El: IdsScrollView) => El.first());
      slideExpect = await page.evaluate((id) => {
        const selEl = document.querySelector<IdsScrollView>(id)!.controls?.querySelector('.selected');
        return selEl?.getAttribute('data-slide-number');
      }, element);
      await expect(slideExpect).toEqual('0');

      await scrollview.evaluate((El: IdsScrollView) => El.slideTo(2));
      slideExpect = await page.evaluate((id) => {
        const selEl = document.querySelector<IdsScrollView>(id)!.controls?.querySelector('.selected');
        return selEl?.getAttribute('data-slide-number');
      }, element);
      await expect(slideExpect).toEqual('2');
    });

    test('can click the circle buttons', async ({ page }) => {
      const link = await page.locator('[data-slide-number="4"]');
      await expect(link).not.toHaveClass(/selected/);
      await expect(link).not.toHaveAttribute('aria-selected');
      await link.click();
      await expect(link).toHaveClass(/selected/);
      await expect(link).toHaveAttribute('aria-selected');
    });

    test.skip('can click the control area and nothing happens', async ({ page }) => {
      // BUG
      const link = await page.locator('[data-slide-number="0"]');
      const controls = await page.locator('.ids-scroll-view-controls');
      await controls.click();
      await expect(link).toHaveClass(/selected/);
      await expect(link).toHaveAttribute('aria-selected');
    });

    test('can rerender controls based on slotchange events', async ({ page }) => {
      await page.evaluate(() => {
        const html = `<img slot="scroll-view-item" src="../assets/images/camera-1.png" alt="Slide 1, Sony Camera, Front"/>
        <img slot="scroll-view-item" src="../assets/images/camera-2.png" alt="Slide 3, Sony Camera, Back Display"/>
        <img slot="scroll-view-item" src="../assets/images/camera-3.png" alt="Slide 3, Sony Camera, From Top"/>
        <img slot="scroll-view-item" src="../assets/images/camera-4.png" alt="Slide 4, Olympus Camera, Front"/>
        <img slot="scroll-view-item" src="../assets/images/camera-5.png" alt="Slide 5, Olympus Camera, Exposed to water"/>
        <img slot="scroll-view-item" src="../assets/images/camera-6.png" alt="Slide 6, Sony E-mount Camera, Front"/>`;
        document.body.innerHTML = '';
        const elem: any = document.createElement('ids-scroll-view') as IdsScrollView;
        document.body.appendChild(elem);
        elem.innerHTML = html;
      });

      await page.waitForTimeout(1000);

      // const controls = await page.locator('.circle-button').all;
      const controls = await page.evaluate(() => { document.querySelectorAll('.circle-button'); });
      console.log(await controls);
      // await expect(controls.length).toEqual(6);
    });

    test('can moved on ArrowLeft/ArrowRight', async ({ page }) => {
      await page.locator('[data-slide-number="0"]').click();
      const testArrowKey = async (key: string, id: string) => {
        await page.keyboard.down(key);
        const link = await page.locator(`[data-slide-number="${id}"]`);
        await expect(link).toHaveClass(/selected/);
        await expect(link).toHaveAttribute('aria-selected');
      };
      // One back wont do anything
      await testArrowKey('ArrowLeft', '0');
      // key all the way right
      await testArrowKey('ArrowRight', '1');
      await testArrowKey('ArrowRight', '2');
      await testArrowKey('ArrowRight', '3');
      await testArrowKey('ArrowRight', '4');
      await testArrowKey('ArrowRight', '5');
      // One extra wont do anything
      await testArrowKey('ArrowRight', '5');
      await testArrowKey('ArrowLeft', '4');
      await testArrowKey('ArrowLeft', '3');
      await testArrowKey('ArrowLeft', '2');
      await testArrowKey('ArrowLeft', '1');
      await testArrowKey('ArrowLeft', '0');
      await testArrowKey('ArrowLeft', '0');
      await testArrowKey('Enter', '0');
    });
  });
});
