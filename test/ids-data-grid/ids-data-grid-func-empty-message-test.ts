/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/canvas-mock';
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import { showEmptyMessage } from '../../src/components/ids-data-grid/ids-data-grid-empty-message';
import IdsContainer from '../../src/components/ids-container/ids-container';
import dataset from '../../src/assets/data/books.json';
import createFromTemplate from '../helpers/create-from-template';

describe('IdsDataGrid Component Empty Message Tests', () => {
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

  it('should set empty message description', () => {
    const str = 'test';
    expect(dataGrid.getAttribute('empty-message-description')).toEqual(null);
    expect(dataGrid.emptyMessageDescription).toEqual(null);
    dataGrid.emptyMessageDescription = str;
    expect(dataGrid.getAttribute('empty-message-description')).toEqual(str);
    expect(dataGrid.emptyMessageDescription).toEqual(str);
    dataGrid.emptyMessageDescription = '';
    expect(dataGrid.getAttribute('empty-message-description')).toEqual(null);
    expect(dataGrid.emptyMessageDescription).toEqual(null);
    dataGrid.emptyMessageDescription = true;
    expect(dataGrid.getAttribute('empty-message-description')).toEqual(null);
    expect(dataGrid.emptyMessageDescription).toEqual(null);
  });

  it('should set empty message icon', () => {
    const str = 'test';
    expect(dataGrid.getAttribute('empty-message-icon')).toEqual(null);
    expect(dataGrid.emptyMessageIcon).toEqual(null);
    dataGrid.emptyMessageIcon = str;
    expect(dataGrid.getAttribute('empty-message-icon')).toEqual(str);
    expect(dataGrid.emptyMessageIcon).toEqual(str);
    dataGrid.emptyMessageIcon = '';
    expect(dataGrid.getAttribute('empty-message-icon')).toEqual(null);
    expect(dataGrid.emptyMessageIcon).toEqual(null);
    dataGrid.emptyMessageIcon = true;
    expect(dataGrid.getAttribute('empty-message-icon')).toEqual(null);
    expect(dataGrid.emptyMessageIcon).toEqual(null);
  });

  it('should set empty message label', () => {
    const str = 'test';
    expect(dataGrid.getAttribute('empty-message-label')).toEqual(null);
    expect(dataGrid.emptyMessageLabel).toEqual(null);
    dataGrid.emptyMessageLabel = str;
    expect(dataGrid.getAttribute('empty-message-label')).toEqual(str);
    expect(dataGrid.emptyMessageLabel).toEqual(str);
    dataGrid.emptyMessageLabel = '';
    expect(dataGrid.getAttribute('empty-message-label')).toEqual(null);
    expect(dataGrid.emptyMessageLabel).toEqual(null);
    dataGrid.emptyMessageLabel = true;
    expect(dataGrid.getAttribute('empty-message-label')).toEqual(null);
    expect(dataGrid.emptyMessageLabel).toEqual(null);
  });

  it('should set suppress empty message', () => {
    expect(dataGrid.getAttribute('suppress-empty-message')).toEqual(null);
    expect(dataGrid.suppressEmptyMessage).toEqual(false);
    dataGrid.suppressEmptyMessage = true;
    expect(dataGrid.getAttribute('suppress-empty-message')).toEqual('');
    expect(dataGrid.suppressEmptyMessage).toEqual(true);
    dataGrid.suppressEmptyMessage = false;
    expect(dataGrid.getAttribute('suppress-empty-message')).toEqual(null);
    expect(dataGrid.suppressEmptyMessage).toEqual(false);
  });

  it('can handle no initialize with empty message', () => {
    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(true);
    dataGrid.initialized = false;
    dataGrid.emptyMessageElements = undefined;
    showEmptyMessage.apply(dataGrid);

    expect(dataGrid.emptyMessageElements).toBeFalsy();
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.virtualScroll = true;
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = [];

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
  });

  it('should renders empty message with slot', () => {
    const em = {
      d: { // Defaults
        description: 'test description',
        icon: 'empty-search-data-new',
        label: 'There is No data available'
      },
      new: { // After change
        description: 'new description',
        icon: 'empty-error-loading-new',
        label: 'new label'
      }
    };

    dataGrid = createFromTemplate(dataGrid, `<ids-data-grid>
      <ids-empty-message hidden icon="${em.d.icon}" slot="empty-message">
        <ids-text type="h2" font-size="20" label="true" slot="label">${em.d.label}</ids-text>
        <ids-text hidden label="true" slot="description">${em.d.description}</ids-text>
      </ids-empty-message>
    </ids-data-grid>`);

    dataGrid.columns = columns();
    dataGrid.data = [];

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
    expect(dataGrid.emptyMessageElements.emDesc.textContent.trim()).toEqual(em.d.description);
    expect(dataGrid.emptyMessageElements.em.icon).toEqual(em.d.icon);
    expect(dataGrid.emptyMessageElements.emLabel.textContent.trim()).toEqual(em.d.label);

    dataGrid.emptyMessageDescription = em.new.description;
    dataGrid.emptyMessageIcon = em.new.icon;
    dataGrid.emptyMessageLabel = em.new.label;

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
    expect(dataGrid.emptyMessageElements.emDesc.textContent.trim()).toEqual(em.new.description);
    expect(dataGrid.emptyMessageElements.em.icon).toEqual(em.new.icon);
    expect(dataGrid.emptyMessageElements.emLabel.textContent.trim()).toEqual(em.new.label);
  });

  it('should toggle empty message with filter', () => {
    const selector = '.ids-data-grid-body .ids-data-grid-row';

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(true);
    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([{ columnId: 'description', operator: 'equals', value: '105' }]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(1);
    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(true);
    dataGrid.applyFilter([{ columnId: 'description', operator: 'equals', value: '999999' }]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(0);
    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
    dataGrid.suppressEmptyMessage = true;

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(true);
    dataGrid.suppressEmptyMessage = false;

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
    dataGrid.applyFilter([]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(true);
  });

  it('should toggle empty message with virtual scroll', () => {
    dataGrid.suppressEmptyMessage = true;

    expect(dataGrid.bodyTemplate()).not.toContain('ids-empty-message');
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.virtualScroll = true;
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = [];

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
    dataGrid.suppressEmptyMessage = true;
    showEmptyMessage.apply(dataGrid);

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(true);
    dataGrid.suppressEmptyMessage = false;

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
  });

  it('can handle keyboard with empty message', () => {
    document.body.innerHTML = '';
    dataGrid = new IdsDataGrid();
    dataGrid.virtualScroll = true;
    document.body.appendChild(dataGrid);
    dataGrid.columns = columns();
    dataGrid.data = [];

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dataGrid.dispatchEvent(event);

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
    event = new KeyboardEvent('keydown', { key: 'Enter' });
    dataGrid.dispatchEvent(event);

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
    event = new KeyboardEvent('keydown', { key: ' ' });
    dataGrid.dispatchEvent(event);

    expect(dataGrid.emptyMessageElements.em.hidden).toEqual(false);
  });
});
