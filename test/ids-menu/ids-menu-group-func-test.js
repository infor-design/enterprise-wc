/**
 * @jest-environment jsdom
 */
import IdsMenu, {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../../src/ids-menu/ids-menu';

const exampleHTML = `
  <ids-menu-group id="primary" select="single">
    <ids-menu-header id="inner-header">My Items</ids-menu-header>
    <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
    <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
    <ids-menu-item id="item3" value="3">Item 3</ids-menu-item>
  </ids-menu-group>
  <ids-separator id="sep1"></ids-separator>
  <ids-menu-header id="outer-header">Other Items</ids-menu-header>
  <ids-menu-group id="secondary" select="multiple" keep-open>
    <ids-menu-item id="item4" value="4">Item 4</ids-menu-item>
    <ids-menu-item icon="settings" id="item5" value="5">Item 5</ids-menu-item>
    <ids-separator id="sep2"></ids-separator>
    <ids-menu-item id="item6" value="6">Item 6</ids-menu-item>
  </ids-menu-group>
`;

describe('IdsMenuGroup Component', () => {
  let menu;
  let group1;
  let header1;
  let group2;
  let header2;
  let item1;

  beforeEach(async () => {
    menu = new IdsMenu();
    menu.id = 'test-menu';
    document.body.appendChild(menu);
    menu.insertAdjacentHTML('afterbegin', exampleHTML);
    group1 = document.querySelector('#primary');
    group2 = document.querySelector('#secondary');
    header1 = document.querySelector('#inner-header');
    header2 = document.querySelector('#outer-header');

    // get reference to an item in each group
    item1 = document.querySelector('#item1');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    menu = null;
    group1 = null;
    group2 = null;
    header1 = null;
    header2 = null;
    item1 = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-menu-group').length).toEqual(2);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has access to its parent menu', () => {
    expect(group1.menu.isEqualNode(menu)).toBeTruthy();
  });

  it('can be associated with a header', () => {
    // Header can be the first element inside the group
    expect(group1.header).toBeDefined();
    expect(group1.header.isEqualNode(header1)).toBeTruthy();

    // Header can be the element preceeding the group
    expect(group2.header).toBeDefined();
    expect(group2.header.isEqualNode(header2)).toBeTruthy();
  });

  it('should have a correct `aria-labelledBy` attribute', () => {
    expect(group1.container.getAttribute('aria-labelledby')).toEqual(header1.id);
    expect(group2.container.getAttribute('aria-labelledby')).toEqual(header2.id);
  });

  it('can programmatically change selection type', () => {
    group1.select = 'multiple';

    expect(item1.getAttribute('select')).toBe('multiple');
    expect(item1.container.classList.contains('has-multi-checkmark')).toBeTruthy();

    group1.select = 'none';

    expect(item1.getAttribute('select')).toBe(null);
    expect(item1.container.classList.contains('has-checkmark')).toBeFalsy();
    expect(item1.container.classList.contains('has-multi-checkmark')).toBeFalsy();
  });

  it('can programmatically change whether or not the menu stays open after selection', () => {
    group1.keepOpen = true;

    expect(group1.getAttribute('keep-open')).toBeTruthy();

    group1.keepOpen = false;

    expect(group1.getAttribute('keep-open')).toBeFalsy();
  });
});
