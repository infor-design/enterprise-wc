import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsSplitter from '../../src/components/ids-splitter/ids-splitter';
import IdsSplitterPane from '../../src/components/ids-splitter/ids-splitter-pane';

test.describe('IdsSplitter tests', () => {
  const url = '/ids-splitter/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Splitter Component');
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
      const handle = await page.$('ids-splitter');
      const html = await handle?.evaluate((el: IdsSplitter) => el?.outerHTML);
      await expect(html).toMatchSnapshot('splitter-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-splitter');
      const html = await handle?.evaluate((el: IdsSplitter) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('splitter-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-splitter-light');
    });
  });

  test.describe('functionality tests', () => {
    test('should expand and collapse the splitter', async ({ page }) => {
      await page.goto('/ids-splitter/expand-collapse.html');
      const btn = await page.locator('#expand-collapse-btn');
      const leftPane = await page.locator('#left-pane');
      await btn.click();
      await expect(leftPane).toHaveAttribute('collapsed');
      await btn.click();
      await expect(leftPane).not.toHaveAttribute('collapsed');
      expect(await leftPane.getAttribute('style')).toContain('width: 75%');
      // resize to have a collapsed pane
      const resizer = await page.locator('ids-splitter ids-draggable').first();
      await resizer.hover();
      await page.mouse.down();
      await page.mouse.move(0, 0);
      await page.mouse.up();
      expect(await leftPane.getAttribute('style')).toContain('width: 0%');
      await expect(leftPane).toHaveAttribute('collapsed');
      await btn.click();
      await expect(leftPane).not.toHaveAttribute('collapsed');
      expect(await leftPane.getAttribute('style')).toContain('width: 75%');
    });

    test('can use drag to move', async ({ page }) => {
      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('30%');
      await page.locator('ids-splitter #split-1').first().hover();
      await page.mouse.down();
      await page.mouse.move(100, 0);
      await page.locator('ids-splitter #split-1').first().hover();
      await page.mouse.up();

      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('8.25%');

      await page.locator('ids-splitter #split-1').first().hover();
      await page.mouse.down();
      await page.mouse.move(140, 0);
      await page.locator('ids-splitter #split-1').first().hover();
      await page.mouse.up();

      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('13.25%');
    });

    test('can use drag to move in rtl', async ({ page }) => {
      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLanguage('ar');
      });

      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('30%');
      await page.locator('ids-splitter #split-1').first().hover();
      await page.mouse.down();
      await page.mouse.move(740, 0);
      await page.locator('ids-splitter #split-1').first().hover();
      await page.mouse.up();

      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('63.375%');

      await page.locator('ids-splitter #split-1').first().hover();
      await page.mouse.down();
      await page.mouse.move(700, 0);
      await page.locator('ids-splitter #split-1').first().hover();
      await page.mouse.up();

      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('68.125%');
    });

    test('should be able to set axis', async ({ page }) => {
      expect(await page.locator('ids-splitter').first().getAttribute('axis')).toEqual(null);

      let axisVal = await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.axis);
      expect(axisVal).toEqual('x');

      await page.evaluate(() => {
        document.querySelector<IdsSplitter>('ids-splitter')!.axis = 'y';
      });
      axisVal = await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.axis);
      expect(axisVal).toEqual('y');
      expect(await page.locator('ids-splitter').first().getAttribute('axis')).toEqual('y');
      expect(axisVal).toEqual('y');

      await page.evaluate(() => {
        document.querySelector<IdsSplitter>('ids-splitter')!.axis = 'x';
      });
      axisVal = await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.axis);
      expect(axisVal).toEqual('x');
      expect(await page.locator('ids-splitter').first().getAttribute('axis')).toEqual('x');
      expect(axisVal).toEqual('x');
    });

    test('should be able to set disabled', async ({ page }) => {
      expect(await page.locator('ids-splitter').first().getAttribute('disabled')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.disabled)).toEqual(false);

      await page.evaluate(() => {
        document.querySelector<IdsSplitter>('ids-splitter')!.disabled = true;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('disabled')).toEqual('');
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.disabled)).toEqual(true);

      await page.evaluate(() => {
        document.querySelector<IdsSplitter>('ids-splitter')!.disabled = false;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('disabled')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.disabled)).toEqual(false);

      await page.evaluate(() => {
        (document.querySelector<IdsSplitter>('ids-splitter') as any)!.disabled = null;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('disabled')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.disabled)).toEqual(false);
    });

    test('should be able to set splitter to save position', async ({ page }) => {
      expect(await page.locator('ids-splitter').first().getAttribute('save-position')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.savePosition)).toEqual(false);

      await page.evaluate(() => {
        (document.querySelector<IdsSplitter>('ids-splitter') as any)!.savePosition = true;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('save-position')).toEqual('');
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.savePosition)).toEqual(true);

      await page.evaluate(() => {
        ((document.querySelector<IdsSplitter>('ids-splitter') as any)! as any).savePosition = null;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('save-position')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.savePosition)).toEqual(false);
    });

    test('should set splitter uniqueId', async ({ page }) => {
      expect(await page.locator('ids-splitter').first().getAttribute('unique-id')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.uniqueId)).toEqual(null);

      await page.evaluate(() => {
        ((document.querySelector<IdsSplitter>('ids-splitter') as any)! as any).uniqueId = 'some-uniqueid';
      });
      expect(await page.locator('ids-splitter').first().getAttribute('unique-id')).toEqual('some-uniqueid');
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.uniqueId)).toEqual('some-uniqueid');

      await page.evaluate(() => {
        ((document.querySelector<IdsSplitter>('ids-splitter') as any)! as any).uniqueId = null;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('unique-id')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.uniqueId)).toEqual(null);
    });

    test('should check if can save position to local storage', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter unique-id="some-uniqueid" save-position>
          <ids-splitter-pane id="p1"></ids-splitter-pane>
          <ids-splitter-pane id="p2"></ids-splitter-pane>
        </ids-splitter>`;
      });

      await page.waitForLoadState();

      expect(await page.evaluate(() => {
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        splitter.clearPosition();
        return localStorage.getItem(splitter.idTobeUsed('some-uniqueid'));
      })).toEqual(null);

      expect(await page.evaluate(() => {
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        const splitBar = splitter.getAllPairs()[0].splitBar;
        const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
        splitBar.dispatchEvent(event);
        splitter.clearPosition();
        return localStorage.getItem(splitter.idTobeUsed('some-uniqueid'));
      })).toEqual(null);
    });

    test('should set label to splitter', async ({ page }) => {
      expect(await page.locator('ids-splitter').first().getAttribute('label')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.label)).toEqual('Resize');

      await page.evaluate(() => {
        document.querySelector<IdsSplitter>('ids-splitter')!.label = 'Custom Resize Text';
      });
      expect(await page.locator('ids-splitter').first().getAttribute('label')).toEqual('Custom Resize Text');
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.label)).toEqual('Custom Resize Text');

      await page.evaluate(() => {
        (document.querySelector<IdsSplitter>('ids-splitter') as any)!.label = null;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('label')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.label)).toEqual('Resize');
    });

    test('should set resize on drag end to splitter', async ({ page }) => {
      expect(await page.locator('ids-splitter').first().getAttribute('resize-on-drag-end')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.resizeOnDragEnd)).toEqual(false);

      await page.evaluate(() => {
        document.querySelector<IdsSplitter>('ids-splitter')!.resizeOnDragEnd = true;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('resize-on-drag-end')).toEqual('');
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.resizeOnDragEnd)).toEqual(true);

      await page.evaluate(() => {
        document.querySelector<IdsSplitter>('ids-splitter')!.resizeOnDragEnd = false;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('resize-on-drag-end')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.resizeOnDragEnd)).toEqual(false);

      await page.evaluate(() => {
        (document.querySelector<IdsSplitter>('ids-splitter') as any)!.resizeOnDragEnd = null;
      });
      expect(await page.locator('ids-splitter').first().getAttribute('resize-on-drag-end')).toEqual(null);
      expect(await page.evaluate(() => document.querySelector<IdsSplitter>('ids-splitter')!.resizeOnDragEnd)).toEqual(false);
    });

    test('should set initial size', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter id="test">
          <ids-splitter-pane id="p1" size="30%"></ids-splitter-pane>
          <ids-splitter-pane id="p2"></ids-splitter-pane>
        </ids-splitter>`;
      });

      const splitterSizes = await page.evaluate(() => {
        const splitter = document.querySelector('#test')!;
        return [
          splitter.querySelector<IdsSplitterPane>('#p1')!.style.width,
          splitter.querySelector<IdsSplitterPane>('#p2')!.style.width
        ];
      });
      expect(splitterSizes[0]).toEqual('30%');
      expect(splitterSizes[1]).toEqual('70%');
    });

    test('should set size', async ({ page }) => {
      await page.evaluate(() => {
        document.querySelector<IdsSplitterPane>('#p1')!.size = '20%';
      });

      const splitterSizes = await page.evaluate(() => [
        document.querySelector<IdsSplitterPane>('#p1')!.style.width,
        document.querySelector<IdsSplitterPane>('#p1')!.size,
        document.querySelector<IdsSplitterPane>('#p2')!.style.width
      ]);
      expect(splitterSizes[0]).toEqual('20%');
      expect(splitterSizes[1]).toEqual('20%');
      expect(splitterSizes[2]).toEqual('80%');
    });

    test('should set collapsed', async ({ page }) => {
      await page.evaluate(() => {
        document.querySelector<IdsSplitterPane>('#p1')!.collapsed = true;
      });

      const splitterSizes = await page.evaluate(() => [
        document.querySelector<IdsSplitterPane>('#p1')!.style.width,
        document.querySelector<IdsSplitterPane>('#p1')!.size,
        document.querySelector<IdsSplitterPane>('#p2')!.style.width
      ]);
      expect(splitterSizes[0]).toEqual('0%');
      expect(splitterSizes[1]).toEqual('0%');
      expect(splitterSizes[2]).toEqual('100%');

      await page.evaluate(() => {
        document.querySelector<IdsSplitterPane>('#p1')!.collapsed = false;
      });

      const splitterSizes2 = await page.evaluate(() => [
        document.querySelector<IdsSplitterPane>('#p1')!.style.width,
        document.querySelector<IdsSplitterPane>('#p1')!.size,
        document.querySelector<IdsSplitterPane>('#p2')!.style.width
      ]);
      expect(splitterSizes2[0]).toEqual('30%');
      expect(splitterSizes2[1]).toEqual('30%');
      expect(splitterSizes2[2]).toEqual('70%');
    });

    test('should set initial size and minimum size', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter id="test">
          <ids-splitter-pane id="p1" min-size="10%" size="40%"></ids-splitter-pane>
          <ids-splitter-pane id="p2"></ids-splitter-pane>
        </ids-splitter>`;
      });

      const splitterSizes = await page.evaluate(() => {
        const splitter = document.querySelector('#test')!;
        return [
          splitter.querySelector<IdsSplitterPane>('#p1')!.style.width,
          splitter.querySelector<IdsSplitterPane>('#p2')!.style.width
        ];
      });
      expect(splitterSizes[0]).toEqual('40%');
      expect(splitterSizes[1]).toEqual('60%');
    });

    test.skip('should set minimum and maximum size', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter id="test">
          <ids-splitter-pane id="p1" min-size="10%" max-size="80%"></ids-splitter-pane>
          <ids-splitter-pane id="p2"></ids-splitter-pane>
        </ids-splitter>`;
      });

      const splitterSizes = await page.evaluate(() => {
        const splitter = document.querySelector('#test')!;
        return [
          splitter.querySelector<IdsSplitterPane>('#p1')!.style.width,
          splitter.querySelector<IdsSplitterPane>('#p2')!.style.width,
          (splitter as any).minSizes(),
          (splitter as any).maxSizes(),
        ];
      });
      expect(splitterSizes[0]).toEqual('50%');
      expect(splitterSizes[1]).toEqual('50%');
      expect(splitterSizes[2]).toEqual([10, 0]);
      expect(splitterSizes[3]).toEqual([80]);
    });

    test('should set minimum and maximum size extra cases', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.evaluate(() => {
        document.body.innerHTML = `
        <ids-splitter id="splitter-1">
          <ids-splitter-pane min-size="110%"></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>
        <ids-splitter>
          <ids-splitter-pane min-size="50%"></ids-splitter-pane>
          <ids-splitter-pane min-size="55%"></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>
        <ids-splitter align="end">
          <ids-splitter-pane></ids-splitter-pane>
          <ids-splitter-pane min-size="85%" size="10%"></ids-splitter-pane>
          <ids-splitter-pane min-size="5%" size="10%"></ids-splitter-pane>
        </ids-splitter>
        <ids-splitter>
          <ids-splitter-pane max-size="30%" size="40%"></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>
        <ids-splitter>
          <ids-splitter-pane max-size="30%" min-size="40%"></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>
        <ids-splitter>
          <ids-splitter-pane max-size="30%" min-size="40%" size="10%"></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>
        <ids-splitter>
          <ids-splitter-pane max-size="110%"></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>
        <ids-splitter>
          <ids-splitter-pane size="20%"></ids-splitter-pane>
          <ids-splitter-pane size="80%"></ids-splitter-pane>
        </ids-splitter>
        <ids-splitter>
          <ids-splitter-pane size="100px"></ids-splitter-pane>
          <ids-splitter-pane size="80"></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>`;
      });

      await page.evaluate(() => {
        const splitter = document.querySelector('#splitter-1') as any;
        splitter.disabled = true;
      });
      await expect(exceptions).toBeNull();
    });

    test.skip('should be able to set multiple splits', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `
        <ids-splitter>
          <ids-splitter-pane></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>`;
      });

      await expect(await page.evaluate(() => (document.querySelector('ids-splitter') as any).container.querySelectorAll('.splitter-dragger').length)).toEqual(3);
    });

    test('should be able set nested splitters', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter>
          <ids-splitter-pane></ids-splitter-pane>
          <ids-splitter-pane id="nested-splitter-pane">
            <ids-splitter axis="y">
              <ids-splitter-pane></ids-splitter-pane>
              <ids-splitter-pane></ids-splitter-pane>
            </ids-splitter>
          </ids-splitter-pane>
        </ids-splitter>`;
      });

      await page.waitForLoadState();

      const values = await page.evaluate(() => {
        const elem = document.querySelector('ids-splitter')!.querySelector('#nested-splitter-pane ids-splitter') as any;
        const splitBars = elem.container.querySelectorAll('.splitter-dragger');

        return [
          elem.axis,
          splitBars.length,
          splitBars[0].getAttribute('aria-orientation')
        ];
      });

      await page.waitForLoadState();
      expect(values[0]).toEqual('y');
      expect(values[1]).toEqual(1);
      expect(values[2]).toEqual('vertical');
    });

    test('should render collapsed', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter id="test">
          <ids-splitter-pane id="p1" collapsed></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>`;
      });
      await page.waitForLoadState();

      expect(await page.locator('#p1').first().getAttribute('collapsed')).toEqual('true');
    });

    test('should render collapsed and disabled', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter disabled>
          <ids-splitter-pane id="p1" collapsed></ids-splitter-pane>
          <ids-splitter-pane id="p2"></ids-splitter-pane>
        </ids-splitter>`;
      });

      await page.waitForLoadState();
      const value = await page.evaluate(() => {
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        splitter.collapse({ startPane: '#p1', endPane: '#p2' });
        return splitter.querySelector('#p1')!.getAttribute('collapsed');
      });

      expect(value).toEqual('true');

      const value2 = await page.evaluate(() => {
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        splitter.expand();
        return splitter.querySelector('#p1')!.getAttribute('collapsed');
      });

      expect(value2).toEqual('true');
    });

    test.skip('should render on slot change', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter>
          <ids-splitter-pane></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>`;
      });

      await page.waitForLoadState();
      expect(await page.locator('.splitter-dragger').count()).toEqual(1);

      await page.evaluate(() => {
        const template = document.createElement('template');
        template.innerHTML = '<ids-splitter-pane></ids-splitter-pane>';
        document.querySelector<IdsSplitter>('ids-splitter')!.appendChild(template.content.cloneNode(true));
      });

      await page.waitForLoadState();
      expect(await page.locator('.splitter-dragger').count()).toEqual(2);
    });

    test.skip('should set collapse and expand', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter>
          <ids-splitter-pane id="p1"></ids-splitter-pane>
          <ids-splitter-pane id="p2"></ids-splitter-pane>
        </ids-splitter>`;
      });

      await page.waitForLoadState();

      let value = await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter>
          <ids-splitter-pane id="p1"></ids-splitter-pane>
          <ids-splitter-pane id="p2"></ids-splitter-pane>
        </ids-splitter>`;

        const splitter = document.querySelector('ids-splitter') as IdsSplitter;
        return splitter.querySelector('#p1')!.getAttribute('collapsed');
      });

      expect(value).toEqual(null);

      await page.waitForLoadState();

      value = await page.evaluate(() => {
        const splitter = document.querySelector('ids-splitter') as IdsSplitter;
        splitter.collapse({ startPane: '#p1', endPane: '#p2' });
        return splitter.querySelector('#p1')!.getAttribute('collapsed');
      });
      expect(value).toEqual('true');

      value = await page.evaluate(() => {
        const splitter = document.querySelector('ids-splitter') as IdsSplitter;
        splitter.expand({ startPane: '#p1', endPane: '#p2' });
        return splitter.querySelector('#p1')!.getAttribute('collapsed');
      });
      expect(value).toEqual(null);
    });
  });

  test.describe('keyboard tests', () => {
    test('should use arrow keys to move', async ({ page }) => {
      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('30%');
      const btn = await page.locator('ids-splitter ids-draggable').first();
      await btn.focus();
      await btn.press('ArrowRight');
      await btn.press('ArrowRight');
      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('32.5%');
      await btn.press('ArrowLeft');
      await btn.press('ArrowLeft');
      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('30%');
    });

    test('should use arrow keys to move in rtl', async ({ page }) => {
      await page.evaluate(async () => {
        await window?.IdsGlobal?.locale?.setLanguage('ar');
      });

      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('30%');
      const btn = await page.locator('ids-splitter ids-draggable').first();
      await btn.focus();
      await btn.press('ArrowLeft');
      await btn.press('ArrowLeft');
      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('27.5%');
      await btn.press('ArrowRight');
      await btn.press('ArrowRight');
      expect(await page.locator('ids-splitter ids-splitter-pane').first().getAttribute('size')).toEqual('30%');
    });
  });

  test.describe('event tests', () => {
    test('should veto before collapse response', async ({ page }) => {
      await page.evaluate(() => {
        document.body.innerHTML = `<ids-splitter>
          <ids-splitter-pane id="p1"></ids-splitter-pane>
          <ids-splitter-pane></ids-splitter-pane>
        </ids-splitter>`;

        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        splitter.addEventListener('beforecollapsed', (e: any) => {
          e.detail.response(false);
        });

        splitter.collapse({ startPane: '#p1', endPane: '#p2' });
      });
      await page.waitForLoadState();
      expect(await page.locator('#p1').getAttribute('collapsed')).toEqual(null);
    });

    test.skip('should trigger collapsed event', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).noOfColls = 0;
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        splitter?.addEventListener('collapsed', () => { (window as any).noOfColls++; });
        splitter.collapse({ startPane: '#p1', endPane: '#p2' });
      });

      expect(await page.evaluate(() => (window as any).noOfColls)).toEqual(1);
    });

    test.skip('should trigger expanded event', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).noOfColls = 0;
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        splitter.collapse({ startPane: '#p1', endPane: '#p2' });
        splitter?.addEventListener('expanded', () => { (window as any).noOfColls++; });
        splitter.expand({ startPane: '#p1', endPane: '#p2' });
      });

      expect(await page.evaluate(() => (window as any).noOfColls)).toEqual(1);
    });

    test.skip('should veto before expand response', async ({ page }) => {
      await page.evaluate(() => {
        (window as any).noOfColls = 0;
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        splitter?.addEventListener('beforeexpanded', (e: any) => {
          e.detail.response(false);
        });
        splitter.collapse({ startPane: '#p1', endPane: '#p2' });
        splitter.expand({ startPane: '#p1', endPane: '#p2' });
      });

      expect(await page.locator('#p1').first().getAttribute('collapsed')).toEqual('true');
    });

    test('should veto before size changed response', async ({ page }) => {
      await page.evaluate(() => {
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        splitter?.addEventListener('beforesizechanged', (e: any) => { e.detail.response(false); });
        splitter.collapse({ startPane: '#p1', endPane: '#p2' });
      });

      expect(await page.locator('#p1').getAttribute('collapsed')).toEqual(null);
    });

    test.skip('should trigger size changed event', async ({ page }) => {
      await page.evaluate(async () => {
        (window as any).noOfColls = 0;
        const splitter = document.querySelector<IdsSplitter>('ids-splitter')!;
        await splitter.collapse({ startPane: '#p1', endPane: '#p2' });
        await splitter?.addEventListener('sizechanged', async () => {
          await (window as any).noOfColls++;
        });
        await splitter.expand({ startPane: '#p1', endPane: '#p2' });
        await splitter.collapse({ startPane: '#p1', endPane: '#p2' });
      });
      expect(await page.evaluate(() => (window as any).noOfColls)).toEqual(1);
    });
  });
});
