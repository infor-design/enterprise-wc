/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/books.json';
import menuData from '../../src/assets/data/menu-contents.json';

describe('IdsDataGrid Component', () => {
  let dataGrid: any;
  let container: any;

  // Header contextmenu dataset
  const headerMenuData = {
    id: 'grid-header-menu',
    contents: [{
      id: 'actions-group',
      items: [
        { id: 'actions-split', value: 'actions-split', text: 'Split' },
        { id: 'actions-sort', value: 'actions-sort', text: 'Sort' },
        { id: 'actions-hide', value: 'actions-hide', text: 'Hide' }
      ]
    }],
  };

  // Set up columns
  const formatters: any = new IdsDataGridFormatters();
  const columns = [{
    id: 'selectionCheckbox',
    sortable: false,
    resizable: false,
    formatter: formatters.selectionCheckbox,
    align: 'center',
    width: 20
  }, {
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    formatter: formatters.text
  }];

  const columnGroups = [{
    colspan: 2,
    id: 'group1',
    name: 'Column Group One'
  }];

  beforeEach(async () => {
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    container.appendChild(dataGrid);
    document.body.appendChild(container);
    dataGrid.columns = deepClone(columns);
    dataGrid.columnGroups = deepClone(columnGroups);
    dataGrid.data = deepClone(dataset);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    container = null;
    dataGrid = null;
  });

  test('can set the header menu id setting', () => {
    expect(dataGrid.getAttribute('header-menu-id')).toEqual(null);
    expect(dataGrid.headerMenuId).toEqual(null);
    dataGrid.headerMenuId = 'test';
    expect(dataGrid.getAttribute('header-menu-id')).toEqual('test');
    expect(dataGrid.headerMenuId).toEqual('test');
    dataGrid.removeAttribute('header-menu-id');
    expect(dataGrid.getAttribute('header-menu-id')).toEqual(null);
    expect(dataGrid.headerMenuId).toEqual(null);
  });

  test('can set the menu id setting', () => {
    expect(dataGrid.getAttribute('menu-id')).toEqual(null);
    expect(dataGrid.menuId).toEqual(null);
    dataGrid.menuId = 'test';
    expect(dataGrid.getAttribute('menu-id')).toEqual('test');
    expect(dataGrid.menuId).toEqual('test');
    dataGrid.removeAttribute('menu-id');
    expect(dataGrid.getAttribute('menu-id')).toEqual(null);
    expect(dataGrid.menuId).toEqual(null);
  });

  test('can set the header menu data setting', () => {
    expect(dataGrid.headerMenuData).toEqual(null);
    dataGrid.headerMenuData = headerMenuData;
    expect(dataGrid.headerMenuData).toEqual(headerMenuData);
    dataGrid.headerMenuData = null;
    expect(dataGrid.headerMenuData).toEqual(null);
  });

  test('can set the menu data setting', () => {
    expect(dataGrid.menuData).toEqual(null);
    dataGrid.menuData = menuData;
    expect(dataGrid.menuData).toEqual(menuData);
    dataGrid.menuData = null;
    expect(dataGrid.menuData).toEqual(null);
  });

  test('should contextmenu thru data', async () => {
    dataGrid.menuData = deepClone(menuData);
    dataGrid.headerMenuData = deepClone(headerMenuData);

    const sel = {
      headerGroupCell: '.ids-data-grid-column-groups .ids-data-grid-header-cell',
      headerCell: '.ids-data-grid-header [role="row"]:not(.ids-data-grid-column-groups) .ids-data-grid-header-cell:nth-child(2)',
      bodyCell: '.ids-data-grid-body [role="row"]:nth-child(2) [role="gridcell"]:nth-child(2)',
    };
    const headerGroupCell = dataGrid.shadowRoot.querySelector(sel.headerGroupCell);
    const headerCell = dataGrid.shadowRoot.querySelector(sel.headerCell);
    const bodyCell = dataGrid.shadowRoot.querySelector(sel.bodyCell);

    const headerSlot = dataGrid.shadowRoot.querySelector('slot[name="header-contextmenu"]');
    const bodySlot = dataGrid.shadowRoot.querySelector('slot[name="contextmenu"]');
    const headerMenu = headerSlot.assignedElements()[0];
    const bodyMenu = bodySlot.assignedElements()[0];

    expect(headerGroupCell).toBeTruthy();
    expect(headerCell).toBeTruthy();
    expect(bodyCell).toBeTruthy();
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeFalsy();

    headerGroupCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeTruthy();
    expect(bodyMenu.visible).toBeFalsy();

    bodyCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeTruthy();

    headerCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeTruthy();
    expect(bodyMenu.visible).toBeFalsy();

    bodyCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeTruthy();
    bodyMenu.items[0].select();
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeFalsy();

    headerCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeTruthy();
    expect(bodyMenu.visible).toBeFalsy();
    headerMenu.items[0].select();
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeFalsy();
  });

  test('should show contextmenu thru a slot', async () => {
    document.body.innerHTML = '';
    container = null;
    dataGrid = null;

    const sel = {
      headerCell: '.ids-data-grid-header [role="row"]:not(.ids-data-grid-column-groups) .ids-data-grid-header-cell:nth-child(2)',
      bodyCell: '.ids-data-grid-body [role="row"]:nth-child(2) [role="gridcell"]:nth-child(2)',
    };

    const html = `
      <ids-container role="main" padding="8" hidden>
        <ids-data-grid id="data-grid-contextmenu-thru-slot" row-selection="multiple" label="Books">
          <ids-popup-menu trigger-type="custom" slot="header-contextmenu">
            <ids-menu-group>
              <ids-menu-item value="header-split">Split</ids-menu-item>
              <ids-menu-item value="header-sort">Sort</ids-menu-item>
              <ids-menu-item value="header-hide">Hide</ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>
          <ids-popup-menu trigger-type="custom" slot="contextmenu">
            <ids-menu-group>
              <ids-menu-item value="item-one">Item One</ids-menu-item>
              <ids-menu-item value="item-two">Item Two</ids-menu-item>
              <ids-menu-item value="item-three">Item Three</ids-menu-item>
              <ids-menu-item value="item-four">Item Four</ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>
        </ids-data-grid>
      </ids-container>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    container = document.querySelector('ids-container');
    dataGrid = document.querySelector('#data-grid-contextmenu-thru-slot');

    expect(container).toBeTruthy();
    expect(dataGrid).toBeTruthy();
    dataGrid.columns = deepClone(columns);
    dataGrid.data = deepClone(dataset);

    const headerCell: any = dataGrid.shadowRoot.querySelector(sel.headerCell);
    const bodyCell: any = dataGrid.shadowRoot.querySelector(sel.bodyCell);

    const headerSlot = dataGrid.shadowRoot.querySelector('slot[name="header-contextmenu"]');
    const bodySlot = dataGrid.shadowRoot.querySelector('slot[name="contextmenu"]');
    const headerMenu = headerSlot.assignedElements()[0];
    const bodyMenu = bodySlot.assignedElements()[0];

    expect(headerCell).toBeTruthy();
    expect(bodyCell).toBeTruthy();
    expect(headerMenu).toBeTruthy();
    expect(bodyMenu).toBeTruthy();
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeFalsy();

    headerCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeTruthy();
    expect(bodyMenu.visible).toBeFalsy();

    bodyCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeTruthy();
    bodyMenu.items[0].select();
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeFalsy();
    headerMenu.dispatchEvent(new MouseEvent('selected', { bubbles: true }));
    bodyMenu.dispatchEvent(new MouseEvent('selected', { bubbles: true }));
  });

  test('should show a contextmenu via id', async () => {
    document.body.innerHTML = '';
    container = null;
    dataGrid = null;

    const sel = {
      headerCell: '.ids-data-grid-header .ids-data-grid-row:not(.ids-data-grid-column-groups) .ids-data-grid-header-cell:nth-child(2)',
      bodyCell: '.ids-data-grid-body [role="row"]:nth-child(2) [role="gridcell"]:nth-child(2)',
    };

    const html = `
      <ids-container role="main" padding="8" hidden>
        <ids-data-grid id="data-grid-contextmenu-thru-id" header-menu-id="grid-header-menu" menu-id="grid-actions-menu" row-selection="multiple" label="Books">
        </ids-data-grid>
        <ids-popup-menu id="grid-header-menu" trigger-type="custom">
          <ids-menu-group>
            <ids-menu-item value="header-split">Split</ids-menu-item>
            <ids-menu-item value="header-sort">Sort</ids-menu-item>
            <ids-menu-item value="header-hide">Hide</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
        <ids-popup-menu id="grid-actions-menu" trigger-type="custom">
          <ids-menu-group>
            <ids-menu-item value="item-one">Item One</ids-menu-item>
            <ids-menu-item value="item-two">Item Two</ids-menu-item>
            <ids-menu-item value="item-three">Item Three</ids-menu-item>
            <ids-menu-item value="item-four">Item Four</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
      </ids-container>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    container = document.querySelector('ids-container');
    dataGrid = document.querySelector('#data-grid-contextmenu-thru-id');

    expect(container).toBeTruthy();
    expect(dataGrid).toBeTruthy();
    dataGrid.columns = deepClone(columns);
    dataGrid.data = deepClone(dataset);

    const headerCell: any = dataGrid.shadowRoot.querySelector(sel.headerCell);
    const bodyCell: any = dataGrid.shadowRoot.querySelector(sel.bodyCell);
    const headerMenu: any = document.querySelector('#grid-header-menu');
    const bodyMenu: any = document.querySelector('#grid-actions-menu');
    expect(headerCell).toBeTruthy();
    expect(bodyCell).toBeTruthy();
    expect(headerMenu).toBeTruthy();
    expect(bodyMenu).toBeTruthy();
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeFalsy();

    headerCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeTruthy();
    expect(bodyMenu.visible).toBeFalsy();

    bodyCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeTruthy();
    bodyMenu.items[0].select();
    expect(headerMenu.visible).toBeFalsy();
    expect(bodyMenu.visible).toBeFalsy();
  });

  test('should veto before contextmenu show response', async () => {
    dataGrid.menuData = deepClone(menuData);
    dataGrid.headerMenuData = deepClone(headerMenuData);

    let isVeto: boolean;
    dataGrid.addEventListener('beforemenushow', (e: CustomEvent) => {
      e.detail.response(isVeto); // veto
    });
    const sel = '.ids-data-grid-body [role="row"]:nth-child(2) [role="gridcell"]:nth-child(2)';
    const bodyCell = dataGrid.shadowRoot.querySelector(sel);
    const bodySlot = dataGrid.shadowRoot.querySelector('slot[name="contextmenu"]');
    const bodyMenu = bodySlot.assignedElements()[0];

    expect(bodyCell).toBeTruthy();
    expect(bodyMenu.visible).toBeFalsy();

    isVeto = false;
    bodyCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(bodyMenu.visible).toBeFalsy();

    isVeto = true;
    bodyCell.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
    expect(bodyMenu.visible).toBeTruthy();
  });
});
