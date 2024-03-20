  test('should keep filter with redraw', () => {
    const selector = '.ids-data-grid-body .ids-data-grid-row';

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([{ columnId: 'description', operator: 'equals', value: '105' }]);
    dataGrid.redraw();

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(1);
    dataGrid.applyFilter([{ columnId: 'integer', operator: 'equals', value: '14' }]);
    dataGrid.redraw();

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(1);
    dataGrid.applyFilter([]);
    dataGrid.redraw();

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
  });

  test('should not filter empty element', () => {
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const wrapper = dataGrid.filters.filterWrapperById('inStock');
    wrapper.innerHTML = '';
    dataGrid.filters.filterConditions();
    dataGrid.applyFilter([]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
  });

  test('should renders filter with slot', () => {
    dataGrid = createFromTemplate(dataGrid, `<ids-data-grid>
      <div slot="filter-trackDeprecationHistory" column-id="trackDeprecationHistory">
        <ids-dropdown label="Slotted dropdown" id="slotted-dropdown" value="not-filtered">
          <ids-list-box>
            <ids-list-box-option id="slotted-dropdown-opt-0" value="not-filtered"></ids-list-box-option>
            <ids-list-box-option id="slotted-dropdown-opt-1" value="Yes">Yes</ids-list-box-option>
            <ids-list-box-option id="slotted-dropdown-opt-2" value="No">No</ids-list-box-option>
          </ids-list-box>
        </ids-dropdown>
      </div>
      <div slot="filter-publishDate" column-id="publishDate">
        <ids-date-picker label="Slotted date picker" id="slotted-date-picker">
        </ids-date-picker>
      </div>
      <div slot="filter-publishTime" column-id="publishTime">
        <ids-time-picker label="Slotted time picker" id="slotted-time-picker">
        </ids-time-picker>
      </div>
    </ids-data-grid>`);

    dataGrid.columns = columns();
    dataGrid.data = dataset;

    const selector = '.ids-data-grid-body .ids-data-grid-row';
    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
  });

  test('should renders filter with slot no operator', () => {
    dataGrid = createFromTemplate(dataGrid, `<ids-data-grid>
      <div slot="filter-description" column-id="description">
        <ids-input id="input-description" type="text" label="Slotted"></ids-input>
      </div>
    </ids-data-grid>`);

    dataGrid.columns = columns();
    dataGrid.data = dataset;
    const selector = '.ids-data-grid-body .ids-data-grid-row';

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    const wrapper = dataGrid.filters.filterWrapperById('description');
    const slot = wrapper.querySelector('slot[name^="filter-"]');
    const input = slot.assignedElements()[0].querySelector('ids-input');
    input.value = '105';
    input.dispatchEvent(new Event('keydownend'));

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(1);
  });

  test('should use custom filter', () => {
    const myCustomFilter = (opt: any) => {
      const { operator, columnId, value } = opt.condition;
      const val = {
        condition: Number.parseFloat(value),
        data: Number.parseFloat(opt.data[columnId])
      };
      let isMatch = false;
      if (Number.isNaN(val.condition) || Number.isNaN(val.data)) return isMatch;

      if (operator === 'equals') isMatch = (val.data === val.condition);
      if (operator === 'greater-than') isMatch = (val.data > val.condition);
      if (operator === 'greater-equals') isMatch = (val.data >= val.condition);
      if (operator === 'less-than') isMatch = (val.data < val.condition);
      if (operator === 'less-equals') isMatch = (val.data <= val.condition);

      return isMatch;
    };

    dataGrid = createFromTemplate(dataGrid, `<ids-data-grid>
      <div slot="filter-price" column-id="price">
        <ids-menu-button id="btn-filter-price" icon="filter-greater-equals" menu="menu-filter-price" dropdown-icon>
          <span class="audible">Greater Than Or Equals</span>
        </ids-menu-button>
        <ids-popup-menu id="menu-filter-price" target="#btn-filter-price">
          <ids-menu-group select="single">
            <ids-menu-item value="equals" icon="filter-equals">Equals</ids-menu-item>
            <ids-menu-item value="greater-than" icon="filter-greater-than">Greater Than</ids-menu-item>
            <ids-menu-item value="greater-equals" icon="filter-greater-equals" selected="true">Greater Than Or Equals</ids-menu-item>
            <ids-menu-item value="less-than" icon="filter-less-than">Less Than</ids-menu-item>
            <ids-menu-item value="less-equals" icon="filter-less-equals">Less Than Or Equals</ids-menu-item>
          </ids-menu-group>
        </ids-popup-menu>
        <ids-input id="input-filter-price" type="text" size="full" placeholder="Slotted price" label="Slotted price input">
        </ids-input>
      </div>
    </ids-data-grid>`);

    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const cols = columns();
    const priceCol: any = cols.find((c) => c.id === 'price');
    priceCol.filterFunction = myCustomFilter;
    dataGrid.columns = cols;
    dataGrid.data = dataset;

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([{ columnId: 'price', operator: 'equals', value: '13.99' }]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(1);
    dataGrid.applyFilter([]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
  });

  test('should renders columns with filter options', () => {
    const cols = [];
    cols.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: formatters.text,
      filterType: dataGrid.filters.text,
      filterOptions: {
        disabled: true,
        label: 'test text',
        placeholder: 'placeholder test text',
        type: 'text',
        size: 'full'
      }
    });
    cols.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: formatters.text,
      filterType: dataGrid.filters.text,
      filterOptions: { readonly: true }
    });
    cols.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      formatter: formatters.date,
      filterType: dataGrid.filters.date,
      filterOptions: {
        disabled: true,
        readonly: true,
        label: 'test date',
        format: 'yyyy-MM-dd',
        placeholder: 'placeholder test date',
        showToday: true,
        firstDayOfWeek: '1'
      }
    });
    cols.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      formatter: formatters.time,
      filterType: dataGrid.filters.time,
      filterOptions: {
        disabled: true,
        readonly: true,
        label: 'test time',
        format: 'hh:mm:ss a',
        placeholder: 'placeholder test time',
        minuteInterval: '5',
        secondInterval: '10',
        autoselect: true,
        autoupdate: true,
      }
    });
    cols.push({
      id: 'inStock',
      name: 'In Stock',
      field: 'inStock',
      formatter: formatters.text,
      filterType: dataGrid.filters.checkbox,
      filterConditions: []
    });
    cols.push({
      id: 'trackDeprecationHistory',
      name: 'Track Deprecation History',
      field: 'trackDeprecationHistory',
      formatter: formatters.text,
      filterType: dataGrid.filters.dropdown
    });
    cols.push({
      id: 'useForEmployee',
      name: 'Use For Employee',
      field: 'useForEmployee',
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.dropdown,
      filterConditions: []
    });
    cols.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });

    dataGrid = createFromTemplate(dataGrid, `<ids-data-grid></ids-data-grid>`);
    dataGrid.columns = cols;
    dataGrid.data = dataset;

    const selector = '.ids-data-grid-body .ids-data-grid-row';

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([{ columnId: 'description', operator: 'equals', value: '105' }]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
  });

  test('should renders columns without filterable', () => {
    const cols = [];
    cols.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });

    dataGrid = createFromTemplate(dataGrid, `<ids-data-grid filterable="false"></ids-data-grid>`);
    dataGrid.columns = cols;
    dataGrid.data = dataset;

    const selector = '.ids-data-grid-body .ids-data-grid-row';

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([{ columnId: 'integer', operator: 'equals', value: '14' }]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
  });

  test('should renders columns without filter type', () => {
    const selector = '.ids-data-grid-body .ids-data-grid-row';
    const cols = [];
    cols.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });

    dataGrid = createFromTemplate(dataGrid, `<ids-data-grid></ids-data-grid>`);
    dataGrid.columns = cols;
    dataGrid.data = dataset;

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([{ columnId: 'integer', operator: 'equals', value: '14' }]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
    dataGrid.applyFilter([]);

    expect(dataGrid.shadowRoot.querySelectorAll(selector).length).toEqual(9);
  });

