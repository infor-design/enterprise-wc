/**
 * @jest-environment jsdom
 */
import IdsMenu, {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../../src/components/ids-menu/ids-menu';

const exampleHTML = `
  <ids-menu-header>My Items</ids-menu-header>
  <ids-menu-group id="primary" select="single">
    <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
    <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
    <ids-menu-item id="item3" value="3">Item 3</ids-menu-item>
  </ids-menu-group>
  <ids-separator id="sep1"></ids-separator>
  <ids-menu-group id="secondary">
    <ids-menu-item id="item4" value="4">Item 4</ids-menu-item>
    <ids-menu-item icon="settings" id="item5" value="5">Item 5</ids-menu-item>
    <ids-separator id="sep2"></ids-separator>
    <ids-menu-item id="item6" value="6">Item 6</ids-menu-item>
  </ids-menu-group>
`;

describe('IdsMenu Component', () => {
  let menu;
  let group1;
  let item1;
  let item2;
  let item3;
  let group2;
  let item4;
  let item5;
  let item6;

  beforeEach(async () => {
    menu = new IdsMenu();
    menu.id = 'test-menu';
    document.body.appendChild(menu);
    menu.insertAdjacentHTML('afterbegin', exampleHTML);

    group1 = document.querySelector('#primary');
    group2 = document.querySelector('#secondary');
    item1 = document.querySelector('#item1');
    item2 = document.querySelector('#item2');
    item3 = document.querySelector('#item3');
    item4 = document.querySelector('#item4');
    item5 = document.querySelector('#item5');
    item6 = document.querySelector('#item6');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    menu = null;
    group1 = null;
    group2 = null;
    item1 = null;
    item2 = null;
    item3 = null;
    item4 = null;
    item5 = null;
    item6 = null;
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

    // Navigate forward (down) 2 items
    menu.navigate(2, true);

    // The component should be able to explain which of its items is focused
    expect(menu.focused).toEqual(items[2]);

    // Navigate backward (up) 1 item
    menu.navigate(-1, true);

    expect(menu.focused).toEqual(items[1]);

    // Won't navigate anywhere if a junk/NaN value is provided
    menu.navigate('forward', true);

    expect(menu.focused).toEqual(items[1]);
  });

  it('navigates nowhere if no number of steps is provided', () => {
    item1.focus();
    menu.navigate();

    expect(menu.focused).toEqual(item1);
  });

  it('navigates from the last-hovered menu item, if applicable', () => {
    item2.focus();
    menu.lastHovered = item2;
    menu.navigate(1, true);

    expect(menu.focused).toEqual(item3);
  });

  it('loops around if `navigate()` tries to go too far', () => {
    item6.focus();
    menu.navigate(1, true);

    expect(menu.focused).toEqual(item1);

    menu.navigate(-1, true);

    expect(menu.focused).toEqual(item6);
  });

  it('can navigate without focusing a target', () => {
    item1.focus();
    menu.navigate(1);

    expect(menu.focused).toEqual(item1);
    expect(menu.lastNavigated).toEqual(item2);
  });

  it('skips disabled items while navigating', () => {
    item1.focus();
    item2.disabled = true;
    menu.navigate(1, true);

    expect(menu.focused).toEqual(item3);
  });

  it('can select items (default)', () => {
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

    // Deselect Item 5
    menu.selectItem(item5);
    selected = menu.getSelectedItems();

    expect(selected.length).toBe(1);
    expect(item4.selected).toBeTruthy();
    expect(item5.selected).toBeFalsy();
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

  it('can get/clear selected items in a specific group', () => {
    group2.select = 'multiple';
    menu.selectItem(item1);
    menu.selectItem(item4);
    menu.selectItem(item5);
    let items = menu.getSelectedItems(group2);

    expect(items.length).toEqual(2);

    // Only clear group 2
    menu.clearSelectedItems(group2);

    // get ALL selected items
    items = menu.getSelectedItems();

    expect(items.length).toEqual(1);
    expect(items.includes(item4)).toBeFalsy();
  });

  it('navigates menu items using the keyboard', () => {
    const navigateUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const navigateDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });

    // Focus the first one
    item1.focus();

    expect(menu.focused).toEqual(item1);

    // Navigate down one item
    menu.dispatchEvent(navigateDownEvent);

    expect(menu.focused).toEqual(item2);

    // Navigate up two items (navigation will wrap to the bottom item)
    menu.dispatchEvent(navigateUpEvent);
    menu.dispatchEvent(navigateUpEvent);

    expect(menu.focused).toEqual(item6);
  });

  it('highlights a menu item on click', () => {
    item2.select();
    item1.click();

    expect(menu.getSelectedItems().includes(item2)).toBeFalsy();
    expect(menu.lastNavigated.isEqualNode(item1)).toBeTruthy();
  });

  it('can get reference to highlighted items at the menu level', () => {
    item1.highlight();
    item2.highlight();
    const highlighted = menu.highlighted;

    expect(highlighted.length).toBe(2);
    expect(highlighted.includes(item1)).toBeTruthy();
  });

  it('won\'t highlight items that are disabled', () => {
    item1.disabled = true;
    menu.highlightItem(item1);

    expect(item1.highlighted).toBeFalsy();
  });

  it('listens for Enter key on a menu item and stores information', () => {
    const enterKeyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

    item2.select();
    item1.dispatchEvent(enterKeyEvent);

    expect(menu.getSelectedItems().includes(item2)).toBeFalsy();
    expect(menu.lastNavigated.isEqualNode(item1)).toBeTruthy();
  });

  it('can explain which of its items should be focused', () => {
    // Default value is the first available menu item
    let focusTarget = menu.focusTarget;

    expect(focusTarget.isEqualNode(menu.getFirstAvailableItem())).toBeTruthy();

    // If items are selected, the first selected item is the target
    item2.select();
    focusTarget = menu.focusTarget;

    expect(focusTarget.isEqualNode(item2)).toBeTruthy();

    // If a `lastHovered` property is set, this becomes the target
    menu.lastHovered = item4;
    focusTarget = menu.focusTarget;

    expect(focusTarget.isEqualNode(item4)).toBeTruthy();
  });

  it('can get the first available item in the list', () => {
    expect(menu.getFirstAvailableItem().isEqualNode(item1)).toBeTruthy();

    item1.disabled = true;
    item2.hidden = true;

    expect(menu.getFirstAvailableItem().isEqualNode(item3)).toBeTruthy();
  });

  it('won\'t select an item at the menu level that is disabled', () => {
    item1.disabled = true;
    menu.selectItem(item1);

    expect(item1.selected).toBeFalsy();
  });

  describe('IdsMenuItem', () => {
    it('can render a new item correctly', () => {
      const newItem = new IdsMenuItem();
      newItem.id = 'newitem';
      newItem.disabled = true;
      newItem.icon = 'settings';
      newItem.selected = true;
      newItem.value = 1;
      newItem.tabIndex = 1;

      group1.appendChild(newItem);
      newItem.template();

      expect(newItem.outerHTML).toMatchSnapshot();
    });

    it('can be disabled/enabled', () => {
      item1.disabled = true;

      expect(item1.disabled).toBeTruthy();
      expect(item1.tabIndex).toEqual(-1);
      expect(item1.container.classList.contains('disabled')).toBeTruthy();

      item1.disabled = false;

      expect(item1.disabled).toBeFalsy();
      expect(item1.tabIndex).toEqual(0);
      expect(item1.container.classList.contains('disabled')).toBeFalsy();

      // Set via attribute
      item1.setAttribute('disabled', true);

      expect(item1.disabled).toBeTruthy();
      expect(item1.tabIndex).toEqual(-1);
      expect(item1.container.classList.contains('disabled')).toBeTruthy();

      item1.removeAttribute('disabled');

      expect(item1.disabled).toBeFalsy();
      expect(item1.tabIndex).toEqual(0);
      expect(item1.container.classList.contains('disabled')).toBeFalsy();
    });

    it('can be selected/deselected', () => {
      item1.selected = true;

      expect(item1.selected).toBeTruthy();
      expect(item1.container.classList.contains('selected')).toBeTruthy();

      item1.selected = false;

      expect(item1.selected).toBeFalsy();
      expect(item1.container.classList.contains('selected')).toBeFalsy();

      item1.setAttribute('selected', true);

      expect(item1.selected).toBeTruthy();
      expect(item1.container.classList.contains('selected')).toBeTruthy();

      item1.removeAttribute('selected');

      expect(item1.selected).toBeFalsy();
      expect(item1.container.classList.contains('selected')).toBeFalsy();
    });

    it('can be highlighted/unhighlighted programmatically', () => {
      item1.highlighted = true;

      expect(item1.highlighted).toBeTruthy();
      expect(item1.container.classList.contains('highlighted')).toBeTruthy();

      item1.highlighted = false;

      expect(item1.highlighted).toBeFalsy();
      expect(item1.container.classList.contains('highlighted')).toBeFalsy();
    });

    it('cannot be highlighted if it\'s disabled', () => {
      item1.disabled = true;
      item1.highlighted = true;

      expect(item1.highlighted).toBeFalsy();
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
      item1.tabIndex = '-1';

      expect(item1.a.tabIndex).toEqual(-1);

      item1.tabIndex = '0';

      expect(item1.a.tabIndex).toEqual(0);

      // Set via attribute
      item1.setAttribute('tabindex', '-1');

      expect(item1.a.tabIndex).toEqual(-1);

      item1.setAttribute('tabindex', '0');

      expect(item1.a.tabIndex).toEqual(0);

      // Can't set null/junk values (results in 0 tabindex on the anchor)
      item1.tabIndex = 'junk';

      expect(item1.a.tabIndex).toEqual(0);

      item1.tabIndex = null;

      expect(item1.a.tabIndex).toEqual(0);

      // Can't set a number less than -1
      item1.tabIndex = -2;

      expect(item1.a.tabIndex).toEqual(0);
    });

    // Tests the single odd case in `tabIndex` that maps differently.
    it('won\'t change a tabIndex that isn\'t different', () => {
      item1.attributeChangedCallback('tabindex', '0', '0');

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

    it('can get/set a value (property only)', () => {
      // Attribute values are strings by default
      expect(item1.value).toEqual('1');

      // can set number values
      item1.value = 1;

      expect(item1.value).toEqual(1);

      // can set boolean values
      item1.value = true;

      expect(item1.value).toBeTruthy();

      // can set function values
      item1.value = (x) => Number(x) * 2;

      expect(item1.value(2)).toEqual(4);
    });

    it('can cancel selection with a vetoed `beforeselected` event handler', () => {
      item1.addEventListener('beforeselected', (e) => {
        e.detail.response(false);
      });
      item1.select();

      expect(item1.selected).toBeFalsy();
    });
  });
});
