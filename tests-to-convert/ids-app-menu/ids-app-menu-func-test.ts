/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../../src/components/ids-app-menu/ids-app-menu';
import '../../src/components/ids-accordion/ids-accordion';
import '../../src/components/ids-button/ids-button';
import '../../src/components/ids-search-field/ids-search-field';
import '../../src/components/ids-toolbar/ids-toolbar';
import '../../src/components/ids-text/ids-text';

import createFromTemplate from '../helpers/create-from-template';
import waitForTimeout from '../helpers/wait-for-timeout';
import type IdsAppMenu from '../../src/components/ids-app-menu/ids-app-menu';
import type IdsAccordion from '../../src/components/ids-accordion/ids-accordion';
import type IdsSearchField from '../../src/components/ids-search-field/ids-search-field';

const createAppMenu = async (appMenu: any) => {
  appMenu = await createFromTemplate(appMenu, `<ids-app-menu id="app-menu">
   <img slot="avatar" src="/assets/avatar-placeholder.jpg" alt="Picture of Richard Fairbanks" />
   <ids-text slot="username" font-size="24" font-weight="semi-bold">Richard Fairbanks</ids-text>
   <ids-search-field id="search" slot="search" label=""></ids-search-field>
   <ids-accordion>
     <ids-accordion-panel id="p1">
       <ids-accordion-header id="h1" slot="header">
         <ids-text>First Pane</ids-text>
       </ids-accordion-header>
     </ids-accordion-panel>
     <ids-accordion-panel id="p2">
       <ids-accordion-header id="h2" slot="header">
         <ids-text>Second Pane</ids-text>
       </ids-accordion-header>
     </ids-accordion-panel>
     <ids-accordion-panel id="p3">
       <ids-accordion-header id="h3" slot="header">
         <ids-text>Third Pane</ids-text>
       </ids-accordion-header>
       <ids-accordion-panel slot="content" id="sp1">
         <ids-accordion-header id="sh1" slot="header">
           <ids-text font-size="14">Sub-Pane 1</ids-text>
         </ids-accordion-header>
       </ids-accordion-panel>
       <ids-accordion-panel slot="content" id="sp2">
         <ids-accordion-header id="sh2" slot="header">
           <ids-text font-size="14">Sub-Pane 2</ids-text>
         </ids-accordion-header>
       </ids-accordion-panel>
       <ids-accordion-panel slot="content" id="sp3">
         <ids-accordion-header id="sh3" slot="header">
           <ids-text font-size="14">Sub-Pane 3</ids-text>
         </ids-accordion-header>
       </ids-accordion-panel>
     </ids-accordion-panel>
   </ids-accordion>
 </ids-app-menu>`);
  return appMenu;
};

describe('IdsAppMenu Component (rendering)', () => {
  let appMenuElem: IdsAppMenu;
});

describe('IdsAppMenu Component', () => {
  let appMenuElem: IdsAppMenu;

  beforeEach(async () => {
    appMenuElem = await createAppMenu(appMenuElem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('has default settings', async () => {
    expect(appMenuElem.type).toBe('app-menu');
    expect(appMenuElem.edge).toBe('start');
  });

  test('should convert inner accordions to use the "app-menu" color variant', async () => {
    const acc = appMenuElem.querySelector('ids-accordion') as IdsAccordion;
    waitForTimeout(() => expect(acc.colorVariant).toBe('app-menu'));
  });

  test('can close by pressing the escape key', () => {
    const closeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });

    // Open the Menu
    appMenuElem.show();
    waitForTimeout(() => expect(appMenuElem.visible).toBeTruthy());

    // Focus the first header and "Press Escape"
    const header1: any = document.querySelector('#h1');
    header1.focus();
    header1.dispatchEvent(closeEvent);
    waitForTimeout(() => expect(appMenuElem.visible).toBeFalsy());

    // Dispatch again while closed (coverage)
    header1.dispatchEvent(closeEvent);
    waitForTimeout(() => expect(appMenuElem.visible).toBeFalsy());
  });

  test('wont close by pressing any key but escape', () => {
    const closeEvent = new KeyboardEvent('keydown', { key: 'a', bubbles: true });

    // Open the Menu
    appMenuElem.show();
    waitForTimeout(() => expect(appMenuElem.visible).toBeTruthy());

    // Focus the first header and "Press Escape"
    const header1: any = document.querySelector('#h1');
    header1.focus();
    header1.dispatchEvent(closeEvent);
    waitForTimeout(() => expect(appMenuElem.visible).toBeTruthy());

    // Dispatch again while closed (coverage)
    header1.dispatchEvent(closeEvent);
    waitForTimeout(() => expect(appMenuElem.visible).toBeTruthy());
  });

  test('provides an API for its accordion element', async () => {
    expect(appMenuElem.accordion?.name).toBe('ids-accordion');
  });

  test('filters its navigation accordion when the search field is used', async () => {
    const searchField = appMenuElem.querySelector('#search') as IdsSearchField;
    expect(searchField).toBeDefined();

    // Filter for a top-level match...
    searchField.value = 'Second';

    // ...all but "Second Pane" are hidden
    let hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
    expect(hiddenEls.length).toBe(5);

    // Clear filter by clearing the search field value...
    searchField.value = '';

    // ...no headers should be filtered out
    hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
    expect(hiddenEls.length).toBe(0);

    // Filter for a child match...
    searchField.value = 'Sub-Pane';

    // ...one header should be tagged as having a child match
    hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
    expect(hiddenEls.length).toBe(3);
    expect(document.querySelector('#h3')?.hasAttribute('child-filter-match')).toBeTruthy();
  });

  test('filters its navigation using its API', async () => {
    const searchField = appMenuElem.querySelector('#search');
    expect(searchField).toBeDefined();

    // Filter for a top-level match...
    appMenuElem.filterAccordion('Second');

    // ...all but "Second Pane" are hidden
    let hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
    expect(hiddenEls.length).toBe(5);

    // Clear filter by clearing the search field value...
    appMenuElem.clearFilterAccordion();

    // ...no headers should be filtered out
    hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
    expect(hiddenEls.length).toBe(0);

    // Filter for a child match...
    appMenuElem.filterAccordion('Sub-Pane');

    // ...one header should be tagged as having a child match
    hiddenEls = appMenuElem.querySelectorAll('[hidden-by-filter]');
    expect(hiddenEls.length).toBe(3);
    expect((document.querySelector('#h3') as any).hasAttribute('child-filter-match')).toBeTruthy();

    // Edge cases
    appMenuElem.querySelectorAll('ids-accordion-panel').forEach((panel: any) => {
      panel.remove();
    });
    appMenuElem.filterAccordion('');
    appMenuElem.accordion?.remove();
    appMenuElem.filterAccordion('');
  });
});
