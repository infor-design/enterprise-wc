import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import type IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import type IdsTooltip from '../../src/components/ids-tooltip/ids-tooltip';

test.describe('IdsDataGrid tooltip tests', () => {
  const url = '/ids-data-grid/tooltip.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functionality tests', () => {
    test('shows tooltip on hover', async ({ page }) => {
      const waitForTooltip = async () => {
        await page.waitForFunction(() => {
          const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid');
          const tooltip = dataGrid?.shadowRoot?.querySelector<IdsTooltip>('ids-tooltip');
          return tooltip?.visible;
        });
      };
      const checkTooltipText = async () => {
        const results = await page.evaluate(() => {
          const tooltip = document.querySelector<IdsDataGrid>('ids-data-grid')?.shadowRoot?.querySelector<IdsTooltip>('ids-tooltip');
          return tooltip?.textContent;
        });
        return results;
      };

      // shows tooltip with custom content for header title
      let selector = 'ids-data-grid .ids-data-grid-header-cell[aria-colindex="3"] .ids-data-grid-header-text';
      let hoverTarget = await page.locator(selector);
      await hoverTarget.hover();
      expect(await hoverTarget.textContent()).toContain('Custom Tooltip');
      await waitForTooltip();
      expect(await checkTooltipText()).toBe('This is the product Id header');

      // shows tooltip with custom content for body cell
      selector = 'ids-data-grid ids-data-grid-row[data-index="0"] ids-data-grid-cell[aria-colindex="3"]';
      hoverTarget = await page.locator(selector);
      await hoverTarget.hover();
      await waitForTooltip();
      expect(await checkTooltipText()).toBe('This is a product Id');

      // shows tooltip with text content for header title
      selector = 'ids-data-grid .ids-data-grid-header-cell[aria-colindex="4"] .ids-data-grid-header-text';
      hoverTarget = await page.locator(selector);
      await hoverTarget.hover();
      await waitForTooltip();
      expect(await checkTooltipText()).toBe('Text: Tooltip CallbackHeader Row: 0, Cell: 3');

      // shows tooltip with text content for body cell
      selector = 'ids-data-grid ids-data-grid-row[data-index="0"] ids-data-grid-cell[aria-colindex="4"]';
      hoverTarget = await page.locator(selector);
      await hoverTarget.hover();
      await waitForTooltip();
      expect(await checkTooltipText()).toBe('Text: Greenfor Row: 0, Cell: 3');

      // shows tooltip with text content for header icon
      selector = 'ids-data-grid .ids-data-grid-header-cell[aria-colindex="7"] .ids-data-grid-header-icon';
      hoverTarget = await page.locator(selector);
      await hoverTarget.hover();
      await waitForTooltip();
      expect(await checkTooltipText()).toBe('This is header icon');

      // shows tooltip with custom content for filter button
      selector = 'ids-data-grid .ids-data-grid-header-cell[aria-colindex="3"] ids-menu-button';
      hoverTarget = await page.locator(selector);
      await hoverTarget.hover();
      await waitForTooltip();
      expect(await checkTooltipText()).toBe('This is the product Id filterButton');

      // shows tooltip with header groups
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.suppressTooltips = true;
        elem.suppressTooltips = false;
        elem.columnGroups = [{
          colspan: 3,
          id: 'group1',
          name: 'Column Group One',
          align: 'center'
        }, {
          colspan: 2,
          id: 'group2',
          name: 'Column Group Two',
          headerIcon: 'error',
        }, {
          colspan: 4,
          id: 'group3',
          name: 'Column Group Three',
          align: 'right'
        }];
        elem.redraw();
      });
      selector = 'ids-data-grid [column-group-id="group2"] .ids-data-grid-header-icon';
      hoverTarget = await page.locator(selector);
      await hoverTarget.hover();
      await waitForTooltip();
      expect(await checkTooltipText()).toBe('error');
    });
  });

  test.describe('event tests', () => {
    test('should trigger beforetooltipshow and showtooltip events', async ({ page }) => {
      const waitForTooltip = async () => {
        await page.waitForFunction(() => {
          const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid');
          const tooltip = dataGrid?.shadowRoot?.querySelector<IdsTooltip>('ids-tooltip');
          return tooltip?.visible;
        });
      };
      await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid');
        (window as any).beforetooltipshowTriggered = false;
        (window as any).showtooltipTriggered = false;
        dataGrid?.addEventListener('beforetooltipshow', () => {
          (window as any).beforetooltipshowTriggered = true;
        });
        dataGrid?.addEventListener('showtooltip', () => {
          (window as any).showtooltipTriggered = true;
        });
      });

      const hoverTarget = await page.locator('ids-data-grid .ids-data-grid-header-cell[aria-colindex="3"] .ids-data-grid-header-text');
      await hoverTarget.hover();
      await waitForTooltip();
      const beforetooltipshowTriggered = await page.evaluate(() => (window as any).beforetooltipshowTriggered);
      expect(await beforetooltipshowTriggered).toBeTruthy();
      const showtooltipTriggered = await page.evaluate(() => (window as any).showtooltipTriggered);
      expect(await showtooltipTriggered).toBeTruthy();
    });
  });
});
