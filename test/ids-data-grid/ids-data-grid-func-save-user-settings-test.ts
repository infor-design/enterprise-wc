/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/books.json';
import wait from '../helpers/wait';

describe('IdsDataGrid Component Save User Settings Tests', () => {
  let dataGrid: any;
  let container: any;

  const formatters: any = new IdsDataGridFormatters();
  const columns = () => {
    const cols = [];
    // Set up columns
    cols.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: formatters.text,
      filterType: dataGrid.filters.text
    });
    cols.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: formatters.text,
      filterType: dataGrid.filters.text
    });
    cols.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      formatter: formatters.date,
      filterType: dataGrid.filters.date
    });
    cols.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      formatter: formatters.time,
      filterType: dataGrid.filters.time
    });
    cols.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      filterType: dataGrid.filters.decimal,
      formatter: formatters.decimal,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    cols.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      filterType: dataGrid.filters.integer,
      formatter: formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    cols.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      href: '#',
      formatter: formatters.hyperlink,
      filterType: dataGrid.filters.contents,
      filterOptions: {
        notFilteredItem: { value: 'not-filtered', label: 'Not Filtered' }
      }
    });
    cols.push({
      id: 'location2',
      name: 'Location2',
      field: 'location',
      href: '#',
      formatter: formatters.text,
      filterType: dataGrid.filters.contents
    });
    cols.push({
      id: 'active',
      name: 'Active',
      field: 'active',
      formatter: formatters.text,
      filterType: dataGrid.filters.checkbox,
      isChecked: (value: any) => value === 'Yes'
    });
    cols.push({
      id: 'inStock',
      name: 'In Stock',
      field: 'inStock',
      formatter: formatters.text,
      filterType: dataGrid.filters.checkbox
    });
    cols.push({
      id: 'trackDeprecationHistory',
      name: 'Track Deprecation History',
      field: 'trackDeprecationHistory',
      formatter: formatters.dropdown,
      filterType: dataGrid.filters.dropdown,
      filterTerms: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
      ]
    });
    cols.push({
      id: 'useForEmployee',
      name: 'Use For Employee',
      field: 'useForEmployee',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.dropdown,
      filterTerms: [
        { value: 'not-filtered', label: 'Not Filtered' },
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
      ]
    });
    return cols;
  };

  beforeEach(async () => {
    // Mock the CSSStyleSheet in adoptedStyleSheets
    (window as any).CSSStyleSheet = function CSSStyleSheet() {
      return { cssRules: [], replaceSync: () => '', insertRule: () => '' };
    };
    (window.StyleSheet as any).insertRule = () => '';

    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const dataGrid2: any = new IdsDataGrid();
    document.body.appendChild(dataGrid2);
    dataGrid2.columns = columns();
    dataGrid2.data = dataset;
    dataGrid2.remove();

    expect(document.querySelectorAll('ids-data-grid').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should set to saves active page', () => {
    expect(dataGrid.getAttribute('saves-active-page')).toEqual(null);
    expect(dataGrid.savesActivePage).toEqual(false);
    dataGrid.savesActivePage = true;
    expect(dataGrid.getAttribute('saves-active-page')).toEqual('');
    expect(dataGrid.savesActivePage).toEqual(true);
    dataGrid.savesActivePage = false;
    expect(dataGrid.getAttribute('saves-active-page')).toEqual(null);
    expect(dataGrid.savesActivePage).toEqual(false);
  });

  it('should set to saves columns', () => {
    expect(dataGrid.getAttribute('saves-columns')).toEqual(null);
    expect(dataGrid.savesColumns).toEqual(false);
    dataGrid.savesColumns = true;
    expect(dataGrid.getAttribute('saves-columns')).toEqual('');
    expect(dataGrid.savesColumns).toEqual(true);
    dataGrid.savesColumns = false;
    expect(dataGrid.getAttribute('saves-columns')).toEqual(null);
    expect(dataGrid.savesColumns).toEqual(false);
  });

  it('should set to saves filter', () => {
    expect(dataGrid.getAttribute('saves-filter')).toEqual(null);
    expect(dataGrid.savesFilter).toEqual(false);
    dataGrid.savesFilter = true;
    expect(dataGrid.getAttribute('saves-filter')).toEqual('');
    expect(dataGrid.savesFilter).toEqual(true);
    dataGrid.savesFilter = false;
    expect(dataGrid.getAttribute('saves-filter')).toEqual(null);
    expect(dataGrid.savesFilter).toEqual(false);
  });

  it('should set to saves page size', () => {
    expect(dataGrid.getAttribute('saves-page-size')).toEqual(null);
    expect(dataGrid.savesPageSize).toEqual(false);
    dataGrid.savesPageSize = true;
    expect(dataGrid.getAttribute('saves-page-size')).toEqual('');
    expect(dataGrid.savesPageSize).toEqual(true);
    dataGrid.savesPageSize = false;
    expect(dataGrid.getAttribute('saves-page-size')).toEqual(null);
    expect(dataGrid.savesPageSize).toEqual(false);
  });

  it('should set to saves row height', () => {
    expect(dataGrid.getAttribute('saves-row-height')).toEqual(null);
    expect(dataGrid.savesRowHeight).toEqual(false);
    dataGrid.savesRowHeight = true;
    expect(dataGrid.getAttribute('saves-row-height')).toEqual('');
    expect(dataGrid.savesRowHeight).toEqual(true);
    dataGrid.savesRowHeight = false;
    expect(dataGrid.getAttribute('saves-row-height')).toEqual(null);
    expect(dataGrid.savesRowHeight).toEqual(false);
  });

  it('should set to saves sort order', () => {
    expect(dataGrid.getAttribute('saves-sort-order')).toEqual(null);
    expect(dataGrid.savesSortOrder).toEqual(false);
    dataGrid.savesSortOrder = true;
    expect(dataGrid.getAttribute('saves-sort-order')).toEqual('');
    expect(dataGrid.savesSortOrder).toEqual(true);
    dataGrid.savesSortOrder = false;
    expect(dataGrid.getAttribute('saves-sort-order')).toEqual(null);
    expect(dataGrid.savesSortOrder).toEqual(false);
  });

  it('should set to saves user settings', () => {
    expect(dataGrid.getAttribute('saves-user-settings')).toEqual(null);
    expect(dataGrid.savesUserSettings).toEqual(false);
    dataGrid.savesUserSettings = true;
    expect(dataGrid.getAttribute('saves-user-settings')).toEqual('');
    expect(dataGrid.savesUserSettings).toEqual(true);
    dataGrid.savesUserSettings = false;
    expect(dataGrid.getAttribute('saves-user-settings')).toEqual(null);
    expect(dataGrid.savesUserSettings).toEqual(false);
  });

  it('should save/restore active page with local storage', () => {
    dataGrid.pageNumber = 1;
    expect(dataGrid.savedActivePage()).toEqual(null);
    dataGrid.savesActivePage = true;
    dataGrid.saveActivePage();

    expect(dataGrid.savedActivePage()).toEqual(1);
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedActivePage()).toEqual(1);
    dataGrid.restoreActivePage();
    dataGrid.clearSavedActivePage();

    expect(dataGrid.savedActivePage()).toEqual(null);
  });

  it('should save/restore columns with local storage', () => {
    expect(dataGrid.savedColumns()).toEqual(null);
    dataGrid.savesColumns = true;
    dataGrid.saveColumns();

    expect(dataGrid.savedColumns()).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'description' }),
      expect.objectContaining({ id: 'ledger' })
    ]));
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedColumns()).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'description' }),
      expect.objectContaining({ id: 'ledger' })
    ]));
    dataGrid.restoreColumns();
    dataGrid.clearSavedColumns();

    expect(dataGrid.savedColumns()).toEqual(null);
  });

  it('should save/restore filter with local storage', () => {
    expect(dataGrid.savedFilter()).toEqual(null);
    dataGrid.savesFilter = true;
    dataGrid.saveFilter();

    expect(dataGrid.savedFilter()).toEqual([]);
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([{ columnId: 'description', operator: 'equals', value: '105' }]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(1);
    expect(dataGrid.savedFilter()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ columnId: 'description' }),
        expect.objectContaining({ operator: 'equals' }),
        expect.objectContaining({ value: '105' })
      ])
    );
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedFilter()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ columnId: 'description' }),
        expect.objectContaining({ operator: 'equals' }),
        expect.objectContaining({ value: '105' })
      ])
    );
    dataGrid.restoreFilter();
    dataGrid.clearSavedFilter();

    expect(dataGrid.savedFilter()).toEqual(null);
  });

  it('should save/restore page size with local storage', () => {
    dataGrid.pageSize = 5;
    expect(dataGrid.savedPageSize()).toEqual(null);
    dataGrid.savesPageSize = true;
    dataGrid.savePageSize();

    expect(dataGrid.savedPageSize()).toEqual(5);
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedPageSize()).toEqual(5);
    dataGrid.restorePageSize();
    dataGrid.clearSavedPageSize();

    expect(dataGrid.savedPageSize()).toEqual(null);
  });

  it('should save/restore row height with local storage', () => {
    expect(dataGrid.savedRowHeight()).toEqual(null);
    dataGrid.savesRowHeight = true;
    dataGrid.saveRowHeight();

    expect(dataGrid.savedRowHeight()).toEqual('lg');
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedRowHeight()).toEqual('lg');
    dataGrid.restoreRowHeight();
    dataGrid.clearSavedRowHeight();

    expect(dataGrid.savedRowHeight()).toEqual(null);
  });

  it('should save/restore sort order to local storage', () => {
    expect(dataGrid.savedSortOrder()).toEqual(null);
    dataGrid.savesSortOrder = true;
    dataGrid.saveSortOrder();

    expect(dataGrid.savedSortOrder()).toEqual(null);
    dataGrid.setSortColumn('description', true);

    expect(dataGrid.savedSortOrder()).toEqual(
      expect.objectContaining({
        id: 'description',
        ascending: true
      })
    );
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedSortOrder()).toEqual(
      expect.objectContaining({
        id: 'description',
        ascending: true
      })
    );
    dataGrid.restoreSortOrder();
    dataGrid.clearSavedSortOrder();

    expect(dataGrid.savedSortOrder()).toEqual(null);
  });

  it('should save all user settings to local storage', () => {
    expect(dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    dataGrid.savesUserSettings = true;
    dataGrid.saveAllUserSettings();

    expect(dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: 1,
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'description' }),
          expect.objectContaining({ id: 'ledger' })
        ]),
        filter: [],
        pageSize: null,
        rowHeight: 'lg',
        sortOrder: null
      })
    );
    dataGrid.clearSavedAllUserSettings();
  });

  it('should auto save user settings', () => {
    expect(dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    dataGrid.pageSize = 5;
    dataGrid.setSortColumn('description', true);
    dataGrid.savesActivePage = true;
    dataGrid.savesColumns = true;
    dataGrid.savesFilter = true;
    dataGrid.savesPageSize = true;
    dataGrid.savesRowHeight = true;
    dataGrid.savesSortOrder = true;
    dataGrid.saveUserSettings();

    expect(dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: 1,
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'description' }),
          expect.objectContaining({ id: 'ledger' })
        ]),
        filter: [],
        pageSize: 5,
        rowHeight: 'lg',
        sortOrder: expect.objectContaining({ id: 'description', ascending: true })
      })
    );
    dataGrid.clearSavedAllUserSettings();

    expect(dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    dataGrid.savesActivePage = false;
    dataGrid.savesColumns = false;
    dataGrid.savesFilter = false;
    dataGrid.savesPageSize = false;
    dataGrid.savesRowHeight = false;
    dataGrid.savesSortOrder = false;
    dataGrid.saveUserSettings();

    expect(dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    dataGrid.savesUserSettings = true;
    dataGrid.saveUserSettings();

    expect(dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: 1,
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'description' }),
          expect.objectContaining({ id: 'ledger' })
        ]),
        filter: [],
        pageSize: 5,
        rowHeight: 'lg',
        sortOrder: expect.objectContaining({ id: 'description', ascending: true })
      })
    );
    dataGrid.clearSavedAllUserSettings();
  });

  it('should save on pager change', async () => {
    dataGrid.pagination = 'client-side';
    dataGrid.pageSize = 10;
    await wait(10);

    expect(await dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );

    dataGrid.pager.dispatchEvent(new CustomEvent('pagenumberchange', { detail: { value: 2 } }));
    dataGrid.savesUserSettings = true;
    dataGrid.pager.dispatchEvent(new CustomEvent('pagesizechange', { detail: { value: 5 } }));

    expect(await dataGrid.savedAllUserSettings()).toEqual(
      expect.objectContaining({
        activePage: 2,
        columns: expect.arrayContaining([
          expect.objectContaining({ id: 'description' }),
          expect.objectContaining({ id: 'ledger' })
        ]),
        filter: [],
        pageSize: 5,
        rowHeight: 'lg',
        sortOrder: null
      })
    );
    dataGrid.clearSavedAllUserSettings();
  });
});
