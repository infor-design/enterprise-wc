/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import waitForTimeout from '../helpers/wait-for-timeout';
import createFromTemplate from '../helpers/create-from-template';

import IdsToolbar from '../../src/components/ids-toolbar/ids-toolbar';
import '../../src/components/ids-toolbar/ids-toolbar-section';
import '../../src/components/ids-toolbar/ids-toolbar-more-actions';

const getToolbarExampleHTML = async (extras = false) => `
     <ids-toolbar-section id="appmenu-section">
       <ids-button icon="menu" role="button" id="button-appmenu">
         <span class="audible">Application Menu Trigger</span>
       </ids-button>
     </ids-toolbar-section>
     <ids-toolbar-section id="title-section" type="title">
       <ids-text type="h3">My Toolbar</ids-text>
     </ids-toolbar-section>
     <ids-toolbar-section id="buttonset-section" type="buttonset" align="end">
       <ids-button id="button-1" role="button">
         <span>Text</span>
       </ids-button>

       <ids-menu-button role="button" id="button-2" menu="button-2-menu" dropdown-icon>
         <span>Menu</span>
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
         <span class="audible">Settings</span>
         <ids-icon icon="settings"></ids-icon>
       </ids-button>

       <ids-button id="button-4"${extras ? ' hidden' : ''}>
         <span class="audible">Trash</span>
         <ids-icon icon="delete"></ids-icon>
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

describe('IdsToolbarMoreActions Component', () => {
  let toolbar: any;
  let sectionMore: any;

  beforeEach(async () => {
    const elem: any = new IdsToolbar();
    document.body.appendChild(elem);
    toolbar = document.querySelector('ids-toolbar');
    toolbar.insertAdjacentHTML('afterbegin', await getToolbarExampleHTML());

    // Reference sections/items
    sectionMore = document.querySelector('ids-toolbar-more-actions');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('can be rendered', async () => {
    const errors = jest.spyOn(global.console, 'error');

    // Build and destroy a barebones Toolbar
    toolbar = createFromTemplate(toolbar, `<ids-toolbar id="my-toolbar">${await getToolbarExampleHTML()}</ids-toolbar>`);

    // Build and destroy a Toolbar with a hidden item, a disabled item, and overflow enabled
    toolbar = createFromTemplate(toolbar, `<ids-toolbar id="my-toolbar">${await getToolbarExampleHTML(true)}</ids-toolbar>`);

    expect(errors).not.toHaveBeenCalled();
  });

  test('has a menu button', () => {
    expect(sectionMore.menu.tagName).toBe('IDS-POPUP-MENU');
    expect(sectionMore.button.tagName).toBe('IDS-MENU-BUTTON');
  });

  test('can reference its predefined menu items', async () => {
    expect(sectionMore.predefinedMenuItems.length).toBe(4);
  });

  test('can activate/deactivate display of overflowed menu items', async () => {
    sectionMore.overflow = true;

    waitForTimeout(() => expect(sectionMore.querySelector('[more-actions]')).toBeDefined());
    waitForTimeout(() => expect(sectionMore.overflowItems.length).toBe(4));

    sectionMore.overflow = false;

    waitForTimeout(() => expect(sectionMore.querySelector('[more-actions]')).not.toBeDefined());
    waitForTimeout(() => expect(sectionMore.overflowItems.length).toBe(0));
  });

  test('always returns a "more" type', () => {
    expect(sectionMore.type).toBe('more');

    // It's not possible to change this to one of the other standard types
    sectionMore.type = 'fluid';

    expect(sectionMore.type).toBe('more');
  });

  test('focuses the inner button component when told to focus', () => {
    sectionMore.focus();
    expect(document.activeElement!.isEqualNode(sectionMore.button));
  });

  // Tests code path in `ids-menu` that searches a slot for groups instead of using `querySelector`
  test('gets slotted children when accessing its menu\'s `groups` property', () => {
    const groups = sectionMore.menu.groups;

    expect(groups.length).toBe(1);
  });

  test('can programatically open/close its menu', async () => {
    sectionMore.visible = true;

    waitForTimeout(() => expect(sectionMore.hasAttribute('visible').toBeTruthy()));
    expect(sectionMore.visible).toBeTruthy();

    sectionMore.visible = false;

    waitForTimeout(() => expect(sectionMore.hasAttribute('visible').toBeFalsy()));
    expect(sectionMore.visible).toBeFalsy();
  });
});

describe('IdsToolbarMoreActions Component (initialized with overflow)', () => {
  let toolbar: any;
  let selectedEventListener: any;

  beforeEach(async () => {
    // Build and destroy a Toolbar that will have overflow established by default
    toolbar = createFromTemplate(toolbar, `<div id="wrapper" style="width: 450px;">
       <ids-toolbar id="my-toolbar">${await getToolbarExampleHTML(true)}</ids-toolbar>
     </div>`);
  });

  afterEach(async () => {
    if (selectedEventListener) {
      document.body.removeEventListener('selected', selectedEventListener);
      selectedEventListener = null;
    }
  });

  test('can programmatically trigger selected events using More Actions menu items', async () => {
    selectedEventListener = jest.fn();
    document.body.addEventListener('selected', selectedEventListener);

    const sectionMore: any = document.querySelector('#section-more');
    const overflowItemButton1: any = sectionMore.overflowMenuItems[1];
    const toolbarElem: any = document.querySelector('#my-toolbar');
    toolbarElem.triggerSelectedEvent(overflowItemButton1);

    waitForTimeout(() => expect(selectedEventListener).toHaveBeenCalledTimes(1));
  });
});
