/**
 * @jest-environment jsdom
 */
import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridFormatters from '../../src/components/ids-data-grid/ids-data-grid-formatters';
import IdsLookup from '../../src/components/ids-lookup/ids-lookup';

import ResizeObserver from '../helpers/resize-observer-mock';
import createFromTemplate from '../helpers/create-from-template';
import waitFor from '../helpers/wait-for';
import dataset from '../../demos/data/books.json';

describe('IdsLookup Component', () => {
  let lookup;
  const formatters = new IdsDataGridFormatters();

  const columns = () => {
    const cols = [];
    // Set up columns
    cols.push({
      id: 'selectionCheckbox',
      sortable: false,
      resizable: false,
      formatter: formatters.selectionCheckbox,
      align: 'center'
    });
    cols.push({
      id: 'rowNumber',
      name: '#',
      formatter: formatters.rowNumber,
      sortable: false,
      readonly: true,
      width: 65
    });
    cols.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: formatters.text
    });
    cols.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: formatters.text
    });
    cols.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      formatter: formatters.decimal,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    cols.push({
      id: 'bookCurrency',
      name: 'Currency',
      field: 'bookCurrency',
      formatter: formatters.text
    });
    return cols;
  };

  const createMultiSelectLookup = async () => {
    lookup = await createFromTemplate(lookup, `<ids-lookup id="lookup-1" label="Normal Lookup" title="Select an Item" field="description"></ids-lookup>`);
    lookup.dataGridSettings = {
      rowSelection: 'multiple'
    };
    lookup.columns = columns();
    lookup.data = dataset;
    return lookup;
  };

  beforeEach(async () => {
    lookup = await createFromTemplate(lookup, `<ids-lookup id="lookup-1" label="Normal Lookup"></ids-lookup>`);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders empty dropdown with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    lookup.remove();
    const elem = new IdsLookup();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-lookup').length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(lookup.outerHTML).toMatchSnapshot();
    expect(lookup.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders with disabled', () => {
    lookup = createFromTemplate(lookup, `<ids-lookup id="lookup-1" disabled="true" label="Test"></ids-lookup>`);
    expect(lookup.disabled).toBeTruthy();
    expect(lookup.readonly).toBeFalsy();
  });

  it('renders with readonly', () => {
    lookup = createFromTemplate(lookup, `<ids-lookup id="dropdown-1" readonly="true" label="Test"></ids-lookup>`);
    expect(lookup.readonly).toBeTruthy();
    expect(lookup.disabled).toBeFalsy();
  });

  it('should be able to set label', () => {
    expect(lookup.shadowRoot.querySelector('ids-input').getAttribute('label')).toEqual('Normal Lookup');
    expect(lookup.label).toEqual('Normal Lookup');
    lookup.label = 'Test New Label';
    expect(lookup.shadowRoot.querySelector('ids-input').getAttribute('label')).toEqual('Test New Label');
    expect(lookup.label).toEqual('Test New Label');
    lookup.label = '';
    expect(lookup.shadowRoot.querySelector('ids-input').getAttribute('label')).toEqual(null);
    expect(lookup.label).toEqual('');
  });

  it('should be able to set value', () => {
    lookup.value = '218901';
    expect(lookup.value).toEqual('218901');
    expect(lookup.input.value).toEqual('218901');
  });

  it('should be able to set readonly with the property', () => {
    lookup.readonly = true;
    expect(lookup.triggerField.readonly).toEqual(true);
    expect(lookup.getAttribute('readonly')).toEqual('true');

    lookup.readonly = false;
    expect(lookup.triggerField.readonly).toEqual(false);
    expect(lookup.getAttribute('readonly')).toEqual(null);

    lookup.triggerField = null;
    expect(lookup.readonly).toEqual(false);
  });

  it('should be able to set readonly with the attribute', () => {
    lookup.setAttribute('readonly', 'true');
    expect(lookup.triggerField.readonly).toEqual(true);
    expect(lookup.readonly).toEqual(true);

    lookup.setAttribute('readonly', 'false');
    expect(lookup.triggerField.readonly).toEqual(false);
    expect(lookup.readonly).toEqual(false);

    lookup.setAttribute('readonly', 'true');
    lookup.removeAttribute('readonly');
    expect(lookup.triggerField.readonly).toEqual(false);
    expect(lookup.readonly).toEqual(false);
  });

  it('should be able to set disabled with the property', () => {
    lookup.disabled = true;
    expect(lookup.triggerField.disabled).toEqual(true);
    expect(lookup.getAttribute('disabled')).toEqual('true');

    lookup.disabled = false;
    expect(lookup.triggerField.disabled).toEqual(false);
    expect(lookup.getAttribute('disabled')).toEqual(null);

    lookup.triggerField = null;
    expect(lookup.disabled).toEqual(false);
  });

  it('should be able to set disabled with the attribute', () => {
    lookup.setAttribute('disabled', 'true');
    expect(lookup.triggerField.disabled).toEqual(true);
    expect(lookup.disabled).toEqual(true);

    lookup.setAttribute('disabled', 'false');
    expect(lookup.triggerField.disabled).toEqual(false);
    expect(lookup.disabled).toEqual(false);

    lookup.setAttribute('disabled', 'true');
    lookup.removeAttribute('disabled');
    expect(lookup.triggerField.disabled).toEqual(false);
    expect(lookup.disabled).toEqual(false);
  });

  it('should be able to set tabbable with the property', () => {
    lookup.tabbable = true;
    expect(lookup.triggerField.tabbable).toEqual(true);
    expect(lookup.getAttribute('tabbable')).toEqual('true');

    lookup.tabbable = false;
    expect(lookup.triggerField.tabbable).toEqual(false);
    expect(lookup.getAttribute('tabbable')).toEqual('false');

    lookup.triggerField = null;
    lookup.tabbable = false;
    expect(lookup.tabbable).toEqual(false);
  });

  it('should be able to set tabbable with the attribute', () => {
    lookup.setAttribute('tabbable', 'true');
    expect(lookup.triggerField.tabbable).toEqual(true);
    expect(lookup.tabbable).toEqual(true);

    lookup.setAttribute('tabbable', 'false');
    expect(lookup.triggerField.tabbable).toEqual(false);
    expect(lookup.tabbable).toEqual(false);

    lookup.setAttribute('tabbable', 'true');
    lookup.removeAttribute('tabbable');
    expect(lookup.triggerField.tabbable).toEqual(false);
    expect(lookup.tabbable).toEqual(false);
  });

  it('should fire change on setting the value', () => {
    lookup.addEventListener('change', (e) => {
      expect(e.detail.value).toEqual('218902');
    });
    lookup.value = '218902';
    expect(lookup.input.value).toEqual('218902');
  });

  it('should open on click and close on the modal buttons', async () => {
    lookup = await createMultiSelectLookup();
    expect(lookup.modal.visible).toBe(false);
    lookup.triggerButton.click();
    expect(lookup.modal.visible).toBe(true);
    lookup.modal.buttons[0].click();
    expect(lookup.modal.visible).toBe(false);
    lookup.triggerButton.click();
    expect(lookup.modal.visible).toBe(true);
    lookup.modal.buttons[1].click();
    expect(lookup.modal.visible).toBe(false);
  });

  it('should open on down arrow', async () => {
    lookup = await createMultiSelectLookup();
    expect(lookup.modal.visible).toBe(false);
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    lookup.dispatchEvent(event);
    expect(lookup.modal.visible).toBe(true);
    lookup.modal.buttons[0].click();
    expect(lookup.modal.visible).toBe(false);
  });

  it('should not open on click if readonly / disabled', () => {
    expect(lookup.modal.visible).toBe(false);
    lookup.readonly = true;
    lookup.triggerButton.click();
    expect(lookup.modal.visible).toBe(false);
    lookup.disabled = true;
    lookup.triggerButton.click();
    expect(lookup.modal.visible).toBe(false);
  });

  it('should be able to get and set readonly / disabled', () => {
    lookup.readonly = true;
    expect(lookup.readonly).toBe(true);
    expect(lookup.disabled).toBe(false);
    lookup.disabled = true;
    expect(lookup.readonly).toBe(false);
    expect(lookup.disabled).toBe(true);

    // Prevent error if no triggerField
    lookup.triggerField = null;
    lookup.disabled = false;
    expect(lookup.disabled).toBe(true);
  });

  it('should be able to set modal columns and dataset', () => {
    lookup.columns = columns();
    lookup.data = dataset;

    expect(lookup.dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row').length).toEqual(10);
    expect(lookup.dataGrid.columns.length).toEqual(6);
    expect(lookup.columns.length).toEqual(6);
    expect(lookup.data.length).toEqual(9);
    expect(lookup.dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-cell').length).toEqual(54);
  });

  it('should be able to set datagrid settings', () => {
    lookup.columns = columns();
    lookup.data = dataset;
    lookup.dataGridSettings = {
      rowHeight: 'sm'
    };

    expect(lookup.dataGrid.rowHeight).toEqual('sm');
    expect(lookup.dataGridSettings).toEqual({
      rowHeight: 'sm'
    });
  });

  it('renders with validation', () => {
    lookup = createFromTemplate(lookup, `<ids-lookup id="lookup-1" validate="required" validation-events="blur change" label="Test"></ids-lookup>`);
    expect(lookup.validate).toEqual('required');
    expect(lookup.validationEvents).toEqual('blur change');

    // Generate from the parent defaults
    lookup = createFromTemplate(lookup, `<ids-lookup id="lookup-1" validate="required" label="Test"></ids-lookup>`);
    lookup.validationEvents = 'blur change';
    expect(lookup.validate).toEqual('required');
    expect(lookup.validationEvents).toEqual('blur change');

    // Default Case
    lookup = createFromTemplate(lookup, `<ids-lookup id="lookup-1" validate="required" label="Test"></ids-lookup>`);
    expect(lookup.validate).toEqual('required');
    expect(lookup.validationEvents).toEqual('change blur');
  });

  it('supports changing validation dynamically', async () => {
    lookup = createFromTemplate(lookup, `<ids-lookup id="lookup-5" label="Dynamic Validation"></ids-lookup>`);
    await waitFor(() => expect(lookup.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());

    document.querySelector('ids-lookup').validate = 'required';
    const triggerElem = lookup.shadowRoot.querySelector('ids-trigger-field');
    const inputElem = lookup.shadowRoot.querySelector('ids-input');
    expect(triggerElem.getAttribute('validate')).toEqual('required');
    expect(triggerElem.getAttribute('validation-events')).toEqual('change blur');
    expect(inputElem.labelEl).not.toEqual(undefined);

    document.querySelector('ids-lookup').validate = '';
    expect(triggerElem.getAttribute('validate')).toEqual(null);
    expect(triggerElem.getAttribute('validation-events')).toEqual(null);
    expect(inputElem.labelEl).not.toEqual(undefined);

    expect(lookup.getAttribute('validate')).toEqual(null);
  });

  it('supports validation', async () => {
    lookup = createFromTemplate(lookup, `<ids-lookup id="lookup-5" label="Dropdown with Icons" validate="true">
     </ids-lookup>`);
    await waitFor(() => expect(lookup.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());

    lookup.validate = 'required';
    lookup.validationEvents = 'blur change';
    lookup.triggerEvent('change', lookup);
    expect(lookup.getAttribute('validate')).toEqual('required');
  });

  it('can reset validation and validation-events', async () => {
    lookup.validate = 'required';
    lookup.validationEvents = 'blur change';
    lookup.validate = null;
    lookup.validationEvents = null;
    expect(lookup.getAttribute('validate')).toBeFalsy();
    expect(lookup.getAttribute('validation-events')).toBeFalsy();
  });

  it('should set selected rows on init', async () => {
    lookup = await createFromTemplate(lookup, `<ids-lookup id="lookup-1" label="Normal Lookup" title="Select an Item" field="description" value="102,103"></ids-lookup>`);
    lookup.columns = columns();
    lookup.data = dataset;
    expect(lookup.dataGrid.selectedRows.length).toEqual(2);
  });

  it('should default the field to id', () => {
    expect(lookup.field).toEqual('id');
  });

  it('should be able to set the delimiter', () => {
    expect(lookup.delimiter).toEqual(',');
    lookup.delimiter = '|';
    expect(lookup.delimiter).toEqual('|');
  });

  it('should be able to select two rows from the modal', async () => {
    lookup = await createMultiSelectLookup();
    expect(lookup.value).toEqual(null);
    lookup.modal.visible = true;

    lookup.dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(1) .ids-data-grid-cell:nth-child(1)').click();
    lookup.dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(8) .ids-data-grid-cell:nth-child(1)').click();
    lookup.modal.buttons[1].click();

    expect(lookup.dataGrid.selectedRows.length).toEqual(2);
    expect(lookup.value).toEqual('101,108');
  });

  it('should fire rowselected and selectionchanged event', async () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.data.description).toEqual('108');
    });

    const mockCallback2 = jest.fn((x) => {
      expect(x.detail.selectedRows.length).toEqual(1);
    });

    lookup = await createMultiSelectLookup();
    lookup.addEventListener('rowselected', mockCallback);
    lookup.addEventListener('selectionchanged', mockCallback2);

    lookup.modal.visible = true;
    lookup.dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(8) .ids-data-grid-cell:nth-child(1)').click();

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback2.mock.calls.length).toBe(1);
  });

  it('should fire rowdeselected event', async () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.data.description).toEqual('108');
    });

    lookup = await createMultiSelectLookup();
    lookup.addEventListener('rowdeselected', mockCallback);

    lookup.modal.visible = true;
    lookup.dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(8) .ids-data-grid-cell:nth-child(1)').click();
    lookup.dataGrid.shadowRoot.querySelector('.ids-data-grid-body .ids-data-grid-row:nth-child(8) .ids-data-grid-cell:nth-child(1)').click();

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('supports custom modals', async () => {
    lookup = await createFromTemplate(lookup, `<ids-lookup id="lookup-5" label="Custom Lookup">
      <ids-modal slot="lookup-modal" id="custom-lookup-modal" aria-labelledby="custom-lookup-modal-title">
        <ids-text slot="title" font-size="24" type="h2" id="lookup-modal-title">Custom Lookup Modal</ids-text>
        <ids-modal-button slot="buttons" id="modal-cancel-btn" type="primary">
          <span slot="text">Apply</span>
        </ids-modal-button>
      </ids-modal>
    </ids-lookup>`);
    lookup.dataGridSettings = {
      rowSelection: 'multiple'
    };
    lookup.columns = columns();
    lookup.data = dataset;

    expect(document.querySelector('#custom-lookup-modal').visible).toBeFalsy();
    lookup.modal.visible = true;
    expect(document.querySelector('#custom-lookup-modal').visible).toBeTruthy();
  });
});
