/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import elemBuilderFactory from '../helpers/elem-builder-factory';
import waitFor from '../helpers/wait-for';

import IdsToolbar, {
  IdsToolbarSection,
  IdsToolbarMoreActions
} from '../../src/components/ids-toolbar/ids-toolbar';

const getToolbarExampleHTML = async (extras = false) => `
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
          <ids-menu-item value="1"${extras ? ' icon="settings"' : ''}>Item One</ids-menu-item>
          <ids-menu-item value="2"${extras ? ' disabled' : ''}>Item Two</ids-menu-item>
          <ids-menu-item value="3">Item Three</ids-menu-item>
          <ids-menu-item>More Items
            <ids-popup-menu>
              <ids-menu-group>
                <ids-menu-item value="4">Item Four</ids-menu-item>
                <ids-menu-item value="4"${extras ? ' hidden' : ''}>Item Five</ids-menu-item>
                <ids-menu-item value="4">Item Six</ids-menu-item>
              </ids-menu-group>
            </ids-popup-menu>
          </ids-menu-item>
        </ids-menu-group>
      </ids-popup-menu>

      <ids-button id="button-3"${extras ? ' disabled' : ''}>
        <span slot="text" class="audible">Settings</span>
        <ids-icon slot="icon" icon="settings"></ids-icon>
      </ids-button>

      <ids-button id="button-4"${extras ? ' hidden' : ''}>
        <span slot="text" class="audible">Trash</span>
        <ids-icon slot="icon" icon="delete"></ids-icon>
      </ids-button>
    </ids-toolbar-section>

    <ids-toolbar-more-actions id="section-more"${extras ? ' overflow' : ''}>
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

const elemBuilder = elemBuilderFactory();

describe('IdsToolbarMoreActions Component', () => {
  let toolbar;
  let sectionMore;

  beforeEach(async () => {
    const elem = new IdsToolbar();
    document.body.appendChild(elem);
    toolbar = document.querySelector('ids-toolbar');
    toolbar.insertAdjacentHTML('afterbegin', await getToolbarExampleHTML());

    // Reference sections/items
    sectionMore = document.querySelector('ids-toolbar-more-actions');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('can be rendered', async () => {
    const errors = jest.spyOn(global.console, 'error');

    // Build and destroy a barebones Toolbar
    elemBuilder.createElemFromTemplate(`<ids-toolbar id="my-toolbar">${await getToolbarExampleHTML()}</ids-toolbar>`);
    await elemBuilder.clearElement();

    // Build and destroy a Toolbar with a hidden item, a disabled item, and overflow enabled
    elemBuilder.createElemFromTemplate(`<ids-toolbar id="my-toolbar">${await getToolbarExampleHTML(true)}</ids-toolbar>`);
    await elemBuilder.clearElement();

    expect(errors).not.toHaveBeenCalled();
  });

  it('has a menu button', () => {
    expect(sectionMore.menu.tagName).toBe('IDS-POPUP-MENU');
    expect(sectionMore.button.tagName).toBe('IDS-MENU-BUTTON');
  });

  it('can reference its predefined menu items', async () => {
    expect(sectionMore.predefinedMenuItems.length).toBe(4);
  });

  it('can activate/deactivate display of overflowed menu items', async () => {
    sectionMore.overflow = true;

    await waitFor(() => expect(sectionMore.querySelector('[more-actions]')).toBeDefined());
    await waitFor(() => expect(sectionMore.overflowItems.length).toBe(4));

    sectionMore.overflow = false;

    await waitFor(() => expect(sectionMore.querySelector('[more-actions]')).not.toBeDefined());
    await waitFor(() => expect(sectionMore.overflowItems.length).toBe(0));
  });

  it('always returns a "more" type', () => {
    expect(sectionMore.type).toBe('more');

    // It's not possible to change this to one of the other standard types
    sectionMore.type = 'fluid';

    expect(sectionMore.type).toBe('more');
  });

  it('focuses the inner button component when told to focus', () => {
    sectionMore.focus();

    expect(sectionMore.shadowRoot.activeElement.isEqualNode(sectionMore.button));
  });

  // Tests code path in `ids-menu` that searches a slot for groups instead of using `querySelector`
  it('gets slotted children when accessing its menu\'s `groups` property', () => {
    const groups = sectionMore.menu.groups;

    expect(groups.length).toBe(1);
  });

  it('can programatically open/close its menu', async () => {
    sectionMore.visible = true;

    await waitFor(() => expect(sectionMore.hasAttribute('visible').toBeTruthy()));
    expect(sectionMore.visible).toBeTruthy();

    sectionMore.visible = false;

    await waitFor(() => expect(sectionMore.hasAttribute('visible').toBeFalsy()));
    expect(sectionMore.visible).toBeFalsy();
  });
});

// @TODO need an issue to resolve why this can't find overflow items
describe.skip('IdsToolbarMoreActions Component (initialized with overflow)', () => {
  let selectedEventListener;

  beforeEach(async () => {
    // Build and destroy a Toolbar that will have overflow established by default
    elemBuilder.createElemFromTemplate(`<div id="wrapper" style="width: 450px;">
      <ids-toolbar id="my-toolbar">${await getToolbarExampleHTML(true)}</ids-toolbar>
    </div>`);
  });

  afterEach(async () => {
    await elemBuilder.clearElement();
    if (selectedEventListener) {
      document.body.removeEventListener('selected', selectedEventListener);
      selectedEventListener = null;
    }
  });

  it('can programmatically trigger selected events using More Actions menu items', async () => {
    selectedEventListener = jest.fn();
    document.body.addEventListener('selected', selectedEventListener);

    const sectionMore = document.querySelector('#section-more');
    const overflowItemButton1 = sectionMore.overflowMenuItems[1];
    document.querySelector('#my-toolbar').triggerSelectedEvent(overflowItemButton1);

    await waitFor(() => expect(selectedEventListener).toHaveBeenCalledTimes(1));
  });
});
