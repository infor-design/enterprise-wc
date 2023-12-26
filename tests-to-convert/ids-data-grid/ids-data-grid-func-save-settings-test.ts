/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/books.json';
import processAnimFrame from '../helpers/process-anim-frame';

describe('IdsDataGrid Component Save Settings Tests', () => {
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
      formatter: formatters.text,
      filterType: dataGrid.filters.dropdown,
      filterConditions: [
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
      filterConditions: [
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

  it('should set to save active page', () => {
    expect(dataGrid.getAttribute('save-active-page')).toEqual(null);
    expect(dataGrid.saveActivePage).toEqual(false);
    dataGrid.saveActivePage = true;
    expect(dataGrid.getAttribute('save-active-page')).toEqual('');
    expect(dataGrid.saveActivePage).toEqual(true);
    dataGrid.saveActivePage = false;
    expect(dataGrid.getAttribute('save-active-page')).toEqual(null);
    expect(dataGrid.saveActivePage).toEqual(false);
  });

  it('should set to save columns', () => {
    expect(dataGrid.getAttribute('save-columns')).toEqual(null);
    expect(dataGrid.saveColumns).toEqual(false);
    dataGrid.saveColumns = true;
    expect(dataGrid.getAttribute('save-columns')).toEqual('');
    expect(dataGrid.saveColumns).toEqual(true);
    dataGrid.saveColumns = false;
    expect(dataGrid.getAttribute('save-columns')).toEqual(null);
    expect(dataGrid.saveColumns).toEqual(false);
  });

  it('should set to save filter', () => {
    expect(dataGrid.getAttribute('save-filter')).toEqual(null);
    expect(dataGrid.saveFilter).toEqual(false);
    dataGrid.saveFilter = true;
    expect(dataGrid.getAttribute('save-filter')).toEqual('');
    expect(dataGrid.saveFilter).toEqual(true);
    dataGrid.saveFilter = false;
    expect(dataGrid.getAttribute('save-filter')).toEqual(null);
    expect(dataGrid.saveFilter).toEqual(false);
  });

  it('should set to save page size', () => {
    expect(dataGrid.getAttribute('save-page-size')).toEqual(null);
    expect(dataGrid.savePageSize).toEqual(false);
    dataGrid.savePageSize = true;
    expect(dataGrid.getAttribute('save-page-size')).toEqual('');
    expect(dataGrid.savePageSize).toEqual(true);
    dataGrid.savePageSize = false;
    expect(dataGrid.getAttribute('save-page-size')).toEqual(null);
    expect(dataGrid.savePageSize).toEqual(false);
  });

  it('should set to save row height', () => {
    expect(dataGrid.getAttribute('save-row-height')).toEqual(null);
    expect(dataGrid.saveRowHeight).toEqual(false);
    dataGrid.saveRowHeight = true;
    expect(dataGrid.getAttribute('save-row-height')).toEqual('');
    expect(dataGrid.saveRowHeight).toEqual(true);
    dataGrid.saveRowHeight = false;
    expect(dataGrid.getAttribute('save-row-height')).toEqual(null);
    expect(dataGrid.saveRowHeight).toEqual(false);
  });

  it('should set to save sort order', () => {
    expect(dataGrid.getAttribute('save-sort-order')).toEqual(null);
    expect(dataGrid.saveSortOrder).toEqual(false);
    dataGrid.saveSortOrder = true;
    expect(dataGrid.getAttribute('save-sort-order')).toEqual('');
    expect(dataGrid.saveSortOrder).toEqual(true);
    dataGrid.saveSortOrder = false;
    expect(dataGrid.getAttribute('save-sort-order')).toEqual(null);
    expect(dataGrid.saveSortOrder).toEqual(false);
  });

  it('should set to save user settings', () => {
    expect(dataGrid.getAttribute('save-user-settings')).toEqual(null);
    expect(dataGrid.saveUserSettings).toEqual(false);
    dataGrid.saveUserSettings = true;
    expect(dataGrid.getAttribute('save-user-settings')).toEqual('');
    expect(dataGrid.saveUserSettings).toEqual(true);
    dataGrid.saveUserSettings = false;
    expect(dataGrid.getAttribute('save-user-settings')).toEqual(null);
    expect(dataGrid.saveUserSettings).toEqual(false);
  });

  it('should save/restore active page with local storage', () => {
    dataGrid.pageNumber = 1;
    const setting = 'active-page';
    expect(dataGrid.savedSetting(setting)).toEqual(null);
    dataGrid.saveActivePage = true;
    dataGrid.saveSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(1);
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedSetting(setting)).toEqual(1);
    dataGrid.restoreSetting(setting);
    dataGrid.clearSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(null);
  });

  it('should save/restore columns with local storage', () => {
    const setting = 'columns';
    expect(dataGrid.savedSetting(setting)).toEqual(null);
    dataGrid.saveColumns = true;
    dataGrid.saveSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(expect.arrayContaining([
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

    expect(dataGrid.savedSetting(setting)).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'description' }),
      expect.objectContaining({ id: 'ledger' })
    ]));
    dataGrid.restoreSetting(setting);
    dataGrid.clearSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(null);
  });

  it('should save/restore filter with local storage', () => {
    const setting = 'filter';
    expect(dataGrid.savedSetting(setting)).toEqual(null);
    dataGrid.saveFilter = true;
    dataGrid.saveSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual([]);
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([{ columnId: 'description', operator: 'equals', value: '105' }]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(1);
    expect(dataGrid.savedSetting(setting)).toEqual(
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

    expect(dataGrid.savedSetting(setting)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ columnId: 'description' }),
        expect.objectContaining({ operator: 'equals' }),
        expect.objectContaining({ value: '105' })
      ])
    );
    dataGrid.restoreSetting(setting);
    dataGrid.clearSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(null);
  });

  it('should save/restore page size with local storage', () => {
    const setting = 'page-size';
    dataGrid.pageSize = 5;
    expect(dataGrid.savedSetting(setting)).toEqual(null);
    dataGrid.savePageSize = true;
    dataGrid.saveSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(5);
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedSetting(setting)).toEqual(5);
    dataGrid.restoreSetting(setting);
    dataGrid.clearSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(null);
  });

  it('should save/restore row height with local storage', () => {
    const setting = 'row-height';
    expect(dataGrid.savedSetting(setting)).toEqual(null);
    dataGrid.saveRowHeight = true;
    dataGrid.saveSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual('lg');
    document.body.innerHTML = '';
    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    document.body.appendChild(container);
    container.appendChild(dataGrid);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = dataset;
    dataGrid.uniqueId = 'some-uniqueid-1';

    expect(dataGrid.savedSetting(setting)).toEqual('lg');
    dataGrid.restoreSetting(setting);
    dataGrid.clearSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(null);
  });

  it('should save/restore sort order to local storage', () => {
    const setting = 'sort-order';
    expect(dataGrid.savedSetting(setting)).toEqual(null);
    dataGrid.saveSortOrder = true;
    dataGrid.saveSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(null);
    dataGrid.setSortColumn('description', true);

    expect(dataGrid.savedSetting(setting)).toEqual(
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

    expect(dataGrid.savedSetting(setting)).toEqual(
      expect.objectContaining({
        id: 'description',
        ascending: true
      })
    );
    dataGrid.restoreSetting(setting);
    dataGrid.clearSetting(setting);

    expect(dataGrid.savedSetting(setting)).toEqual(null);
  });

  it.skip('should save all user settings to local storage', async () => {
    expect(dataGrid.allSavedSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    dataGrid.saveUserSettings = true;
    await processAnimFrame();
    dataGrid.saveAllSettings();
    await processAnimFrame();

    expect(dataGrid.allSavedSettings()).toEqual(
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
    dataGrid.clearAllSettings();
  });

  it.skip('should auto save user settings', () => {
    expect(dataGrid.allSavedSettings()).toEqual(
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
    dataGrid.saveActivePage = true;
    dataGrid.saveColumns = true;
    dataGrid.saveFilter = true;
    dataGrid.savePageSize = true;
    dataGrid.saveRowHeight = true;
    dataGrid.saveSortOrder = true;
    dataGrid.saveSettings();

    expect(dataGrid.allSavedSettings()).toEqual(
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
    dataGrid.clearAllSettings();

    expect(dataGrid.allSavedSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    dataGrid.saveActivePage = false;
    dataGrid.saveColumns = false;
    dataGrid.saveFilter = false;
    dataGrid.savePageSize = false;
    dataGrid.saveRowHeight = false;
    dataGrid.saveSortOrder = false;
    dataGrid.saveSettings();

    expect(dataGrid.allSavedSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );
    dataGrid.saveUserSettings = true;
    dataGrid.saveSettings();

    expect(dataGrid.allSavedSettings()).toEqual(
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
    dataGrid.clearAllSettings();
  });

  it.skip('should save on pager change', async () => {
    dataGrid.pagination = 'client-side';
    dataGrid.pageSize = 10;
    await processAnimFrame();

    expect(await dataGrid.allSavedSettings()).toEqual(
      expect.objectContaining({
        activePage: null,
        columns: null,
        filter: null,
        pageSize: null,
        rowHeight: null,
        sortOrder: null
      })
    );

    await processAnimFrame();
    dataGrid.pager.dispatchEvent(new CustomEvent('pagenumberchange', { detail: { value: 2 } }));
    dataGrid.saveUserSettings = true;
    await processAnimFrame();
    dataGrid.pager.dispatchEvent(new CustomEvent('pagesizechange', { detail: { value: 5 } }));
    await processAnimFrame();

    expect(await dataGrid.allSavedSettings()).toEqual(
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
    dataGrid.clearAllSettings();
  });
});
