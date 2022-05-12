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
  { manufacturerName: 'name3' }
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

  it('renders empty listbuilder with no errors', () => {
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsListBuilder();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-list-builder').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('renders virtual scroll and ignores it', () => {
    document.body.innerHTML = '';
    const elem: any = new IdsListBuilder();
    elem.virtualScroll = true;
    document.body.appendChild(elem);
    expect(elem.virtualScroll).toEqual(false);
    elem.remove();
  });

  it('renders with no errors', async () => {
    document.body.innerHTML = '';
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-list-builder').length).toEqual(1);

    idsListBuilder.remove();

    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    expect(document.querySelectorAll('ids-list-builder').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    expect(idsListBuilder.outerHTML).toMatchSnapshot();
    expect(idsListBuilder.container.querySelector('#button-add')).toBeTruthy();
  });

  it('injects template correctly and sets data correctly', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    idsListBuilder.data = sampleData;
  });

  it('renders the header', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    expect(idsListBuilder.container.querySelector('#button-add')).toBeTruthy();
  });

  it('add new list item to non-empty list', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = sampleData1;
    const clickEvent = new MouseEvent('click');

    // click add button
    const addBtnElem = idsListBuilder.container.querySelector('#button-add');
    addBtnElem.dispatchEvent(clickEvent);

    const listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');
    expect(listItems.length).toEqual(sampleData1.length + 1);

    const itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual('New Value');
  });

  it('add new list item to empty-list', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [];
    const clickEvent = new MouseEvent('click');

    // click add button
    const addBtnElem = idsListBuilder.container.querySelector('#button-add');
    addBtnElem.dispatchEvent(clickEvent);

    const listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');
    expect(listItems.length).toEqual(1);

    const itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual('New Value');
  });

  it('edit new list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = sampleData1;
    const clickEvent = new MouseEvent('click');

    // click edit button
    const editBtnElem = idsListBuilder.container.querySelector('#button-edit');
    const listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');

    // select first item and edit
    idsListBuilder.onClick(listItems[0]);
    editBtnElem.dispatchEvent(clickEvent);

    // check editor element and value
    const itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual(sampleData1[0].manufacturerName);
  });

  it('remove list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = sampleData1;
    const clickEvent = new MouseEvent('click');

    const removeBtnElem = idsListBuilder.container.querySelector('#button-delete');
    let listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');
    expect(listItems.length).toEqual(sampleData1.length);

    // click remove button without selection
    removeBtnElem.dispatchEvent(clickEvent);
    expect(listItems.length).toEqual(sampleData1.length);

    // remove first list item
    idsListBuilder.onClick(listItems[0]);
    removeBtnElem.dispatchEvent(clickEvent);

    listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');
    expect(listItems.length).toEqual(sampleData1.length - 1);
  });

  it('move up list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = sampleData1;
    const clickEvent = new MouseEvent('click');

    const moveUpBtnElem = idsListBuilder.container.querySelector('#button-up');
    const listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');
    expect(listItems.length).toEqual(sampleData1.length);

    // click move up button without selection
    moveUpBtnElem.dispatchEvent(clickEvent);
    expect(idsListBuilder.data[0].manufacturerName).toBe('name1');

    // remove first list item
    idsListBuilder.onClick(listItems[1]);
    moveUpBtnElem.dispatchEvent(clickEvent);

    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[0].manufacturerName);
  });

  it('move down list item', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = sampleData1;
    const clickEvent = new MouseEvent('click');

    const moveDownBtnElem = idsListBuilder.container.querySelector('#button-down');
    const listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');
    expect(listItems.length).toEqual(sampleData1.length);

    // click move up button without selection
    moveDownBtnElem.dispatchEvent(clickEvent);
    expect(idsListBuilder.data[0].manufacturerName).toBe('name1');

    // remove first list item
    idsListBuilder.onClick(listItems[0]);
    moveDownBtnElem.dispatchEvent(clickEvent);

    expect(idsListBuilder.data[0].manufacturerName).toBe(sampleData1[1].manufacturerName);
    expect(idsListBuilder.data[1].manufacturerName).toBe(sampleData1[0].manufacturerName);
  });

  it('keyboard support for select/toggle/arrow up/arrow down/delete', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = sampleData1;

    const listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');
    idsListBuilder.onClick(listItems[0]);

    // toggle editor
    listItems[0].dispatchEvent(createKeyboardEvent('Enter'));
    let itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual(sampleData1[0].manufacturerName);

    listItems[0].dispatchEvent(createKeyboardEvent('Enter'));
    itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeFalsy();

    // arrow down
    idsListBuilder.dispatchEvent(createKeyboardEvent('ArrowDown'));
    expect(listItems[0].getAttribute('tabindex')).toBe('-1');
    expect(listItems[1].getAttribute('tabindex')).toBe('0');
    expect(listItems[2].getAttribute('tabindex')).toBe('-1');

    idsListBuilder.dispatchEvent(createKeyboardEvent('ArrowDown'));
    expect(listItems[0].getAttribute('tabindex')).toBe('-1');
    expect(listItems[1].getAttribute('tabindex')).toBe('-1');
    expect(listItems[2].getAttribute('tabindex')).toBe('0');

    listItems[2].dispatchEvent(createKeyboardEvent(' '));
    expect(idsListBuilder.selectedLi.getAttribute('index')).toBe('2');

    // arrow up
    idsListBuilder.dispatchEvent(createKeyboardEvent('ArrowUp'));
    expect(listItems[0].getAttribute('tabindex')).toBe('-1');
    expect(listItems[1].getAttribute('tabindex')).toBe('0');
    expect(listItems[2].getAttribute('tabindex')).toBe('-1');

    listItems[1].dispatchEvent(createKeyboardEvent(' '));
    expect(idsListBuilder.selectedLi.getAttribute('index')).toBe('1');

    // for item level keyboard
    const keys = ['ArrowDown', 'ArrowUp', 'Tab'];
    for (let i = 0; i < keys.length; i++) {
      idsListBuilder.onClick(listItems[0]);
      listItems[0].dispatchEvent(createKeyboardEvent('Enter'));
      listItems[0].dispatchEvent(createKeyboardEvent(keys[i]));
      expect(listItems[0].querySelector('ids-input')).toBeFalsy();
    }

    listItems[0].dispatchEvent(createKeyboardEvent('Delete'));
    expect(idsListBuilder.container.querySelectorAll('div[part=list-item]')).toHaveLength(2);
  });

  it('update list item editor value', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.data = [];
    const clickEvent = new MouseEvent('click');

    // click add button
    const addBtnElem = idsListBuilder.container.querySelector('#button-add');
    addBtnElem.dispatchEvent(clickEvent);

    const listItems = idsListBuilder.container.querySelectorAll('div[part=list-item]');
    expect(listItems.length).toEqual(1);

    const itemInputElem = listItems[0].querySelector('ids-input');
    expect(itemInputElem).toBeTruthy();
    expect(itemInputElem.value).toEqual('New Value');

    itemInputElem.value = 'test value';
    itemInputElem.dispatchEvent(createKeyboardEvent('e', 'keyup'));
    listItems[0].dispatchEvent(createKeyboardEvent('Enter'));
    expect(idsListBuilder.data[0].manufacturerName).toEqual('test value');
  });

  // TODO: Errors are thrown when the button is clicked for no items
  it.skip('can add items with the button when empty', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.container.querySelector('#button-add').click();
  });
});
