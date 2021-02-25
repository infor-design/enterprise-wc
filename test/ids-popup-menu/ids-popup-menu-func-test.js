/**
 * @jest-environment jsdom
 */
import IdsPopupMenu, {
  IdsMenuGroup,
  IdsMenuHeader,
  IdsMenuItem,
  IdsSeparator
} from '../../src/ids-popup-menu/ids-popup-menu';

import IdsPopup from '../../src/ids-popup/ids-popup';

/*
The final markup displayed by this test component should look like the following:
================================================================================
<ids-popup-menu id="test-menu">
  <ids-menu-header id="header">My Items</ids-menu-header>
  <ids-menu-group id="primary">
    <ids-menu-item id="item1" value="1">Item 1</ids-menu-item>
    <ids-menu-item id="item2" value="2">Item 2</ids-menu-item>
    <ids-menu-item id="item3" value="3">Item 3</ids-menu-item>
  </ids-menu-group>
  <ids-separator id="sep1"></ids-separator>
  <ids-menu-group id="secondary">
    <ids-menu-item id="item4" value="4">Item 4</ids-menu-item>
    <ids-menu-item id="item5" value="5">Item 5</ids-menu-item>
    <ids-separator id="sep2"></ids-separator>
    <ids-menu-item id="item6">
      Item 6
      <ids-popup-menu id="test-submenu">
        <ids-menu-group id="subgroup">
          <ids-menu-item id="subitem1">Sub-Item 1</ids-menu-item>
          <ids-menu-item id="subitem2">Sub-Item 2</ids-menu-item>
          <ids-menu-item id="subitem3">Sub-Item 3</ids-menu-item>
        </ids-menu-group>
      </ids-popup-menu>
    </ids-menu-item>
  </ids-menu-group>
</ids-popup-menu>
================================================================================
*/

const newSubmenuHTML = `<ids-menu-group id="new-group">
  <ids-menu-item id="newitem1" value="new1">First New Item</ids-menu-item>
  <ids-menu-item id="newitem2" value="new2">Second New Item</ids-menu-item>
  <ids-menu-item id="newitem3" value="new3">Third New Item</ids-menu-item>
</ids-menu-group>`;

describe('IdsPopupMenu Component', () => {
  let menu;
  let group1;
  let group2;
  let header;
  let item1;
  let item2;
  let item3;
  let item4;
  let item5;
  let item6;
  let submenu;
  let subgroup;
  let subitem1;
  let subitem2;
  let subitem3;

  beforeEach(async () => {
    // Invoke/Append the main menu
    menu = new IdsPopupMenu();
    menu.id = 'test-menu';
    document.body.appendChild(menu);

    // Insert the header into the menu directly
    header = new IdsMenuHeader();
    header.id = 'header';
    header.textContent = 'My Items';
    menu.appendChild(header);

    // Store refs to all menu groups/headers/separators
    group1 = new IdsMenuGroup();
    group1.id = 'primary';
    menu.appendChild(group1);

    // Build top-level menu items
    item1 = new IdsMenuItem();
    item1.id = 'item1';
    item1.value = '1';
    item1.textContent = 'Item 1';
    group1.appendChild(item1);

    item2 = new IdsMenuItem();
    item2.id = 'item2';
    item2.value = '2';
    item2.textContent = 'Item 2';
    group1.appendChild(item2);

    item3 = new IdsMenuItem();
    item3.id = 'item3';
    item3.value = '3';
    item3.textContent = 'Item 3';
    group1.appendChild(item3);

    // Insert the separator because `parentNode` needs to be present when `template()` runs.
    // Separator 1 sits between the two groups
    menu.insertAdjacentHTML('beforeend', '<ids-separator id="sep1"></ids-separator>');

    group2 = new IdsMenuGroup();
    group2.id = 'secondary';
    menu.appendChild(group2);

    item4 = new IdsMenuItem();
    item4.id = 'item4';
    item4.value = '4';
    item4.textContent = 'Item 4';
    group2.appendChild(item4);

    item5 = new IdsMenuItem();
    item5.id = 'item5';
    item5.value = '5';
    item5.textContent = 'Item 5';
    group2.appendChild(item5);

    // Separator 2 is inside the group
    group2.insertAdjacentHTML('beforeend', '<ids-separator id="sep2"></ids-separator>');

    item6 = new IdsMenuItem();
    item6.id = 'item6';
    item6.textContent = 'Item 6';
    group2.appendChild(item6);

    // Invoke/Append the Submenu to Item 6
    submenu = new IdsPopupMenu();
    submenu.id = 'test-submenu';
    item6.appendChild(submenu);

    // Store refs to all submenu items/group
    subgroup = new IdsMenuGroup();
    subgroup.id = 'subgroup';
    submenu.appendChild(subgroup);

    subitem1 = new IdsMenuItem();
    subitem1.id = 'subitem1';
    subitem1.value = 'sub1';
    subitem1.textContent = 'Sub-Item 1';
    subgroup.appendChild(subitem1);

    subitem2 = new IdsMenuItem();
    subitem2.id = 'subitem2';
    subitem2.value = 'sub2';
    subitem2.textContent = 'Sub-Item 2';
    subgroup.appendChild(subitem2);

    subitem3 = new IdsMenuItem();
    subitem3.id = 'subitem3';
    subitem3.value = 'sub3';
    subitem3.textContent = 'Sub-Item 3';
    subgroup.appendChild(subitem3);
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
    submenu = null;
    subgroup = null;
    subitem1 = null;
    subitem2 = null;
    subitem3 = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    // Two popupmenus (top level and submenu)
    expect(document.querySelectorAll('ids-popup-menu').length).toEqual(2);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has an IdsPopup component in the shadow root', () => {
    // NOTE: Tests `ShadowRoot` detection in the Resize Mixin
    expect(menu.popup instanceof IdsPopup).toBeTruthy();
    expect(menu.popup.resizeDetectionTarget().isEqualNode(menu)).toBeTruthy();
  });

  it('can programmatically show and hide', () => {
    menu.show();

    expect(menu.hidden).toBeFalsy();
    expect(menu.popup.visible).toBeTruthy();

    menu.hide();

    expect(menu.hidden).toBeTruthy();
    expect(menu.popup.visible).toBeFalsy();
  });

  it('can be prevented from showing with a vetoed `beforeshow` event', () => {
    menu.addEventListener('beforeshow', (e) => {
      e.detail.response(false);
    });
    menu.show();

    expect(menu.hidden).toBeTruthy();
  });

  it('listens for `selected` event from menu items', (done) => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });
    menu.addEventListener('selected', mockCallback);

    menu.show();
    setTimeout(() => {
      item1.select();

      setTimeout(() => {
        expect(mockCallback.mock.calls.length).toBe(1);
        done();
      }, 20);
    }, 20);
  });

  it('will cause `selectItem` to open a submenu if a menu item contains one', (done) => {
    menu.selectItem(item6);

    setTimeout(() => {
      expect(item6.submenu.hidden).toBeFalsy();
      done();
    }, 20);
  });

  it('focuses the menu\'s `focusTarget` when the menu is shown', (done) => {
    item1.focus();
    menu.triggerEvent('show', menu.popup, { bubbles: true });

    setTimeout(() => {
      expect(menu.focused.isEqualNode(item1)).toBeTruthy();
      expect(menu.focused.isEqualNode(menu.focusTarget)).toBeTruthy();
      done();
    }, 20);
  });

  it('can change its trigger type', () => {
    menu.trigger = 'click';

    expect(menu.trigger).toEqual('click');

    menu.trigger = 'immediate';

    expect(menu.trigger).toEqual('immediate');

    // Junk values get reset to `contextmenu`
    menu.trigger = 'howdy';

    expect(menu.trigger).toEqual('contextmenu');
  });

  it('can set a target as an element', () => {
    const targetElem = document.createElement('button');
    targetElem.id = 'test-button';
    targetElem.type = 'button';
    document.body.appendChild(targetElem);

    menu.target = targetElem;

    expect(menu.popup.alignTarget.isEqualNode(targetElem)).toBeTruthy();
  });

  it('closes the menu if there is a click event outside the open menu', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    menu.show();

    setTimeout(() => {
      expect(menu.popup.visible).toBeTruthy();

      // Simulate a click event on a header inside the menu.
      // This event will NOT cause the menu to close.
      // @TODO: not sure why this isn't causing the "else" path to take in the tests
      header.dispatchEvent(clickEvent);
      setTimeout(() => {
        expect(menu.popup.visible).toBeTruthy();

        // Simulate a document click (outside the menu).
        // This should cause the menu to close.
        document.body.dispatchEvent(clickEvent);

        setTimeout(() => {
          expect(menu.popup.visible).toBeFalsy();
          done();
        }, 20);
      }, 20);
    }, 20);
  });

  it('navigates between menu and submenu with arrow keys', (done) => {
    const navigateRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    const navigateLeftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });

    // Focus the item with the submenu and press the right arrow
    item6.focus();
    item6.dispatchEvent(navigateRightEvent);

    setTimeout(() => {
      expect(item6.submenu.hidden).toBeFalsy();

      // Press Left to close the submenu and refocus item 6
      subitem1.dispatchEvent(navigateLeftEvent);
      setTimeout(() => {
        expect(item6.submenu.hidden).toBeTruthy();
        done();
      }, 20);
    }, 20);
  });

  it('cannot trigger a submenu to open on an item that doesn\'t have one', (done) => {
    const navigateRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });

    item5.focus();
    item5.dispatchEvent(navigateRightEvent);

    setTimeout(() => {
      expect(item5.container.getAttribute('aria-expanded')).toBeFalsy();
      done();
    }, 20);
  });

  it('closes an open menu when the escape key is pressed', () => {
    const closeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    menu.show();

    setTimeout(() => {
      expect(menu.popup.visible).toBeTruthy();
      menu.dispatchEvent(closeEvent);

      setTimeout(() => {
        expect(menu.popup.visible).toBeFalsy();

        // Try to dispatch the event against a closed menu.  Nothing will happen.
        // @TODO Rework this to listen for a `hide` event from IdsPopup.
        menu.dispatchEvent(closeEvent);
        setTimeout(() => {
          expect(menu.popup.visible).toBeFalsy();
        }, 20);
      }, 20);
    }, 20);
  });

  it('can programmatically hide all submenus', (done) => {
    menu.show();

    setTimeout(() => {
      item6.submenu.show();

      setTimeout(() => {
        menu.hideSubmenus();

        setTimeout(() => {
          expect(item6.submenu.hidden).toBeTruthy();
          done();
        }, 20);
      }, 20);
    }, 20);
  });

  it('will not hide submenus that designated `ignored`', (done) => {
    menu.show();

    setTimeout(() => {
      item6.submenu.show();

      setTimeout(() => {
        menu.hideSubmenus(item6);

        setTimeout(() => {
          expect(item6.submenu.hidden).toBeFalsy();
          done();
        }, 20);
      }, 20);
    }, 20);
  });

  // @TODO, how do we test `contextmenu` event being triggered on `window`?
  it.skip('opens on `contextmenu` event by default', (done) => {
    const contextMenuEvent = new MouseEvent('contextmenu', {
      bubbles: true,
      clientX: 10,
      clientY: 10,
      pageX: 10,
      pageY: 10
    });
    document.body.dispatchEvent(contextMenuEvent);

    setTimeout(() => {
      expect(menu.hidden).toBeFalsy();
      done();
    }, 20);
  });

  // Tests `connectedCallback`'s extra path
  it('won\'t be set to hidden if it\'s already hidden', () => {
    const newMenu = new IdsPopupMenu();
    newMenu.id = 'new-menu';
    newMenu.hidden = true;
    document.body.appendChild(newMenu);

    expect(newMenu.hidden).toBeTruthy();
  });

  describe('IdsMenuItem', () => {
    it('can have a submenu', () => {
      expect(item6.hasSubmenu).toBeTruthy();
    });

    it('can dismount the submenu', () => {
      item6.submenu.remove();

      expect(item6.hasSubmenu).toBeFalsy();
    });

    it('can add a new submenu', () => {
      // Add a new submenu to item 5
      const newSubmenu = new IdsPopupMenu();
      newSubmenu.id = 'new-submenu';
      newSubmenu.insertAdjacentHTML('afterbegin', newSubmenuHTML);
      item5.appendChild(newSubmenu);

      expect(item5.hasSubmenu).toBeTruthy();
      expect(item5.submenu.items.length).toEqual(3);
    });

    it('can render a new item correctly', () => {
      const newItem = new IdsMenuItem();
      newItem.id = 'newitem';
      newItem.icon = 'settings';
      newItem.selected = true;
      newItem.value = 1;
      newItem.tabIndex = 1;

      group1.appendChild(newItem);
      const newSubmenu = new IdsPopupMenu();
      newSubmenu.id = 'new-submenu';
      newSubmenu.insertAdjacentHTML('afterbegin', newSubmenuHTML);
      newItem.appendChild(newSubmenu);

      newItem.template();

      expect(newItem.outerHTML).toMatchSnapshot();
    });

    it.skip('can programmatically show/hide the submenu', (done) => {
      item6.showSubmenu();

      setTimeout(() => {
        expect(item6.submenu.hidden).toBeFalsy();

        item6.hideSubmenu();
        setTimeout(() => {
          expect(item6.submenu.hidden).toBeTruthy();
          done();
        }, 20);
      }, 20);
    });

    it('will not close the menu if selected from a `keep-open` group', (done) => {
      const selectedEvent = new CustomEvent('selected', {
        bubbles: true,
        detail: { elem: item1 }
      });
      group1.keepOpen = true;
      menu.show();

      setTimeout(() => {
        menu.dispatchEvent(selectedEvent);

        setTimeout(() => {
          expect(menu.popup.visible).toBeTruthy();

          // Remove keep-open and try selecting the item again
          group1.keepOpen = false;
          menu.dispatchEvent(selectedEvent);

          setTimeout(() => {
            expect(menu.popup.visible).toBeFalsy();
            done();
          }, 20);
        }, 20);
      }, 20);
    });

    it('cannot be unhighlighted if its submenu is open', (done) => {
      menu.show();

      setTimeout(() => {
        item6.submenu.show();

        setTimeout(() => {
          item6.unhighlight();

          expect(item6.highlighted).toBeFalsy();
          expect(item6.container.classList.contains('highlighted')).toBeFalsy();
          done();
        }, 20);
      }, 20);
    });

    // @TODO Fails because currently a nested Popupmenu's class
    // resolves as HTMLElement instead of IdsPopupMenu. Following these steps
    // in a true browser environment works.
    it.skip('shows/hides its submenu in response to mouse events', (done) => {
      const menuItemEnter = new MouseEvent('mouseenter');
      const menuItemEnterHandler = jest.fn();
      item6.addEventListener('mouseenter', menuItemEnterHandler);

      const menuItemLeave = new MouseEvent('mouseleave');
      const menuItemLeaveHandler = jest.fn();
      item6.addEventListener('mouseenter', menuItemLeaveHandler);

      menu.show();

      setTimeout(() => {
        item6.dispatchEvent(menuItemEnter);

        setTimeout(() => {
          expect(menuItemEnterHandler.mock.calls.length).toBe(1);
          expect(item6.submenu.hidden).toBeFalsy();

          item6.dispatchEvent(menuItemLeave);

          setTimeout(() => {
            expect(menuItemLeaveHandler.mock.calls.length).toBe(1);
            expect(item6.submenu.hidden).toBeTruthy();
            done();
          }, 210);
        }, 210);
      }, 20);
    });
  });
});
