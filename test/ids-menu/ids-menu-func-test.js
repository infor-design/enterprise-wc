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
  <ids-menu-group id="primary">
    <ids-menu-header>My Items</ids-menu-header>
    <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
    <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
    <ids-menu-item id="item3" value="3">Item 3</ids-menu-item>
  </ids-menu-group>
  <ids-separator id="sep1"></ids-separator>
  <ids-menu-group id="secondary">
    <ids-menu-item id="item4" value="4">Item 4</ids-menu-item>
    <ids-menu-item id="item5" value="5">Item 5</ids-menu-item>
    <ids-separator id="sep2"></ids-separator>
    <ids-menu-item id="item6" value="6">Item 6</ids-menu-item>
  </ids-menu-group>
`;

describe('IdsMenu Component', () => {
  let menu;
  let group1;
  let header;
  let item1;
  let item2;
  let item3;
  let sep1;
  let group2;
  let item4;
  let sep2;
  let item5;
  let item6;

  beforeEach(async () => {
    menu = new IdsMenu();
    menu.id = 'test-menu';
    document.body.appendChild(menu);
    menu.insertAdjacentHTML('afterbegin', exampleHTML);

    group1 = document.querySelector('#primary');
    group2 = document.querySelector('#secondary');
    header = document.querySelector('#header');
    item1 = document.querySelector('#item1');
    item2 = document.querySelector('#item2');
    item3 = document.querySelector('#item3');
    item4 = document.querySelector('#item4');
    item5 = document.querySelector('#item5');
    item6 = document.querySelector('#item6');
    sep1 = document.querySelector('#sep1');
    sep2 = document.querySelector('#sep2');

    /*
    group1 = new IdsMenuGroup();
    group1.id = 'primary';
    header = new IdsMenuHeader();
    item1 = new IdsMenuItem();
    item1.value = '1';
    item2 = new IdsMenuItem();
    item2.value = '2';
    item3 = new IdsMenuItem();
    item3.value = '3';
    sep1 = new IdsSeparator();
    group2 = new IdsMenuGroup();
    group2.id = 'secondary';
    item4 = new IdsMenuItem();
    item4.value = '4';
    sep2 = new IdsSeparator();
    item5 = new IdsMenuItem();
    item5.value = '5';

    // Add to DOM
    group1.appendChild(header);
    group1.appendChild(item1);
    group1.appendChild(item2);
    group1.appendChild(item3);
    group2.appendChild(item4);
    group2.appendChild(sep2);
    group2.appendChild(item5);
    menu.appendChild(group1);
    menu.appendChild(sep1);
    menu.appendChild(group2);
    document.body.appendChild(menu);
    */
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    menu = null;
    group1 = null;
    group2 = null;
    header = null;
    item1 = null;
    item2 = null;
    item3 = null;
    item4 = null;
    item5 = null;
    item6 = null;
    sep1 = null;
    sep2 = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-menu').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can get a list of its groups', () => {
    const groups = menu.groups;

    expect(groups).toBeDefined();
    expect(groups.length).toBe(2);
  });

  it('can get a list of its items', () => {
    const items = menu.items;

    expect(items).toBeDefined();
    expect(items.length).toBe(6);
  });

  it('can announce what is focused and navigate among its items', () => {
    const items = menu.items;
    items[0].focus();

    // The component should be able to explain which of its items is focused
    expect(menu.focused).toEqual(items[0]);

    // Navigate forward (down) 2 items
    menu.navigate(2, true);

    expect(menu.focused).toEqual(items[2]);

    // Navigate backward (up) 1 item
    menu.navigate(-1, true);

    expect(menu.focused).toEqual(items[1]);
  });

  it('can select items (default)', () => {
    const items = menu.items;

    // Select Item 2
    menu.selectItem(item2);
    let selected = menu.getSelectedItems();

    expect(selected.length).toBe(1);
    expect(selected[0]).toEqual(item2);

    // Select the last item
    menu.selectItem(item5);
    selected = menu.getSelectedItems();

    expect(selected[1]).toEqual(item5);
  });

  it('can select items (single)', () => {
    group1.select = 'single';
    const items = menu.items;

    // Select Item 2
    menu.selectItem(item2);
    let selected = menu.getSelectedItems();

    expect(selected.length).toBe(1);
    expect(selected[0]).toEqual(item2);
    expect(item2.selected).toBeTruthy();

    // Select Item 3
    menu.selectItem(item3);
    selected = menu.getSelectedItems();

    // Only one item should still be selected
    expect(selected.length).toBe(1);
    expect(selected[0]).toEqual(item3);
    expect(item2.selected).toBeFalsy();
    expect(item3.selected).toBeTruthy();
  });

  it('can select items (multiple)', () => {
    group2.select = 'multiple';
    const items = menu.items;

    // Select Item 4
    menu.selectItem(item4);
    let selected = menu.getSelectedItems();

    expect(selected.length).toBe(1);
    expect(item4.selected).toBeTruthy();

    // Select Item 5
    menu.selectItem(item5);
    selected = menu.getSelectedItems();

    expect(selected.length).toBe(2);
    expect(item4.selected).toBeTruthy();
    expect(item5.selected).toBeTruthy();
  });

  it('can get/clear selected values', () => {
    group2.select = 'multiple';
    menu.selectItem(item4);
    menu.selectItem(item5);
    let values = menu.getSelectedValues();

    expect(values.length).toBe(2);
    expect(values[0]).toBe('4');
    expect(values[1]).toBe('5');

    // Clear selected values
    menu.clearSelectedItems();
    values = menu.getSelectedValues();

    expect(values.length).toBe(0);
    expect(item4.selected).toBeFalsy();
  });

  describe('IdsMenuItem', () => {
    it('can be disabled/enabled', () => {
      item1.disabled = true;

      expect(item1.disabled).toBeTruthy();
      expect(item1.tabindex).toEqual(-1);
      expect(item1.container.classList.contains('disabled')).toBeTruthy();

      item1.disabled = false;

      expect(item1.disabled).toBeFalsy();
      expect(item1.tabindex).toEqual(0);
      expect(item1.container.classList.contains('disabled')).toBeFalsy();
    });

    it('can be highlighted/unhighlighted programmatically', () => {
      item1.highlighted = true;

      expect(item1.container.classList.contains('highlighted')).toBeTruthy();

      item1.highlighted = false;

      expect(item1.container.classList.contains('highlighted')).toBeFalsy();
    });

    it('can have an icon set/removed', () => {
      item1.icon = 'settings';

      expect(item1.iconEl).toBeDefined();
      expect(item1.icon).toBe('settings');

      item1.icon = null;

      expect(item1.iconEl).not.toBeDefined();
      expect(item1.icon).toBe(undefined);
    });

    it('can set tabindex', () => {
      item1.tabindex = '-1';

      expect(item1.a.tabIndex).toEqual(-1);

      item1.tabindex = '0';

      expect(item1.a.tabIndex).toEqual(0);
    });

    it('can get text content', () => {
      item1.textContent = 'The First Item';

      expect(item1.text).toEqual('The First Item');
    });

    it('can explain what menu it exists within', () => {
      const thisMenu = item1.menu;

      expect(thisMenu).toEqual(menu);
      expect(thisMenu.id).toEqual('test-menu');
    });

    it('can explain what group it exists within', () => {
      const thisGroup = item1.group;

      expect(thisGroup).toEqual(group1);
      expect(thisGroup.id).toEqual('primary');
    });
  });
});
