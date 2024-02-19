import { AxePuppeteer } from '@axe-core/puppeteer';
import countObjects from '../helpers/count-objects';

describe('Ids List Builder e2e Tests', () => {
  const url = 'http://localhost:4444/ids-list-builder/example.html';

  /**
   * Create css selector for list item
   * @param {number} n nth-child(n)
   * @returns {string} css selector, defaults to nth-child(1)
   */
  function createListItemSelector(n: any): string {
    return `pierce/ids-swappable-item:nth-child(${n || 1}) > div[role="listitem"]`;
  }

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  test('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS List Builder Component');
  });

  test('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
    const results = await new AxePuppeteer(page).disableRules(['scrollable-region-focusable', 'aria-required-children', 'aria-required-parent']).analyze();
    expect(results.violations.length).toBe(0);
  });

  test('can drag list items up and down', async () => {
    const jsPathListItemFirst = `document.querySelector("ids-list-builder").shadowRoot.querySelector(".ids-list-view-body").querySelector("ids-swappable-item:nth-child(1)")`;
    const jsPathListItemFourth = `document.querySelector("ids-list-builder").shadowRoot.querySelector(".ids-list-view-body").querySelector("ids-swappable-item:nth-child(4)")`;
    const firstLi = await (await page.evaluateHandle(jsPathListItemFirst)).asElement();
    const fourthLi = await (await page.evaluateHandle(jsPathListItemFourth)).asElement();
    const firstLiBox = await firstLi?.boundingBox();
    const fourthLiBox = await fourthLi?.boundingBox();

    const midWidth = firstLiBox.x + firstLiBox.width / 2;

    // drag item from top towards bottom
    await page.mouse.move(midWidth, firstLiBox.y + firstLiBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(midWidth, fourthLiBox.y + (fourthLiBox.height * 2));
    await page.mouse.up();

    // drag item from bottom towards up
    await page.mouse.move(midWidth, fourthLiBox.y + (fourthLiBox.height * 2));
    await page.mouse.down();
    await page.mouse.move(midWidth, firstLiBox.y + firstLiBox.height / 2);
    await page.mouse.move(midWidth, fourthLiBox.y + (fourthLiBox.height * 2));
    await page.mouse.up();

    await fourthLi.click();
    await page.keyboard.press('Enter'); // edit an existing value
  });

  test('can click the toolbar buttons', async () => {
    const btn = (opt: string) => `document.querySelector('ids-list-builder').querySelector('[list-builder-action="${opt}"]')`;

    const editButton = await (await page.evaluateHandle(btn('edit'))).asElement();
    const addButton = await (await page.evaluateHandle(btn('add'))).asElement();
    const upButton = await (await page.evaluateHandle(btn('move-up'))).asElement();
    const downButton = await (await page.evaluateHandle(btn('move-down'))).asElement();

    await addButton.click();
    await addButton.click();

    await editButton.click();
    await addButton.click();
    await upButton.click();
    await downButton.click();

    await addButton.click();
  });

  test('can edit, select, and delete through keyboard', async () => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.keyboard.press('Space'); // select list item
    await page.keyboard.press('Enter'); // this should edit the first list item
    await page.keyboard.press('Enter'); // unfocus editor
    await page.keyboard.press('Tab'); // move to next list item
    await page.keyboard.press('Space'); // select the list item

    // random button to trigger default keyboard case
    await page.keyboard.press('Shift');
  });

  it.skip('should update inner text on edit keyup', async () => {
    const firstItemSelector = createListItemSelector(1);
    const editButtonSelector = 'pierce/[list-builder-action="edit"]';

    // click first list item, wait for selected state
    await page.click(firstItemSelector);
    await page.waitForSelector(`${firstItemSelector}[selected="selected"]`);

    // click edit button, wait for ids-input to be injected into list item
    await page.click(editButtonSelector);
    await page.waitForSelector(`${firstItemSelector} ids-input`);

    // type something, wait for ids text to match key pressed
    const keyPressed = 'q';
    await page.keyboard.press(keyPressed);
    await page.waitForFunction(
      (userInput: any) => {
        const listBuilder: any = document.querySelector('ids-list-builder');
        const idsText = listBuilder.shadowRoot.querySelector('ids-swappable-item:nth-child(1) ids-text');
        return idsText.innerHTML === userInput;
      },
      {},
      keyPressed
    );

    // deselect list item to reset
    await page.click(firstItemSelector);
    await page.waitForSelector(`${firstItemSelector}:not([selected])`);
  });

  it.skip('should navigate list view via keyboard arrows', async () => {
    const firstItemSelector = createListItemSelector(1);
    const secondItemSelector = createListItemSelector(2);

    // click first list item
    await page.click(firstItemSelector);
    await page.waitForSelector(`${firstItemSelector}[selected]`);

    // keyboard navigate to second item and select
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForSelector(`${secondItemSelector}[selected]`);

    // keyboard navigate to first item and select
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await page.waitForSelector(`${firstItemSelector}[selected]`);
  });
});
