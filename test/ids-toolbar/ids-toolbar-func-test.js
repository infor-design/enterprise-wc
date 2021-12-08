/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

import IdsToolbar from '../../src/components/ids-toolbar/ids-toolbar';

const exampleHTML = `
  <ids-toolbar-section id="appmenu-section">
    <ids-button icon="menu" role="button" id="button-appmenu">
      <span slot="text" class="audible">Application Menu Trigger</span>
    </ids-button>
  </ids-toolbar-section>
  <ids-toolbar-section id="title-section" type="title">
    <ids-text type="h3">My Toolbar</ids-text>
  </ids-toolbar-section>
  <ids-toolbar-section id="buttonset-section" type="buttonset" align="end">
    <ids-button id="button-1" role="button">
      <span slot="text">Text</span>
    </ids-button>

    <ids-menu-button role="button" id="button-2" menu="button-2-menu" dropdown-icon>
      <span slot="text">Menu</span>
    </ids-menu-button>
    <ids-popup-menu id="button-2-menu" target="#button-2">
      <ids-menu-group>
        <ids-menu-item value="1">Item One</ids-menu-item>
        <ids-menu-item value="2">Item Two</ids-menu-item>
        <ids-menu-item value="3">Item Three</ids-menu-item>
        <ids-menu-item>More Items
          <ids-popup-menu>
            <ids-menu-group>
              <ids-menu-item value="4">Item Four</ids-menu-item>
              <ids-menu-item value="4">Item Five</ids-menu-item>
              <ids-menu-item value="4">Item Six</ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>
        </ids-menu-item>
      </ids-menu-group>
    </ids-popup-menu>

    <ids-button id="button-3" disabled>
      <span slot="text" class="audible">Settings</span>
      <ids-icon slot="icon" icon="settings"></ids-icon>
    </ids-button>

    <ids-button id="button-4">
      <span slot="text" class="audible">Trash</span>
      <ids-icon slot="icon" icon="delete"></ids-icon>
    </ids-button>

    <a href="#">Outgoing Link</a>
  </ids-toolbar-section>

  <ids-toolbar-more-actions id="section-more">
    <ids-menu-group>
      <ids-menu-item value="1">Option One</ids-menu-item>
      <ids-menu-item value="2">Option Two</ids-menu-item>
      <ids-menu-item value="3">Option Three</ids-menu-item>
      <ids-menu-item>More Options
        <ids-popup-menu>
          <ids-menu-group>
            <ids-menu-item value="4">Option Four</ids-menu-item>
            <ids-menu-item value="5">Option Five</ids-menu-item>
            <ids-menu-item value="6">Option Six</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </ids-menu-item>
    </ids-menu-group>
  </ids-toolbar-more-actions>
`;

describe('IdsToolbar Component', () => {
  let toolbar;
  let sectionMore;
  let buttonAppMenu;
  let button1;
  let button2;
  let button3;
  let button4;

  beforeEach(async () => {
    const elem = new IdsToolbar();
    document.body.appendChild(elem);
    toolbar = document.querySelector('ids-toolbar');
    toolbar.insertAdjacentHTML('afterbegin', exampleHTML);

    // Reference sections/items
    sectionMore = document.querySelector('ids-toolbar-more-actions');
    buttonAppMenu = document.querySelector('#button-appmenu');
    button1 = document.querySelector('#button-1');
    button2 = document.querySelector('#button-2');
    button3 = document.querySelector('#button-3');
    button4 = document.querySelector('#button-4');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsToolbar();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-toolbar').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can get a list of its sections', () => {
    const sections = toolbar.sections;

    expect(sections).toBeDefined();
    expect(sections.length).toBe(4);
  });

  it('can get a list of its items', () => {
    const items = toolbar.items;

    expect(items).toBeDefined();
    expect(items.length).toBe(6);
  });

  it('should render type formatter', () => {
    const formatterHTML = `
      <ids-toolbar type="formatter">
        <ids-toolbar-section type="buttonset">
          <ids-button>
            <span slot="text" class="audible">Settings</span>
            <ids-icon slot="icon" icon="settings"></ids-icon>
          </ids-button>
          <ids-separator vertical></ids-separator>
        </ids-toolbar-section>
    </ids-toolbar>`;
    document.body.innerHTML = '';
    document.body.insertAdjacentHTML('afterbegin', formatterHTML);
    toolbar = document.querySelector('ids-toolbar');
    expect(toolbar.getAttribute('type')).toEqual('formatter');
    expect(toolbar.type).toEqual('formatter');
    toolbar.type = 'test';
    expect(toolbar.getAttribute('type')).toEqual(null);
    expect(toolbar.type).toEqual(null);
    toolbar.type = 'formatter';
    toolbar.separators[0].vertical = false;
    expect(toolbar.getAttribute('type')).toEqual('formatter');
    expect(toolbar.type).toEqual('formatter');
  });

  it('can be set type formatter', () => {
    expect(toolbar.getAttribute('type')).toEqual(null);
    expect(toolbar.type).toEqual(null);
    toolbar.type = 'formatter';
    expect(toolbar.getAttribute('type')).toEqual('formatter');
    expect(toolbar.type).toEqual('formatter');
    toolbar.type = 'test';
    expect(toolbar.getAttribute('type')).toEqual(null);
    expect(toolbar.type).toEqual(null);
  });

  it('can be disabled and enabled', () => {
    toolbar.disabled = true;

    expect(toolbar.disabled).toBeTruthy();
    expect(toolbar.container.classList.contains('disabled')).toBeTruthy();

    toolbar.disabled = false;

    expect(toolbar.disabled).toBeFalsy();
    expect(toolbar.container.classList.contains('disabled')).toBeFalsy();

    toolbar.setAttribute('disabled', true);

    expect(toolbar.disabled).toBeTruthy();
    expect(toolbar.container.classList.contains('disabled')).toBeTruthy();

    toolbar.removeAttribute('disabled');

    expect(toolbar.disabled).toBeFalsy();
    expect(toolbar.container.classList.contains('disabled')).toBeFalsy();
  });

  it('can be configured to be navigated with Tab/Shift+Tab, or not, with the "tabbable" feature', () => {
    toolbar.tabbable = true;

    expect(toolbar.tabbable).toBeTruthy();
    expect(button1.tabIndex).toBe(0);
    expect(button2.tabIndex).toBe(0);

    // Focus a button that isn't the first one, then disable "tabbable".
    // The previously focused item should retain its zero tabIndex,
    // while the others are all set to -1.
    button2.focus();
    toolbar.tabbable = false;

    expect(toolbar.tabbable).toBeFalsy();
    expect(button1.tabIndex).toBe(-1);
    expect(button2.tabIndex).toBe(0);
    expect(button3.tabIndex).toBe(-1);

    const currentTabbableElem = toolbar.detectTabbable();

    expect(currentTabbableElem).toBe(button2);
  });

  it('can announce what is focused and navigate among its items', () => {
    const items = toolbar.items;

    // Navigate forward (down) 2 items
    toolbar.navigate(2, true);

    // The component should be able to explain which of its items is focused
    expect(toolbar.focused).toEqual(items[2]);

    // Navigate backward (up) 1 item
    toolbar.navigate(-1, true);

    expect(toolbar.focused).toEqual(items[1]);

    // Won't navigate anywhere if a junk/NaN value is provided
    toolbar.navigate('forward', true);

    expect(toolbar.focused).toEqual(items[1]);
  });

  it('navigates nowhere if no number of steps is provided', () => {
    button1.focus();
    toolbar.navigate();

    expect(toolbar.focused).toEqual(button1);
  });

  it('loops around if `navigate()` tries to go too far', () => {
    sectionMore.focus();
    toolbar.navigate(1, true);

    expect(toolbar.focused).toEqual(buttonAppMenu);

    toolbar.navigate(-1, true);

    expect(toolbar.focused).toEqual(sectionMore.button);
  });

  it('skips disabled items while navigating', () => {
    button2.focus();
    toolbar.navigate(1, true);

    // Button 3 is disabled, Button 4 should become focused
    expect(toolbar.focused).toEqual(button4);
  });

  it('navigates menu items using the keyboard', () => {
    const navigateLeftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    const navigateRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });

    // Focus the first one
    button1.focus();

    expect(toolbar.focused).toEqual(button1);

    // Navigate right one item
    toolbar.dispatchEvent(navigateRightEvent);

    expect(toolbar.focused).toEqual(button2);

    // Navigate left two items (navigation will wrap to the bottom item)
    toolbar.dispatchEvent(navigateLeftEvent);
    toolbar.dispatchEvent(navigateLeftEvent);

    expect(toolbar.focused).toEqual(buttonAppMenu);
  });

  it('cannot navigate away from an open menu button', (done) => {
    const navigateLeftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
    const navigateRightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });

    // Button 2 is the Menu Button
    button2.focus();
    button2.menuEl.show();

    // Wait for the menu to be open
    setTimeout(() => {
      const topMenuItem = button2.menuEl.items[0];
      topMenuItem.dispatchEvent(navigateRightEvent);

      expect(button2.menuEl.visible).toBeTruthy();

      topMenuItem.dispatchEvent(navigateLeftEvent);

      expect(button2.menuEl.visible).toBeTruthy();
      done();
    }, 30);
  });
});
