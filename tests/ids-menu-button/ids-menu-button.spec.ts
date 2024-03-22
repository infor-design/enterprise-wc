import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsMenuButton from '../../src/components/ids-menu-button/ids-menu-button';
import IdsPopupMenu from '../../src/components/ids-popup-menu/ids-popup-menu';

test.describe('IdsMenuButton tests', () => {
  const url = '/ids-menu-button/example.html';
  let buttonEl: any;
  let menuEl: any;
  let iconEl: any;
  let dropdownIcon;

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    buttonEl = await page.locator('ids-menu-button').first();
    iconEl = await buttonEl.locator('button').locator('ids-icon');
    menuEl = await page.locator('ids-popup-menu').first();
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Menu Button Component');
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
      const handle = await page.$('ids-menu-button');
      const html = await handle?.evaluate((el: IdsMenuButton) => el?.outerHTML);
      await expect(html).toMatchSnapshot('menu-button-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-menu-button');
      const html = await handle?.evaluate((el: IdsMenuButton) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('menu-button-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-menu-button-light');
    });
  });

  test.describe('e2e tests', () => {
    test('can change/remove its dropdown icon', async ({ page }) => {
      buttonEl = await page.locator('ids-menu-button').first();
      iconEl = await buttonEl.locator('button').locator('ids-icon');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        menubutton.dropdownIcon = 'launch';
      });

      dropdownIcon = await buttonEl.evaluate((menubutton: IdsMenuButton) => menubutton.dropdownIcon);
      await expect(dropdownIcon).toBe('launch');
      await expect(iconEl).toHaveAttribute('icon', 'launch');

      // Remove it
      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        menubutton.dropdownIcon = 'null';
      });
      dropdownIcon = await buttonEl.evaluate((menubutton: IdsMenuButton) => menubutton.dropdownIcon);
      await expect(dropdownIcon).toBe('null');
      await expect(iconEl).toHaveAttribute('icon', 'null');

      // Try removing it again (runs the else clause in `set dropdownIcon`)
      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        menubutton.dropdownIcon = 'null';
      });
      dropdownIcon = await buttonEl.evaluate((menubutton: IdsMenuButton) => menubutton.dropdownIcon);
      await expect(dropdownIcon).toBe('null');
      await expect(iconEl).toHaveAttribute('icon', 'null');
    });

    test('points the menu\'s arrow at the button if there is no icon', async ({ page }) => {
      buttonEl = await page.locator('ids-menu-button').first();
      iconEl = await buttonEl.locator('button').locator('ids-icon');
      const menuArrow = await page.locator('ids-popup-menu').locator('.arrow.bottom').first();
      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        menubutton.dropdownIcon = 'null';
      });
      await buttonEl.click();
      await expect(menuArrow).toHaveAttribute('style', 'margin-left: 14px;');
    });

    test('can set active state', async ({ page }) => {
      buttonEl = await page.locator('ids-menu-button').first();
      iconEl = await buttonEl.locator('button').locator('ids-icon');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        menubutton.setActiveState(true);
      });
      await expect(await buttonEl.locator('button')).toHaveClass(/is-active/);

      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        menubutton.setActiveState(false);
      });
      await expect(await buttonEl.locator('button')).not.toHaveClass(/is-active/);
    });

    test('can have active state when menu is open', async () => {
      const button = await buttonEl.locator('button');

      await menuEl.evaluate(async (popupmenu: IdsPopupMenu) => {
        await popupmenu.show();
      });
      await expect(button).toHaveClass(/is-active/);

      await menuEl.evaluate(async (popupmenu: IdsPopupMenu) => {
        await popupmenu.hide();
      });
      await expect(button).not.toHaveClass(/is-active/);
    });

    test('shows/hides the menu when the button is clicked', async () => {
      await buttonEl.click();
      const popup = await menuEl.locator('ids-popup');

      await expect(popup).toBeVisible();
    });

    test('not error if no menu', async ({ page }) => {
      const element = 'ids-menu-button';
      await page.evaluate(() => {
        document.body.innerHTML = '';
        const noMenuButton: any = document.createElement('ids-menu-button') as IdsMenuButton;
        document.body.appendChild(noMenuButton);
      });

      expect(async () => {
        await page.evaluate((id) => {
          document.querySelector<IdsMenuButton>(id)!.configureMenu();
          document.querySelector<IdsMenuButton>(id)!.resizeMenu();
        }, element);
      }).not.toThrowError();
    });

    test('can render an icon button', async () => {
      const buttonIcon = await buttonEl.locator('.ids-icon-button');
      await expect(buttonIcon).toBeDefined();
    });

    test('can select item via keyboard', async ({ page }) => {
      const element = 'ids-popup-menu';
      menuEl = await page.evaluate((id) => {
        document.querySelector<IdsPopupMenu>(id)!.innerHTML = `<ids-menu-group id="primary" select="single">
        <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
      </ids-menu-group>`;
      }, element);
      const popupMenu = await page.locator('#primary').first();
      const menutem = await page.locator('#item1').first();
      await buttonEl.click();
      await expect(popupMenu).toBeVisible();

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await expect(menutem).toHaveAttribute('selected');
      await expect(popupMenu).not.toBeVisible();
    });

    test('focuses the button when the menu is closed with the `Escape` key', async ({ page }) => {
      await buttonEl.click();
      await page.keyboard.press('Escape');
      expect(await buttonEl.evaluate((menuButton: IdsMenuButton) => {
        menuButton.focus();
        return document.activeElement?.nodeName;
      })).toEqual('IDS-MENU-BUTTON');
    });

    test('can set formatter width', async () => {
      await expect(buttonEl).not.toHaveAttribute('formatter-width');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = 150; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '150');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = '150'; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '150');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = '150px'; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '150px');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = '5em'; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '5em');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = '15rem'; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '15rem');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = '2vh'; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '2vh');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = '2vw'; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '2vw');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = '15ch'; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '15ch');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = '100%'; });
      await expect(buttonEl).toHaveAttribute('formatter-width', '100%');
      await buttonEl.evaluate((menubutton: IdsMenuButton) => { menubutton.formatterWidth = 'test%'; });
      await expect(buttonEl).not.toHaveAttribute('formatter-width');
    });

    test('can set/get data of menu', async () => {
      let initialExpected: any;
      let menuValues: any;
      // wait for ids-element to #updateAttribute
      // check default values
      initialExpected = ['large', null];
      menuValues = await menuEl.evaluate((popupMenu: IdsPopupMenu) => popupMenu.getSelectedValues('ids-menu-group'));
      await expect(menuValues).toEqual(initialExpected);

      await menuEl.evaluate((popupmenu: IdsPopupMenu) => {
        const testMenuContents = `
        <ids-menu-group select="multiple">
          <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
          <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
          <ids-menu-item id="item3" value="3" selected="true">Item 3</ids-menu-item>
        </ids-menu-group>
      `;
        popupmenu.insertAdjacentHTML('afterbegin', testMenuContents);
      });
      initialExpected = ['3', 'large', null];
      menuValues = await menuEl.evaluate((popupMenu: IdsPopupMenu) => popupMenu.getSelectedValues('ids-menu-group'));
      await expect(menuValues).toEqual(initialExpected);

      // set new values from button
      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        const expected = ['1', '3'];
        menubutton.value = expected;
      });
      const buttonValues = await buttonEl.evaluate((menubutton: IdsMenuButton) => menubutton.value);
      menuValues = await menuEl.evaluate((popupMenu: IdsPopupMenu) => popupMenu.getSelectedValues('ids-menu-group'));
      await expect(menuValues).toHaveLength(2);
      await expect(menuValues).toEqual(['1', '3']);
      await expect(buttonValues).toEqual(menuValues);
    });

    test('can be disabled/enabled', async () => {
      const menuItem = await menuEl.locator('ids-menu-item').first();
      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        menubutton.disabled = true;
      });
      await expect(buttonEl).toHaveAttribute('disabled');
      await expect(menuEl).toHaveAttribute('disabled');
      await expect(menuItem).toHaveAttribute('disabled');

      await buttonEl.evaluate((menubutton: IdsMenuButton) => {
        menubutton.disabled = false;
      });
      await expect(buttonEl).not.toHaveAttribute('disabled');
      await expect(menuEl).not.toHaveAttribute('disabled');
      await expect(menuItem).not.toHaveAttribute('disabled');
    });
  });
});
