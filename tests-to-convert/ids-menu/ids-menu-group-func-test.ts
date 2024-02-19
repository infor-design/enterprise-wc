/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import IdsMenu from '../../src/components/ids-menu/ids-menu';

const exampleHTML = `
  <ids-menu-group id="primary" select="single" aria-labelledby="primary-header">
    <ids-menu-header id="primary-header">My Items</ids-menu-header>
    <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
    <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
    <ids-menu-item id="item3" value="3">Item 3</ids-menu-item>
  </ids-menu-group>
  <ids-separator id="sep1"></ids-separator>
  <ids-menu-group id="secondary" select="multiple" keep-open>
    <ids-menu-item id="item4" value="4">Item 4</ids-menu-item>
    <ids-menu-item icon="settings" id="item5" value="5">Item 5</ids-menu-item>
    <ids-separator id="sep2"></ids-separator>
    <ids-menu-item id="item6" value="6">Item 6</ids-menu-item>
  </ids-menu-group>
`;

describe('IdsMenuGroup Component', () => {
  let menu: any;
  let group1: any;
  let header1: any;
  let group2: any;
  let item1: any;
  let item4: any;
  let item5: any;
  let item6: any;

  beforeEach(async () => {
    menu = new IdsMenu();
    menu.id = 'test-menu';
    document.body.appendChild(menu);
    menu.insertAdjacentHTML('afterbegin', exampleHTML);
    group1 = document.querySelector('#primary');
    group2 = document.querySelector('#secondary');
    header1 = document.querySelector('#primary-header');

    // get reference to an item in each group
    item1 = document.querySelector('#item1');
    item4 = document.querySelector('#item4');
    item5 = document.querySelector('#item5');
    item6 = document.querySelector('#item6');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    menu = null;
    group1 = null;
    group2 = null;
    header1 = null;
    item1 = null;
    item4 = null;
    item5 = null;
    item6 = null;
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-menu-group').length).toEqual(2);
    expect(errors).not.toHaveBeenCalled();
  });

  test('has access to its parent menu', () => {
    expect(group1.menu.isEqualNode(menu)).toBeTruthy();
  });

  test('can be associated with a header', () => {
    expect(group1.header).toBeDefined();
    expect(group1.header.isEqualNode(header1)).toBeTruthy();
  });

  test('can programmatically change selection type', () => {
    group1.select = 'multiple';

    expect(group1.getAttribute('select')).toBe('multiple');
    expect(item1.container.classList.contains('has-multi-checkmark')).toBeTruthy();

    group1.select = 'none';

    expect(group1.getAttribute('select')).toBe(null);
    expect(item1.container.classList.contains('has-checkmark')).toBeFalsy();
    expect(item1.container.classList.contains('has-multi-checkmark')).toBeFalsy();
  });

  test('can programmatically change whether or not the menu stays open after selection', () => {
    group1.keepOpen = true;

    expect(group1.getAttribute('keep-open')).toBeTruthy();

    group1.keepOpen = false;

    expect(group1.getAttribute('keep-open')).toBeFalsy();
  });

  test('can deselect all but a single item from a multi-select group', () => {
    item4.select();
    item5.select();
    item6.select();
    group2.deselectAllExcept(item5);
    const selected = menu.getSelectedItems(group2);

    expect(selected.length).toEqual(1);
    expect(selected[0].isEqualNode(item5)).toBeTruthy();
  });

  // @TODO Figure out why these tests return `null`
  it.skip('generates a meaningful "aria-label" attribute based on its group header', () => {
    expect(group1.getAttribute('aria-label')).toBe('My Items');
  });
  it.skip('generates a meaningful "aria-label" attribute if no header exists', () => {
    expect(group2.getAttribute('aria-label')).toBe('Menu group containing 3 item(s)');
  });
});
