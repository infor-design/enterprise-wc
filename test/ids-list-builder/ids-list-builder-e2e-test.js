describe('Ids List Builder e2e Tests', () => {
  const url = 'http://localhost:4444/ids-list-builder';

  /**
   * Create css selector for list item
   * @param {number} n nth-child(n)
   * @returns {string} css selector, defaults to nth-child(1)
   */
  function createListItemSelector(n) {
    return `pierce/.ids-list-view-body ids-draggable:nth-child(${n || 1})`;
  }

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS List Builder Component');
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(url, { waitUntil: ['networkidle0', 'load'] });
    await expect(page).toPassAxeTests({ disabledRules: ['scrollable-region-focusable'] });
  });

  it('can drag list items up and down', async () => {
    const jsPathListItemFirst = `document.querySelector("ids-list-builder").shadowRoot.querySelector(".ids-list-view-body > ids-draggable:nth-child(1) > div")`;
    const jsPathListItemFourth = `document.querySelector("ids-list-builder").shadowRoot.querySelector(".ids-list-view-body > ids-draggable:nth-child(4) > div")`;
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

  it('can click the toolbar buttons', async () => {
    const jsPathToolbarButtonEdit = `document.querySelector("ids-list-builder").shadowRoot.querySelector("#button-edit")`;
    const jsPathToolbarButtonAdd = `document.querySelector("ids-list-builder").shadowRoot.querySelector("#button-add")`;
    const jsPathToolbarButtonUp = `document.querySelector("ids-list-builder").shadowRoot.querySelector("#button-up")`;
    const jsPathToolbarButtonDown = `document.querySelector("ids-list-builder").shadowRoot.querySelector("#button-down")`;

    const editButton = await (await page.evaluateHandle(jsPathToolbarButtonEdit)).asElement();
    const addButton = await (await page.evaluateHandle(jsPathToolbarButtonAdd)).asElement();
    const upButton = await (await page.evaluateHandle(jsPathToolbarButtonUp)).asElement();
    const downButton = await (await page.evaluateHandle(jsPathToolbarButtonDown)).asElement();

    await addButton.click();
    await addButton.click();

    await editButton.click();
    await addButton.click();
    await upButton.click();
    await downButton.click();

    await addButton.click();
  });

  it('can edit, select, and delete through keyboard', async () => {
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

  it('should update inner text on edit keyup', async () => {
    const firstItemSelector = createListItemSelector(1);

    // click first list item
    await page.click(firstItemSelector);

    // click edit button
    await page.click('pierce/#button-edit');

    // type something and check for match
    const keyToMatch = 'q';
    await page.keyboard.press(keyToMatch);
    const idsText = await page.$eval(`${firstItemSelector} ids-text`, (el) => el.innerHTML);
    expect(idsText).toEqual(keyToMatch);

    // deselect list item
    await page.click(firstItemSelector);
  });

  it('should navigate list view via keyboard arrows', async () => {
    const firstItemSelector = `${createListItemSelector(1)} > div[role="listitem"]`;
    const secondItemSelector = `${createListItemSelector(2)} > div[role="listitem"]`;
    const thirdItemSelector = `${createListItemSelector(3)} > div[role="listitem"]`;
    let isSelected;

    // click first list item
    await page.click(firstItemSelector);
    isSelected = await page.$eval(firstItemSelector, (el) => el.getAttribute('selected'));
    expect(isSelected).toBeTruthy();

    // keyboard navigate to third item and select
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    isSelected = await page.$eval(thirdItemSelector, (el) => el.getAttribute('selected'));
    expect(isSelected).toBeTruthy();

    // keyboard navigate to second item and select
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Space');
    isSelected = await page.$eval(secondItemSelector, (el) => el.getAttribute('selected'));
    expect(isSelected).toBeTruthy();
  });
});
