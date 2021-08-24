/**
 * @jest-environment jsdom
 */
import IdsToolbar, {
  IdsToolbarSection,
  IdsToolbarMoreActions
} from '../../src/components/ids-toolbar/ids-toolbar';

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

describe('IdsToolbarMoreActions Component', () => {
  let toolbar;
  let sectionMore;

  beforeEach(async () => {
    const elem = new IdsToolbar();
    document.body.appendChild(elem);
    toolbar = document.querySelector('ids-toolbar');
    toolbar.insertAdjacentHTML('afterbegin', exampleHTML);

    // Reference sections/items
    sectionMore = document.querySelector('ids-toolbar-more-actions');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('has a menu button', () => {
    expect(sectionMore.menu.tagName).toBe('IDS-POPUP-MENU');
    expect(sectionMore.button.tagName).toBe('IDS-MENU-BUTTON');
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
});
