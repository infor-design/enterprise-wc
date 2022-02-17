describe('Ids List Builder e2e Tests', () => {
  const url = 'http://localhost:4444/ids-list-builder';

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
    // click first list item
    await page.click('pierce/.ids-list-view-body ids-draggable');

    // click edit button
    await page.click('pierce/#button-edit');

    // type something and check for match
    const keyToMatch = 'q';
    await page.keyboard.press(keyToMatch);
    const idsText = await page.$eval('pierce/.ids-list-view-body ids-text', (el) => el.innerHTML);
    expect(idsText).toEqual(keyToMatch);
  });
});
