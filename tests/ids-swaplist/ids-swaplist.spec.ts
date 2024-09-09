import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { ElementHandle, Locator } from '@playwright/test';
import { test, expect } from '../base-fixture';

import IdsSwaplist from '../../src/components/ids-swaplist/ids-swaplist';

test.describe('IdsSwaplist tests', () => {
  const url = '/ids-swaplist/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Swaplist Component');
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
      const handle = await page.$('ids-swaplist');
      const html = await handle?.evaluate((el: IdsSwaplist) => el?.outerHTML);
      await expect(html).toMatchSnapshot('swaplist-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-swaplist');
      const html = await handle?.evaluate((el: IdsSwaplist) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('swaplist-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-swaplist-light');
    });
  });

  test.describe('setting tests', () => {
    test('can use the DOM for the default template', async ({ page }) => {
      const tmpl = await page.evaluate(() => {
        const elem = document.createElement('ids-swaplist') as any;
        return elem.defaultTemplate;
      });
      expect(tmpl).toEqual(undefined);
    });

    test('can set the default template', async ({ page }) => {
      const tmpl = await page.evaluate(() => {
        const elem = document.createElement('ids-swaplist') as any;
        // eslint-disable-next-line no-template-curly-in-string
        elem.defaultTemplate = '<div>${field}</div>';
        return elem.defaultTemplate;
      });
      // eslint-disable-next-line no-template-curly-in-string
      expect(tmpl).toEqual('<div>${field}</div>');
    });
  });

  test.describe('functionality tests', () => {
    test('can set/get data', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      const data = [
        {
          id: 1,
          name: 'Countries',
          items: [
            {
              id: 1,
              text: 'U.S.A',
              value: 'usa'
            },
            {
              id: 2,
              text: 'Italy',
              value: 'italy'
            }
          ]
        },
        {
          id: 2,
          name: 'Another Countries',
          items: [
            {
              id: 3,
              text: 'Philippines',
              value: 'ph'
            },
            {
              id: 4,
              text: 'Japan',
              value: 'japan'
            }
          ]
        }
      ];
      expect(await swaplist.evaluate((element: IdsSwaplist) => element.data)).not.toEqual(data);
      expect(await swaplist.evaluate((element: IdsSwaplist, tData) => {
        element.data = tData;
        return element.data;
      }, data)).toEqual(data);
    });

    test('can set/get searchable', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      let searchFields = await swaplist.locator('ids-search-field').all();
      expect(await swaplist.evaluate((element: IdsSwaplist) => element.searchable)).toBeFalsy();
      expect(searchFields).toHaveLength(0);
      await expect(swaplist).not.toHaveAttribute('searchable');

      expect(await swaplist.evaluate((element: IdsSwaplist) => {
        element.searchable = true;
        element.renderLists();
        return element.searchable;
      })).toBeTruthy();
      searchFields = await swaplist.locator('ids-search-field').all();
      await expect(swaplist).toHaveAttribute('searchable');
      expect(searchFields).toHaveLength(3);
    });

    test('can set/get default template', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      // eslint-disable-next-line no-template-curly-in-string
      const template = '<ids-layout-grid cols="1"><ids-text>${text}</ids-text><ids-text status="info">Information</ids-text></ids-layout-grid>';
      expect(await swaplist.evaluate((element: IdsSwaplist, tData) => {
        element.defaultTemplate = tData;
        element.renderLists();
        return element.defaultTemplate;
      }, template)).toEqual(template);
    });

    test('can get selected items', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      const items = await swaplist.locator('ids-card.card-0 ids-swappable ids-swappable-item').all();
      await items[0].click({ delay: 50 });
      await items[1].click({ delay: 50 });
      await items[2].click({ delay: 50 });
      await items[3].click({ delay: 50 });

      const selectedItems = await swaplist.evaluateHandle((element: IdsSwaplist) => Array.from(element.selectedItems));

      await expect(items[0]).toBeSameElement((await selectedItems.getProperty('0')) as ElementHandle);
      await expect(items[1]).toBeSameElement((await selectedItems.getProperty('1')) as ElementHandle);
      await expect(items[2]).toBeSameElement((await selectedItems.getProperty('2')) as ElementHandle);
      await expect(items[3]).toBeSameElement((await selectedItems.getProperty('3')) as ElementHandle);
    });

    test('can render multiple lists', async ({ page }) => {
      const data = [{
        id: 1,
        name: 'Countries',
        items: [{
          id: 1,
          text: 'U.S.A',
          value: 'usa'
        },
        {
          id: 2,
          text: 'Italy',
          value: 'italy'
        }
        ]
      },
      {
        id: 2,
        name: 'Another Countries',
        items: [{
          id: 3,
          text: 'Philippines',
          value: 'ph'
        },
        {
          id: 4,
          text: 'Japan',
          value: 'japan'
        }
        ]
      },
      {
        id: 3,
        name: 'Another',
        items: [{
          id: 5,
          text: 'Chille',
          value: 'chille'
        }]
      },
      {
        id: 4,
        name: 'Another One',
        items: [{
          id: 6,
          text: 'Singapore',
          value: 'sg'
        }]
      }];
      const swaplist = await page.locator('#swaplist-1');

      expect(await swaplist.evaluate((element: IdsSwaplist, tData) => {
        element.data = tData;
        return element.data;
      }, data)).toEqual(data);
      await swaplist.waitFor();

      const listCardLists = await swaplist.locator('ids-card.list-card').all();
      const rightArrow = await swaplist.locator('ids-button.right-arrow').all();
      const leftArrow = await swaplist.locator('ids-button.left-arrow').all();
      expect(listCardLists).toHaveLength(4);
      expect(rightArrow).toHaveLength(3);
      expect(leftArrow).toHaveLength(3);
    });

    test('can swap items between lists via arrow buttons', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      const rightAvailable = await swaplist.locator('#right-arrow-0');
      const leftSelected = await swaplist.locator('#left-arrow-1');
      const getListItems = async (listCard: Locator) => {
        const results = await listCard.locator('ids-swappable ids-swappable-item').all();
        return results;
      };
      let availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      let selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      let item = await availableLists[0].elementHandle();
      const defAvailCount = availableLists.length;
      const defSelectCount = selectedLists.length;

      // move 1st item of the available list to the right list
      await availableLists[0].click({ delay: 50 });
      await rightAvailable.click({ delay: 50 });
      // refresh element lists
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      // check if the item moved is the same
      await expect(selectedLists[selectedLists.length - 1]).toBeSameElement(item);
      // check counts
      expect(availableLists.length).toEqual(defAvailCount - 1);
      expect(selectedLists.length).toEqual(defSelectCount + 1);

      item = await selectedLists[selectedLists.length - 1].elementHandle();

      // move 3rd item of the selected list to the left list
      await selectedLists[selectedLists.length - 1].click({ delay: 50 });
      await leftSelected.click({ delay: 50 });
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      await expect(availableLists[availableLists.length - 1]).toBeSameElement(item);
      expect(availableLists.length).toEqual(defAvailCount);
      expect(selectedLists.length).toEqual(defSelectCount);
    });

    test('can select sequentially and swap multiple items between lists', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      const rightAvailable = await swaplist.locator('#right-arrow-0');
      const leftSelected = await swaplist.locator('#left-arrow-1');
      const getListItems = async (listCard: Locator) => {
        const results = await listCard.locator('ids-swappable ids-swappable-item').all();
        return results;
      };
      let availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      let selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      const defAvailCount = availableLists.length;
      const defSelectCount = selectedLists.length;

      // select items
      await availableLists[0].click({ delay: 50 });
      await availableLists[1].click({ delay: 50 });
      await availableLists[2].click({ delay: 50 });
      await availableLists[3].click({ delay: 50 });
      await rightAvailable.click({ delay: 50 });
      // refresh element lists
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      // check counts
      expect(availableLists.length).toEqual(defAvailCount - 4);
      expect(selectedLists.length).toEqual(defSelectCount + 4);

      // select items
      await selectedLists[0].click({ delay: 50 });
      await selectedLists[1].click({ delay: 50 });
      await selectedLists[2].click({ delay: 50 });
      await selectedLists[3].click({ delay: 50 });
      await selectedLists[4].click({ delay: 50 });
      await selectedLists[5].click({ delay: 50 });
      await leftSelected.click({ delay: 50 });
      // refresh element lists
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      // check counts
      expect(availableLists.length).toEqual(defAvailCount + 2);
      expect(selectedLists.length).toEqual(defSelectCount - 2);
    });

    test('can select any order and swap multiple items between lists', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      const rightAvailable = await swaplist.locator('#right-arrow-0');
      const leftSelected = await swaplist.locator('#left-arrow-1');
      const getListItems = async (listCard: Locator) => {
        const results = await listCard.locator('ids-swappable ids-swappable-item').all();
        return results;
      };
      let availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      let selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      const defAvailCount = availableLists.length;
      const defSelectCount = selectedLists.length;

      // select items
      await availableLists[0].click({ delay: 50 });
      await availableLists[2].click({ delay: 50 });
      await availableLists[4].click({ delay: 50 });
      await availableLists[6].click({ delay: 50 });
      await rightAvailable.click({ delay: 50 });
      // refresh element lists
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      // check counts
      expect(availableLists.length).toEqual(defAvailCount - 4);
      expect(selectedLists.length).toEqual(defSelectCount + 4);

      // select items
      await selectedLists[0].click({ delay: 50 });
      await selectedLists[2].click({ delay: 50 });
      await selectedLists[4].click({ delay: 50 });
      await leftSelected.click({ delay: 50 });
      // refresh element lists
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      // check counts
      expect(availableLists.length).toEqual(defAvailCount - 1);
      expect(selectedLists.length).toEqual(defSelectCount + 1);
    });

    test('can swap items between lists via dragging', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      const getListItems = async (listCard: Locator) => {
        const results = await listCard.locator('ids-swappable ids-swappable-item').all();
        return results;
      };
      let availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      let selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      let item = await availableLists[0].elementHandle();
      const defAvailCount = availableLists.length;
      const defSelectCount = selectedLists.length;

      // move 1st item of the available list to the right list
      await availableLists[0].click({ delay: 50 });
      await availableLists[0].dragTo(swaplist.locator('ids-card.card-1').first());
      // refresh element lists
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      // check if the item moved is the same
      await expect(selectedLists[selectedLists.length - 1]).toBeSameElement(item);
      // check counts
      expect(availableLists.length).toEqual(defAvailCount - 1);
      expect(selectedLists.length).toEqual(defSelectCount + 1);

      item = await selectedLists[selectedLists.length - 1].elementHandle();

      // move 3rd item of the selected list to the left list
      await selectedLists[selectedLists.length - 1].dragTo(swaplist.locator('ids-card.card-0').first());
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      expect(availableLists.length).toEqual(defAvailCount);
      expect(selectedLists.length).toEqual(defSelectCount);
    });

    test('can swap items across lists via dragging with multiple lists', async ({ page }) => {
      const swaplist = await page.locator('#swaplist-1');
      const getListItems = async (listCard: Locator) => {
        const results = await listCard.locator('ids-swappable ids-swappable-item').all();
        return results;
      };
      let availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      let selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      let additionalLists = await getListItems(swaplist.locator('ids-card.card-2').first());
      const defAvailCount = availableLists.length;
      const defSelectCount = selectedLists.length;
      const defAddCount = additionalLists.length;

      // select items
      await availableLists[0].click({ delay: 50 });
      await availableLists[2].click({ delay: 50 });
      await availableLists[4].click({ delay: 50 });
      await availableLists[6].click({ delay: 50 });
      await availableLists[6].dragTo(swaplist.locator('ids-card.card-2').first());
      // refresh element lists
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      additionalLists = await getListItems(swaplist.locator('ids-card.card-2').first());
      // check counts
      expect(availableLists.length).toEqual(defAvailCount - 4);
      expect(selectedLists.length).toEqual(defSelectCount);
      expect(additionalLists.length).toEqual(defAddCount + 4);

      // drag again
      await additionalLists[2].dragTo(swaplist.locator('ids-card.card-1').first());
      // refresh element lists
      availableLists = await getListItems(swaplist.locator('ids-card.card-0').first());
      selectedLists = await getListItems(swaplist.locator('ids-card.card-1').first());
      additionalLists = await getListItems(swaplist.locator('ids-card.card-2').first());
      // check counts
      expect(availableLists.length).toEqual(defAvailCount - 4);
      expect(selectedLists.length).toEqual(defSelectCount + 4);
      expect(additionalLists.length).toEqual(defAddCount);
    });
  });

  test.describe('edge case tests', () => {
    test('should still render after reattaching', async ({ page }) => {
      await page.goto('/ids-swaplist/reattach.html');
      expect(await page.locator('ids-swappable-item').count()).toBe(3);
      await page.locator('#reattach').click();
      expect(await page.locator('ids-swaplist ids-swappable-item').count()).toBe(3);
    });
  });
});
