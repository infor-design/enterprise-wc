/**
 * @jest-environment jsdom
 */
import IdsListBuilder from '../../src/components/ids-list-builder/ids-list-builder';
import '../helpers/resize-observer-mock';

const sampleData = [
  {
    id: 1,
    productId: '7439937961',
    productName: 'Steampan Lid',
    inStock: true,
    units: '9',
    unitPrice: 23,
    color: 'Green'
  },
  {
    id: 2,
    productId: '3672150959',
    productName: 'Coconut - Creamed, Pure',
    inStock: true,
    units: '588',
    unitPrice: 18,
    color: 'Yellow'
  },
  {
    id: 3,
    productId: '8233719404',
    productName: 'Onions - Red',
    inStock: false,
    units: '68',
    unitPrice: 58,
    color: 'Green'
  },
  {
    id: 4,
    productId: '2451410442',
    productName: 'Pasta - Fusili Tri - Coloured',
    inStock: true,
    units: '02',
    unitPrice: 24,
    color: 'Crimson'
  },
  {
    id: 5,
    productId: '4264251249',
    productName: 'Bread - Crumbs, Bulk',
    inStock: true,
    units: '5',
    unitPrice: 59,
    color: 'Maroon'
  },
];

const sampleData1 = [
  { manufacturerName: 'name1' },
  { manufacturerName: 'name2' },
  { manufacturerName: 'name3' },
  { manufacturerName: 'name4' },
  { manufacturerName: 'name5' }
];

const HTMLSnippets = {
  VANILLA_COMPONENT: (
    `<ids-list-builder selectable="single">
   </ids-list-builder>`
  ),
  FULL_COMPONENT: (
    // eslint-disable-next-line no-template-curly-in-string
    '<ids-list-builder selectable="single" height="310px"><template><ids-text font-size="16" type="span">${manufacturerName}</ids-text></template></ids-list-builder>'
  ),
};

describe('IdsListBuilder Component', () => {
  let idsListBuilder: IdsListBuilder | any;

  const createElemViaTemplate = async (innerHTML: any) => {
    idsListBuilder?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    idsListBuilder = template.content.childNodes[0];

    document.body.appendChild(idsListBuilder);

    return idsListBuilder;
  };

  const createKeyboardEvent = (keyName: any, type = 'keydown') => {
    const event = new KeyboardEvent(type, { key: keyName });
    return event;
  };

  afterEach(async () => {
    idsListBuilder?.remove();
  });

  test('renders empty listbuilder with no errors', () => {
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsListBuilder();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-list-builder').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  test('renders virtual scroll and ignores it', () => {
    document.body.innerHTML = '';
    const elem: any = new IdsListBuilder();
    elem.virtualScroll = true;
    document.body.appendChild(elem);
    expect(elem.virtualScroll).toEqual(false);
    elem.remove();
  });

  test('injects template correctly and sets data correctly', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    idsListBuilder.data = [...sampleData];
    expect(idsListBuilder.parentEl).toBeTruthy();
  });

  test('renders the header', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    expect(idsListBuilder.toolbar).toBeTruthy();
    expect(idsListBuilder.querySelector('[list-builder-action="add"]')).toBeTruthy();
  });

  test('add new list item to non-empty list', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    let listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd item
    listItems[1].click();

    // Click add button
    idsListBuilder.querySelector('[list-builder-action="add"]').click();

    listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length + 1);

    const itemInputElem = listItems[2].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual('New Value');
  });

  test('add new list item to empty-list', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [];

    // click add button
    idsListBuilder.querySelector('[list-builder-action="add"]').click();

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(1);

    const itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual('New Value');
  });

  test('edit list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd item
    listItems[1].click();
    expect(listItems[1].querySelector('ids-input')).toBeFalsy();

    // Edit selected list item
    idsListBuilder.querySelector('[list-builder-action="edit"]').click();
    expect(listItems[1].querySelector('ids-input')).toBeTruthy();
    expect(listItems[1].querySelector('ids-input').value).toEqual(sampleData1[1].manufacturerName);
  });

  test('delete list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    let listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Clicked delete button without any selection
    idsListBuilder.querySelector('[list-builder-action="delete"]').click();
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd item
    listItems[1].click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);

    // Delete selected list item
    idsListBuilder.querySelector('[list-builder-action="delete"]').click();

    listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length - 1);
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[2].manufacturerName);
  });

  test('move up list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd item
    listItems[1].click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);

    // Move up selected list item
    idsListBuilder.querySelector('[list-builder-action="move-up"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
  });

  test('move down list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd item
    listItems[1].click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);

    // Move down selected list item
    idsListBuilder.querySelector('[list-builder-action="move-down"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[1].manufacturerName);
  });

  test('keyboard support for select/toggle/arrow up/arrow down/delete', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];
    const clickEvent = new MouseEvent('click');

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    listItems[0].dispatchEvent(clickEvent);

    // toggle editor
    listItems[0].dispatchEvent(createKeyboardEvent('Enter'));
    let itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual(sampleData1[0].manufacturerName);

    listItems[0].dispatchEvent(createKeyboardEvent('Enter'));
    itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeFalsy();

    // arrow down
    listItems[0].dispatchEvent(createKeyboardEvent('ArrowDown'));
    expect(listItems[0].getAttribute('tabindex')).toBe('-1');
    expect(listItems[1].getAttribute('tabindex')).toBe('0');

    listItems[1].dispatchEvent(createKeyboardEvent('ArrowDown'));
    expect(listItems[0].getAttribute('tabindex')).toBe('-1');
    expect(listItems[1].getAttribute('tabindex')).toBe('-1');

    listItems[2].dispatchEvent(createKeyboardEvent(' '));
    expect(idsListBuilder.itemFocused.rowIndex).toBe(2);

    // arrow up
    listItems[2].dispatchEvent(createKeyboardEvent('ArrowUp'));
    expect(listItems[0].getAttribute('tabindex')).toBe('-1');
    expect(listItems[1].getAttribute('tabindex')).toBe('0');

    listItems[1].dispatchEvent(createKeyboardEvent(' '));
    expect(idsListBuilder.itemFocused.rowIndex).toBe(1);

    // for item level keyboard
    const keys = ['ArrowDown', 'ArrowUp', 'Tab'];
    for (let i = 0; i < keys.length; i++) {
      listItems[0].dispatchEvent(clickEvent);
      listItems[0].dispatchEvent(createKeyboardEvent('Enter'));
      listItems[0].dispatchEvent(createKeyboardEvent(keys[i]));
      expect(listItems[0].querySelector('ids-input')).toBeFalsy();
    }

    listItems[0].dispatchEvent(createKeyboardEvent('Delete'));
    expect(idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]')).toHaveLength(4);
  });

  test('update list item editor value', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [];

    // click add button
    idsListBuilder.querySelector('[list-builder-action="add"]').click();

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(1);

    const itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual('New Value');

    itemInputElem.value = 'test value';
    itemInputElem.dispatchEvent(createKeyboardEvent('e', 'keyup'));
    listItems[0].dispatchEvent(createKeyboardEvent('Enter'));
    expect(idsListBuilder.data[0].manufacturerName).toEqual('test value');
  });

  test('delete multiple selection list items', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.selectable = 'multiple';
    idsListBuilder.data = [...sampleData1];

    let listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Clicked delete button without any selection
    idsListBuilder.querySelector('[list-builder-action="delete"]').click();
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd and 3rd items
    listItems[1].click();
    listItems[2].click();
    idsListBuilder.querySelector('[list-builder-action="edit"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Delete selected list item
    idsListBuilder.delete();

    listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length - 2);
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[4].manufacturerName);
  });

  test('should deselect other selection before add new list items', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.selectable = 'multiple';
    idsListBuilder.data = [...sampleData1];

    let listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd and 3rd items
    listItems[1].click();
    listItems[2].click();
    expect(listItems.length).toEqual(sampleData1.length);

    // Add new list and deselect other selection before add
    idsListBuilder.querySelector('[list-builder-action="add"]').click();

    listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length + 1);
  });

  test('move up list item with multiple selection', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.selectable = 'multiple';
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd and 3rd items
    listItems[1].click();
    listItems[3].click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Move up selected list item
    idsListBuilder.querySelector('[list-builder-action="move-up"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Should not change any, if top of the list
    idsListBuilder.querySelector('[list-builder-action="move-up"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);
  });

  test('move up list item to first with multiple selection', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.selectable = 'multiple';
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 1st and 3rd items
    listItems[0].click();
    listItems[3].click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Move up selected list item
    idsListBuilder.querySelector('[list-builder-action="move-up"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);
  });

  test('move down list item with multiple selection', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.selectable = 'multiple';
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd and 3rd items
    listItems[1].click();
    listItems[3].click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Move down selected list item
    idsListBuilder.querySelector('[list-builder-action="move-down"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[4].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[3].manufacturerName);

    // Should not change any, if top of the list
    idsListBuilder.querySelector('[list-builder-action="move-down"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[4].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[3].manufacturerName);
  });

  test('move down list item to last with multiple selection', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.selectable = 'multiple';
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select 2nd and last items
    listItems[1].click();
    listItems[4].click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Move down selected list item
    idsListBuilder.querySelector('[list-builder-action="move-down"]').click();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);
  });

  test('can add items with the button when empty', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.querySelector('[list-builder-action="add"]').click();

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(1);
  });

  test('let api should add new list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    let listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    idsListBuilder.add();

    listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length + 1);
  });

  test('let api should delete selected list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    let listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Select and delete 2nd item
    listItems[1].click();
    idsListBuilder.delete();

    listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length - 1);
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[4].manufacturerName);
  });

  test('let api should edit selected list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);

    // Select and edit 2nd item
    listItems[1].click();
    idsListBuilder.edit();
    expect(listItems[1].querySelector('ids-input')).toBeTruthy();
    expect(listItems[1].querySelector('ids-input').value).toEqual(sampleData1[1].manufacturerName);
  });

  test('let api should move down selected list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Select and move down 2nd list items
    listItems[1].click();
    idsListBuilder.moveDown();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);
  });

  test('let api should move up selected list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [...sampleData1];

    const listItems = idsListBuilder.shadowRoot.querySelectorAll('ids-swappable-item[role=listitem]');
    expect(listItems.length).toEqual(sampleData1.length);
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);

    // Select and move up 2nd list items
    listItems[1].click();
    idsListBuilder.moveUp();
    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[0].manufacturerName);
    expect(idsListBuilder.data[2].manufacturerName).toBe(sampleData1[2].manufacturerName);
    expect(idsListBuilder.data[3].manufacturerName).toBe(sampleData1[3].manufacturerName);
    expect(idsListBuilder.data[4].manufacturerName).toBe(sampleData1[4].manufacturerName);
  });
});
