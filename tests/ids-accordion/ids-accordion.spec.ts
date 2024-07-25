import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsAccordion from '../../src/components/ids-accordion/ids-accordion';
import IdsAccordionPanel from '../../src/components/ids-accordion/ids-accordion-panel';
import IdsAccordionHeader from '../../src/components/ids-accordion/ids-accordion-header';
import IdsIcon from '../../src/components/ids-icon/ids-icon';

test.describe('IdsAccordion tests', () => {
  const url = '/ids-accordion/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Accordion Component');
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
      const handle = await page.$('ids-accordion');
      const html = await handle?.evaluate((el: IdsAccordion) => el?.outerHTML);
      await expect(html).toMatchSnapshot('accordion-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-accordion');
      const html = await handle?.evaluate((el: IdsAccordion) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('accordion-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-accordion-light');
    });
  });

  test.describe('IdsAccordion functionality tests', () => {
    test('reference to accordion panels', async ({ page }) => {
      const accordionPanels = await page.evaluate(() => document.querySelector<IdsAccordion>('ids-accordion')?.panels);
      expect(accordionPanels?.length).toEqual(4);
    });

    test('accordion panels having reference to accordion', async ({ page }) => {
      const accordion = await page.evaluate(() => document.querySelector('ids-accordion'));
      const panelAccordionRef = await page.evaluate(() => document.querySelector<IdsAccordionPanel>('ids-accordion ids-accordion-panel')?.accordion);
      expect(panelAccordionRef).toEqual(accordion);
    });

    test('expanding/collapsing pane when clicked', async ({ page }) => {
      const panelHandle = await page.locator('ids-accordion ids-accordion-panel').first();

      // click header to expand pane and check
      await panelHandle.locator('ids-accordion-header').click();
      await expect(panelHandle.locator('.ids-accordion-pane')).toBeVisible();
      expect(await panelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toBeTruthy();

      // click header to collapse pane and check
      await panelHandle.locator('ids-accordion-header').click();
      await expect(panelHandle.locator('.ids-accordion-pane')).not.toBeVisible();
      expect(await panelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toBeFalsy();
    });

    test('expanding/collapsing pane when pressing Enter', async ({ page }) => {
      const panelHandle = await page.locator('ids-accordion ids-accordion-panel').first();

      // press Enter to expand pane and check
      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); });
      await expect(panelHandle.locator('.ids-accordion-pane')).toBeVisible();
      expect(await panelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toBeTruthy();

      // press Enter to collapse pane and check
      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); });
      await expect(panelHandle.locator('.ids-accordion-pane')).not.toBeVisible();
      expect(await panelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toBeFalsy();
    });

    test('expanding/collapsing pane when pressing Space', async ({ page }) => {
      const panelHandle = await page.locator('ids-accordion ids-accordion-panel').first();

      // press Space to expand pane and check
      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
      await expect(panelHandle.locator('.ids-accordion-pane')).toBeVisible();
      expect(await panelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toBeTruthy();

      // press Space to collapse pane and check
      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' })); });
      await expect(panelHandle.locator('.ids-accordion-pane')).not.toBeVisible();
      expect(await panelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toBeFalsy();
    });

    test('expanding/collapsing pane programatically', async ({ page }) => {
      const panelHandle = await page.locator('ids-accordion ids-accordion-panel').first();

      // set expanded to true to expand panel and check that header is aware of expanded state
      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.expanded = true; });
      await expect(panelHandle.locator('.ids-accordion-pane')).toBeVisible();
      expect(await panelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded && panel.header.expanded)).toBeTruthy();

      // set expanded to false to collapse panel and check that header is aware of collapsed state
      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.expanded = false; });
      await expect(panelHandle.locator('.ids-accordion-pane')).not.toBeVisible();
      expect(await panelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded && panel.header.expanded)).toBeFalsy();
    });

    test('aria-expanded is updated when expanding/collapsing panel', async ({ page }) => {
      const panelHandle = await page.locator('ids-accordion-panel').first();
      const ariaExpandedVal = await panelHandle.evaluate((panel: IdsAccordionPanel) => {
        panel.expanded = true;
        return panel.header.getAttribute('aria-expanded');
      });
      expect(ariaExpandedVal).toEqual('true');
    });

    test('expanding/collapse in allowOnePane mode', async ({ page }) => {
      const accordionHandle = await page.locator('ids-accordion').first();

      // enable allowOnePane Mode
      await accordionHandle.evaluate((accordion: IdsAccordion) => { accordion.allowOnePane = true; });

      // click first and second panel
      const firstPanel = accordionHandle.locator('ids-accordion-panel:nth-child(1)');
      const secondPanel = accordionHandle.locator('ids-accordion-panel:nth-child(2)');
      await firstPanel.click({ noWaitAfter: false });
      await secondPanel.click({ noWaitAfter: false });

      // check that only second panel has expanded state
      expect(await firstPanel.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toEqual(false);
      expect(await secondPanel.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toEqual(true);

      // disable allowOnePane
      await accordionHandle.evaluate((accordion: IdsAccordion) => { accordion.allowOnePane = false; });

      // click first panel, both 1st & 2nd panel should be expanded
      await firstPanel.click({ noWaitAfter: false });
      expect(await firstPanel.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toEqual(true);
      expect(await secondPanel.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toEqual(true);
    });

    test('reference to focused panel', async ({ page }) => {
      const accordionHandle = await page.locator('ids-accordion').first();
      const panels = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.panels);

      // navigate() to second panel
      await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(2));
      expect(await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.focused)).toEqual(panels[1]);
    });

    test('disabling accordion', async ({ page }) => {
      const accordionHandle = await page.locator('ids-accordion').first();

      // disable accordion
      await accordionHandle.evaluate((accordion: IdsAccordion) => { accordion.disabled = true; });

      // try clicking on a panel, should not expand
      const firstPanelHandle = accordionHandle.locator('ids-accordion-panel').first();
      await firstPanelHandle.click();
      expect(await firstPanelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toBeFalsy();
    });

    test('disabling individual panel', async ({ page }) => {
      const firstPanelHandle = await page.locator('ids-accordion ids-accordion-panel:nth-child(1)').first();
      const secondPanelHandle = await page.locator('ids-accordion ids-accordion-panel:nth-child(2)').first();

      // disable first panel
      await firstPanelHandle.evaluate((panel: IdsAccordionPanel) => { panel.disabled = true; });
      await firstPanelHandle.click();
      expect(await firstPanelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toEqual(false);

      // expand second panel
      await secondPanelHandle.click();
      expect(await secondPanelHandle.evaluate((panel: IdsAccordionPanel) => panel.expanded)).toEqual(true);
    });

    test('navigating panel via keyboard', async ({ page }) => {
      const accordionHandle = await page.locator('ids-accordion').first();
      const accordionPanels = await page.evaluate(() => document.querySelectorAll<IdsAccordionPanel>('ids-accordion ids-accordion-panel'));

      // focus on first panel
      await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(1));

      // Navigate ArrowDown to second panel
      await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })));
      expect(await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.focused)).toEqual(accordionPanels[1]);

      // Navigate ArrowUp back to first panel
      await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' })));
      expect(await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.focused)).toEqual(accordionPanels[0]);
    });

    test('navigating panels programatically via navigate method', async ({ page }) => {
      const accordionHandle = await page.locator('ids-accordion').first();
      const accordionPanels = await page.evaluate(() => document.querySelectorAll<IdsAccordionPanel>('ids-accordion ids-accordion-panel'));

      // navigate 1 step into accordion
      const panelAfterOneStep = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(1));
      expect(panelAfterOneStep).toEqual(accordionPanels[0]);

      // then navigate 2 steps from target panel
      const panelAfterTwoSteps = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(2));
      expect(panelAfterTwoSteps).toEqual(accordionPanels[2]);

      // then navigate back 1 step from target panel
      const panelAfterBackStep = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(-1));
      expect(panelAfterBackStep).toEqual(accordionPanels[1]);

      // then navigate 0 steps to stay put
      const panelAfterNoSteps = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(-1));
      expect(panelAfterNoSteps).toEqual(accordionPanels[1]);

      // then navigate junk steps to stay put
      const panelAfterJunkSteps = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate('junk' as any));
      expect(panelAfterJunkSteps).toEqual(accordionPanels[1]);
    });

    test('changing accordion header expander type', async ({ page }) => {
      const headerHandle = await page.locator('ids-accordion ids-accordion-panel ids-accordion-header').first();
      expect(await headerHandle.getAttribute('expander-type')).toEqual('caret');

      // change expanderType to plus-minus
      await headerHandle.evaluate((header: IdsAccordionHeader) => { header.expanderType = 'plus-minus'; });
      expect(await headerHandle.getAttribute('expander-type')).toEqual('plus-minus');
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.container?.classList.contains('expander-type-plus-minus'))).toBeTruthy();
    });

    test('adding/removing accordion headers', async ({ page }) => {
      const headerHandle = await page.locator('ids-accordion ids-accordion-header').first();
      const iconHandle = await headerHandle.locator('.ids-accordion-display-icon').first();

      // set icon
      await headerHandle.evaluate((header: IdsAccordionHeader) => { header.icon = 'user'; });
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.icon)).toEqual('user');
      expect(await iconHandle.evaluate((icon: IdsIcon) => icon.icon)).toEqual('user');

      // remove icon
      await headerHandle.evaluate((header: IdsAccordionHeader) => { header.icon = null; });
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.icon)).toEqual(null);
      expect(await iconHandle.evaluate((icon: IdsIcon) => icon.icon)).toEqual('');
    });

    test('toggle showing/hiding header expander icon', async ({ page }) => {
      const headerHandle = await page.locator('ids-accordion ids-accordion-panel ids-accordion-header').first();

      // hide expander icon
      await headerHandle.evaluate((header: IdsAccordionHeader) => header.toggleExpanderIcon(false));
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.container?.querySelector('.ids-accordion-expander-icon'))).toBeNull();

      // show expander icon
      await headerHandle.evaluate((header: IdsAccordionHeader) => header.toggleExpanderIcon(true));
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.container?.querySelector('.ids-accordion-expander-icon'))).toBeDefined();
    });

    test('setting header selected state', async ({ page }) => {
      const headerHandle = await page.locator('ids-accordion ids-accordion-header').first();

      // set selected state to true
      await headerHandle.evaluate((header: IdsAccordionHeader) => { header.selected = true; });
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.container?.classList.contains('selected'))).toEqual(true);

      // set selected state to false
      await headerHandle.evaluate((header: IdsAccordionHeader) => { header.selected = false; });
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.container?.classList.contains('selected'))).toEqual(false);
    });

    test('should add/remove alignment classes with panel\'s contentAlignment', async ({ page }) => {
      const panelHandle = await page.locator('ids-accordion-panel').first();
      const headerHandle = await page.locator('ids-accordion-panel').first();

      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.contentAlignment = ''; });
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.container?.classList.contains('has-icon'))).toBeFalsy();

      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.contentAlignment = 'has-icon'; });
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.container?.classList.contains('has-icon'))).toBeTruthy();

      await panelHandle.evaluate((panel: IdsAccordionPanel) => { panel.contentAlignment = 'has-menu'; });
      expect(await headerHandle.evaluate((header: IdsAccordionHeader) => header.container?.classList.contains('has-icon'))).toBeFalsy();
    });
  });

  test.describe('Nested IdsAccordion functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-accordion/nested.html');
    });

    test('can navigate nested accordion panels', async ({ page }) => {
      const accordionHandle = await page.locator('#app-menu-style');
      const employeePanel = await page.locator('#employee');
      const profilePanel = await page.locator('#my-profile');
      const benefitsPanel = await page.locator('#benefits');

      await employeePanel.focus();

      // If header is not expanded, navigation simply loops back to the currently-focused pane
      let next = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(1));
      expect(next).toEqual(await employeePanel.evaluate((panel: IdsAccordionPanel) => panel));

      // Expand and navigate to "My Profile" (2nd level accordion pane)
      await employeePanel.evaluate((panel: IdsAccordionPanel) => { panel.expanded = true; });
      next = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(1));
      expect(next).toEqual(await profilePanel.evaluate((panel: IdsAccordionPanel) => panel));

      // Loop comnpletely around back to "My Profile"
      next = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(10));
      expect(next).toEqual(await profilePanel.evaluate((panel: IdsAccordionPanel) => panel));

      // Expand the "benefits" panel and try looping again
      await benefitsPanel.evaluate((panel: IdsAccordionPanel) => { panel.expanded = true; });
      next = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(14));
      expect(next).toEqual(await profilePanel.evaluate((panel: IdsAccordionPanel) => panel));

      // Go Backwards and focus the "Employee" panel
      next = await accordionHandle.evaluate((accordion: IdsAccordion) => accordion.navigate(-15));
      expect(next).toEqual(await employeePanel.evaluate((panel: IdsAccordionPanel) => panel));
    });

    test('has panels that are aware of their parent panels', async ({ page }) => {
      const benefitsPanel = await page.locator('#benefits');
      expect(await benefitsPanel.evaluate((panel: IdsAccordionPanel) => panel.hasParentPanel)).toBeTruthy();
    });

    test('can identify nested panels', async ({ page }) => {
      const benefitsInfoPanel = await page.locator('#benefits-information');
      expect(await benefitsInfoPanel.evaluate((panel: IdsAccordionPanel) => panel.nested)).toBeTruthy();

      const employeePanel = await page.locator('#employee');
      expect(await employeePanel.evaluate((panel: IdsAccordionPanel) => panel.nested)).toBeFalsy();
    });

    test('can describe if its parent panel is expanded', async ({ page }) => {
      const benefitsPanel = await page.locator('#benefits');
      expect(await benefitsPanel.evaluate((panel: IdsAccordionPanel) => panel.parentExpanded)).toBeFalsy();

      const employeePanel = await page.locator('#employee');
      await employeePanel.evaluate((panel: IdsAccordionPanel) => { panel.expanded = true; });
      expect(await benefitsPanel.evaluate((panel: IdsAccordionPanel) => panel.parentExpanded)).toBeTruthy();
    });

    test('it should not fire selected event on the root accordion', async ({ page, eventsTest }) => {
      const id = '#keep-expander-placement-nested';
      const accordionRoot = await page.locator(id);
      await eventsTest.onEvent(id, 'selected');
      await eventsTest.onEvent(id, 'deselect');
      const nestedHeader = await accordionRoot.locator('ids-accordion-header').last();
      await nestedHeader.dispatchEvent('click');
      expect(await eventsTest.isEventTriggered(id, 'selected')).toBeFalsy();
      expect(await eventsTest.isEventTriggered(id, 'deselect')).toBeTruthy();
    });
  });
});
