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

import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';
import '../../src/components/ids-checkbox/ids-checkbox';

describe('IdsDataGrid Component', () => {
  let dataGrid: any;
  let container: any;

  const formatters: IdsDataGridFormatters = new IdsDataGridFormatters();
  const columns = () => {
    const cols = [];
    // Set up columns
    cols.push({
      id: 'selectionCheckbox',
      sortable: false,
      resizable: false,
      formatter: formatters.selectionCheckbox,
      align: 'center',
      width: 20
    });
    cols.push({
      id: 'rowNumber',
      name: '#',
      formatter: formatters.rowNumber,
      sortable: false,
      readonly: true,
      width: 65,
      headerIcon: 'info',
      headerIconTooltip: 'This is header icon'
    });
    cols.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      formatter: formatters.text,
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          validate: 'required'
        }
      },
      readonly(row: number) {
        return row % 2 === 0;
      },
    });
    cols.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: formatters.text
    });
    cols.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      formatter: formatters.date,
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: false,
          mask: 'date'
        }
      }
    });
    cols.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      formatter: formatters.time
    });
    cols.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      formatter: formatters.decimal,
      formatOptions: { locale: 'en-US' },
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          mask: 'number',
          maskOptions: {
            allowDecimal: true,
            integerLimit: 3,
            decimalLimit: 2
          },
          validate: 'required'
        }
      }
    });
    cols.push({
      id: 'bookCurrency',
      name: 'Currency',
      field: 'bookCurrency',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.dropdown,
      editor: {
        type: 'dropdown',
        editorSettings: {
          dirtyTracker: true,
          options: [
            {
              id: '',
              label: '',
              value: ''
            },
            {
              id: 'usd',
              label: 'USD',
              value: 'usd'
            },
            {
              id: 'eur',
              label: 'EUR',
              value: 'eur'
            },
            {
              id: 'yen',
              label: 'YEN',
              value: 'yen'
            }
          ]
        }
      }
    });
    cols.push({
      id: 'transactionCurrency',
      name: 'Transaction Currency',
      field: 'transactionCurrency',
      formatter: formatters.text,
    });
    cols.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    cols.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      formatter: formatters.hyperlink,
      href: '#'
    });
    cols.push({
      id: 'postHistory',
      name: 'Post History',
      field: 'postHistory',
      formatter: dataGrid.formatters.checkbox,
      align: 'center',
      editor: {
        type: 'checkbox',
        editorSettings: {
          dirtyTracker: false,
        }
      },
    });
    cols.push({
      id: 'inStock',
      name: 'In Stock',
      field: 'inStock',
      formatter: formatters.checkbox
    });
    cols.push({
      id: 'convention',
      name: 'Convention',
      field: 'convention',
      formatter: formatters.text
    });
    cols.push({
      id: 'methodSwitch',
      name: 'Method Switch',
      field: 'methodSwitch',
      formatter: formatters.text,
      filterType: 'select'
    });
    cols.push({
      id: 'trackDeprecationHistory',
      name: 'Track Deprecation History',
      field: 'trackDeprecationHistory',
      formatter: formatters.text
    });
    cols.push({
      id: 'useForEmployee',
      name: 'Use For Employee',
      field: 'useForEmployee',
      formatter: formatters.password
    });
    cols.push({
      id: 'custom',
      name: 'Custom',
      field: 'price',
      formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
        const value = `Custom: ${rowData[columnData.field] || '0'}`;
        return `<span class="text-ellipsis">${value}</span>`;
      },
      editor: {
        type: 'input'
      },
    });
    return cols;
  };

  beforeEach(async () => {
    // Mock the CSSStyleSheet in adoptedStyleSheets
    (window as any).CSSStyleSheet = function CSSStyleSheet() { //eslint-disable-line
      return { cssRules: [], replaceSync: () => '', insertRule: () => '' };
    };
    (window.StyleSheet as any).insertRule = () => '';

    container = new IdsContainer();
    dataGrid = new IdsDataGrid();
    container.appendChild(dataGrid);
    document.body.appendChild(container);
    dataGrid.shadowRoot.styleSheets = [window.StyleSheet];
    dataGrid.columns = columns();
    dataGrid.data = deepClone(dataset);
    await processAnimFrame();
    await processAnimFrame();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  describe('Formatter Tests', () => {
    it('can render with the text formatter', () => {
      // Renders undefined/null
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[3].querySelector('.text-ellipsis').innerHTML).toEqual('');

      // Renders text
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
        .querySelectorAll('.ids-data-grid-cell')[3].querySelector('.text-ellipsis').innerHTML).toEqual('CORE');
    });

    it('can render with the password formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[16].querySelector('.text-ellipsis').innerHTML).toEqual('••');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[16].querySelector('.text-ellipsis').innerHTML).toEqual('••');
    });

    it('can render with the rowNumber formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[1].querySelector('.text-ellipsis').innerHTML).toEqual('1');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[1].querySelector('.text-ellipsis').innerHTML).toEqual('4');
    });

    it('can render with the date formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[4].querySelector('.text-ellipsis').innerHTML).toEqual('4/23/2021');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[4].querySelector('.text-ellipsis').innerHTML).toEqual('');
    });

    it('can render with the time formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[5].querySelector('.text-ellipsis').innerHTML.replace(' ', ' '))
        .toEqual(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date('2021-04-23T18:25:43.511Z')).replace(' ', ' '));

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[5].querySelector('.text-ellipsis').innerHTML)
        .toEqual('');
    });

    it('can render with the decimal formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('12.99');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('1.21');
    });

    it('can render with the decimal formatter (with defaults)', () => {
      delete dataGrid.columns[6].formatOptions;
      dataGrid.redraw();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('12.99');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[6].querySelector('.text-ellipsis').innerHTML).toEqual('1.21');
    });

    it('can render with the integer formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('13');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('1');
    });

    it('can render with the integer formatter (with defaults)', () => {
      delete dataGrid.columns[9].formatOptions;
      dataGrid.redraw();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('13');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[4]
        .querySelectorAll('.ids-data-grid-cell')[9].querySelector('.text-ellipsis').innerHTML).toEqual('1');
    });

    it('can render with the hyperlink formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').innerHTML).toEqual('United States');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
    });

    it('can render with the hyperlink formatter (with default href)', () => {
      delete dataGrid.columns[10].href;
      dataGrid.redraw();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').innerHTML).toEqual('United States');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
    });

    it('can focus with the hyperlink when clicked instead of the cell', () => {
      dataGrid.columns[10].href = '#';
      const link = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink');
      expect(link.innerHTML).toEqual('United States');

      const mouseClick = new MouseEvent('click', { bubbles: true });
      link.dispatchEvent(mouseClick);
      // No Easy way to check has focus
      expect(link.nodeName).toEqual('IDS-HYPERLINK');
    });

    it('can render with the hyperlink formatter (with href function)', () => {
      dataGrid.columns[10].href = (row: any) => {
        if (row.book === 101) {
          return null;
        }
        return `${row.book}`;
      };
      dataGrid.redraw();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink').getAttribute('href')).toEqual('102');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
        .querySelectorAll('.ids-data-grid-cell')[10].querySelector('ids-hyperlink')).toBeFalsy();
    });

    it('can render disabled hyperlink', () => {
      dataGrid.columns[10].disabled = (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101;
      dataGrid.redraw();
      const link = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-hyperlink');
      expect(link.disabled).toBeTruthy();
      const link2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-hyperlink');
      expect(link2.disabled).toBeFalsy();
    });

    it('can render with the checkbox formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
        .querySelectorAll('.ids-data-grid-cell')[12].querySelector('.ids-data-grid-checkbox-container span').getAttribute('aria-checked')).toEqual('true');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
        .querySelectorAll('.ids-data-grid-cell')[12].querySelector('.ids-data-grid-checkbox-container span').getAttribute('aria-checked')).toEqual('false');
    });

    it('can render with a custom formatter', () => {
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
        .querySelectorAll('.ids-data-grid-cell')[17].querySelector('span').textContent).toEqual('Custom: 13.99');

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[6]
        .querySelectorAll('.ids-data-grid-cell')[17].querySelector('span').textContent).toEqual('Custom: 1.21');
    });

    it('can render disabled checkbox', () => {
      dataGrid.columns[12].disabled = (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101;
      dataGrid.redraw();
      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1]
        .querySelectorAll('.ids-data-grid-cell')[12].querySelector('.ids-data-grid-checkbox-container span').classList.contains('.disabled')).toBeFalsy();

      expect(dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2]
        .querySelectorAll('.ids-data-grid-cell')[12].querySelector('.ids-data-grid-checkbox-container span').classList.contains('.disabled')).toBeFalsy();
    });

    it('can render with the button formatter (with click function)', () => {
      const clickListener = jest.fn();
      dataGrid.columns = [{
        id: 'button',
        name: 'button',
        sortable: false,
        resizable: false,
        formatter: dataGrid.formatters.button,
        icon: 'settings',
        align: 'center',
        type: 'icon',
        click: clickListener,
        text: 'button'
      }];

      const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
      expect(button.textContent).toContain('button');
      expect(button.querySelector('ids-icon')).toBeTruthy();

      const mouseClick = new MouseEvent('click', { bubbles: true });
      expect(clickListener).toHaveBeenCalledTimes(0);
      button.dispatchEvent(mouseClick);
      expect(clickListener).toHaveBeenCalledTimes(1);
    });

    it('can render with the button formatter defaults', async () => {
      dataGrid.columns = [{
        id: 'button',
        name: 'button',
        sortable: false,
        resizable: false,
        formatter: dataGrid.formatters.button,
        align: 'center'
      }];
      await processAnimFrame();

      const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
      expect(button.textContent).toContain('Button');
      expect(button.appearance).toBe('tertiary');
      expect(button.querySelector('ids-icon')).toBeFalsy();
    });

    it('can render disabled buttons', async () => {
      dataGrid.columns = [{
        id: 'button',
        name: 'button',
        sortable: false,
        resizable: false,
        formatter: dataGrid.formatters.button,
        icon: 'settings',
        align: 'center',
        disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
        text: 'button'
      }];
      await processAnimFrame();
      const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
      expect(button.disabled).toBeTruthy();
      const button2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-button');
      expect(button2.disabled).toBeFalsy();
    });

    it('can disabled formatters edge cases', async () => {
      dataGrid.columns = [{
        id: 'test',
        name: 'test',
        formatter: dataGrid.formatters.button,
        disabled: undefined
      }];

      await processAnimFrame();
      let button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
      expect(button.disabled).toBeFalsy();

      dataGrid.columns = [{
        id: 'test',
        name: 'test',
        formatter: dataGrid.formatters.button,
        disabled: true
      }];
      await processAnimFrame();

      button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
      expect(button.disabled).toBeTruthy();

      dataGrid.columns = [{
        id: 'test',
        name: 'test',
        formatter: dataGrid.formatters.button,
        disabled: 'true'
      }];
      await processAnimFrame();

      button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
      expect(button.disabled).toBeTruthy();
    });

    it('can render with the badge formatter (with color function)', () => {
      const colorListener = jest.fn(() => 'info');
      dataGrid.columns = [{
        id: 'badge',
        name: 'badge',
        sortable: false,
        resizable: false,
        formatter: dataGrid.formatters.badge,
        icon: 'settings',
        align: 'center',
        color: colorListener,
        field: 'ledger'
      }];

      // Empty row
      const badge = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-badge');
      expect(badge).toBeFalsy();

      const badge2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-badge');
      expect(badge2.textContent).toContain('CORE');
      expect(badge2.getAttribute('color')).toBe('info');
      expect(colorListener).toHaveBeenCalledTimes(6);
    });

    it('can render with the badge formatter with color class', () => {
      dataGrid.columns = [{
        id: 'badge',
        name: 'badge',
        sortable: false,
        resizable: false,
        formatter: dataGrid.formatters.badge,
        icon: 'settings',
        align: 'center',
        color: 'error',
        field: 'ledger'
      }];

      // Empty row
      const badge = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-badge');
      expect(badge.textContent).toContain('CORE');
      expect(badge.getAttribute('color')).toBe('error');
    });

    it('can render with the badge formatter with no color class', () => {
      dataGrid.columns = [{
        id: 'badge',
        name: 'badge',
        sortable: false,
        resizable: false,
        formatter: dataGrid.formatters.badge,
        icon: 'settings',
        align: 'center',
        field: 'ledger'
      }];

      // Empty row
      const badge = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-badge');
      expect(badge.getAttribute('color')).toBe(null);
    });

    it('can render with the tree formatter', async () => {
      dataGrid.treeGrid = true;
      const oldChildren = dataGrid.data[0];
      dataGrid.data[0].children = [{ description: 'test' }];
      dataGrid.data[0].rowExpanded = true;
      dataGrid.data[1].children = [{ description: 'test' }];
      dataGrid.data[1].rowExpanded = false;

      dataGrid.columns = [{
        id: 'description',
        name: 'description',
        sortable: false,
        resizable: false,
        formatter: dataGrid.formatters.tree
      }];

      await processAnimFrame();

      const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
      expect(button).toBeTruthy();
      expect(button.tabIndex).toBe(-1);
      expect(button.querySelector('ids-icon').getAttribute('icon')).toBe('plusminus-folder-open');

      const button2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-button');
      expect(button2.querySelector('ids-icon').getAttribute('icon')).toBe('plusminus-folder-closed');

      dataGrid.data[0].children = oldChildren;
      dataGrid.data[0].rowExpanded = false;
    });

    it('can render with the expander formatter', async () => {
      // eslint-disable-next-line no-template-curly-in-string
      dataGrid.insertAdjacentHTML('afterbegin', '<template id="template-id"><span>${description}</span></template>');
      dataGrid.expandableRow = true;
      dataGrid.expandableRowTemplate = `template-id`;
      dataGrid.data[1].rowExpanded = true;

      dataGrid.columns = [{
        id: 'description',
        name: 'description',
        formatter: dataGrid.formatters.expander
      }];

      await processAnimFrame();
      const button = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[1].querySelector('.ids-data-grid-cell ids-button');
      expect(button).toBeTruthy();
      expect(button.tabIndex).toBe(-1);
      expect(button.querySelector('ids-icon').getAttribute('icon')).toBe('plusminus-folder-closed');

      const button2 = dataGrid.shadowRoot.querySelectorAll('.ids-data-grid-row')[2].querySelector('.ids-data-grid-cell ids-button');
      expect(button2.querySelector('ids-icon').getAttribute('icon')).toBe('plusminus-folder-open');
    });

    const rowData = {
      book: 102,
      description: '102',
      ledger: 'CORE',
      bookCurrency: 'eur',
      transactionCurrency: 'Book',
      postHistory: false,
      active: 'Yes',
      inStock: true,
      image: 'https://placekitten.com/200/100',
      convention: 'Full Month',
      methodSwitch: 'No',
      trackDeprecationHistory: 'No',
      useForEmployee: 'No',
      icon: 'icon-closed-folder',
      category: 'Demo Category',
      count: '4.6',
      deprecationHistory: 'Asset Label',
      publishDate: '2021-02-23T18:25:43.511Z',
      price: '13.99',
      location: '<img src="a" onerror="alert(0)" />Canada',
      color: '#35d783',
    };

    it('can render with the alert formatter', () => {
      const columnData = {
        id: 'category-alert',
        name: 'Alert',
        field: 'category',
        align: 'center',
        formatter: formatters.alert,
        color: 'info',
      };

      expect(formatters.alert(rowData, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the alert formatter with icon', () => {
      const columnData = {
        id: 'category-alert',
        name: 'Alert',
        field: 'category',
        align: 'center',
        formatter: formatters.alert,
        color: 'info',
        icon: 'confirm',
      };

      expect(formatters.alert(rowData, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the alert formatter without tooltip', () => {
      const columnData = {
        id: 'category-alert',
        name: 'Alert',
        field: 'category',
        color: 'info',
        icon: 'confirm',
        formatter: formatters.alert,
      };

      expect(formatters.alert({ ...rowData, category: null }, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the color formatter', () => {
      const columnData = {
        id: 'color',
        name: 'Color',
        field: 'color',
        formatter: formatters.color,
      };

      expect(formatters.color(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the color formatter with color-override', () => {
      const columnData = {
        id: 'color',
        name: 'Color',
        field: 'color',
        color: '#FF0000',
        formatter: formatters.color,
      };

      expect(formatters.color(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the color formatter without tooltip', () => {
      const columnData = {
        id: 'color',
        name: 'Color',
        field: 'color',
        color: '#FF0000',
        formatter: formatters.color,
      };

      expect(formatters.color({ rowData, color: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the color formatter with blank color', () => {
      const columnData = {
        id: 'color',
        name: 'Color',
        field: 'color',
        formatter: formatters.color,
      };

      expect(formatters.color({ rowData, color: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the icon formatter', () => {
      const columnData = {
        id: 'icon',
        name: 'Icon',
        field: 'icon',
        formatter: formatters.icon,
      };

      expect(formatters.icon(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the icon formatter as empty string', () => {
      const columnData = {
        id: 'icon',
        name: 'Icon',
        field: 'icon',
        formatter: formatters.icon,
      };

      expect(formatters.icon({ rowData, icon: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the icon formatter with icon-override', () => {
      const columnData = {
        id: 'icon',
        name: 'Icon',
        field: 'icon',
        icon: 'icon-confirm',
        formatter: formatters.icon,
      };

      expect(formatters.icon(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the icon formatter with icon-override without value', () => {
      const columnData = {
        id: 'icon',
        name: 'Icon',
        field: 'icon',
        icon: 'icon-confirm',
        formatter: formatters.icon,
      };

      expect(formatters.icon({ rowData, icon: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the icon formatter with color-override', () => {
      const columnData = {
        id: 'icon',
        name: 'Icon',
        field: 'icon',
        color: '#FF00FF',
        formatter: formatters.icon,
      };

      expect(formatters.icon(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the icon formatter with size-override', () => {
      const columnData = {
        id: 'icon',
        name: 'Icon',
        field: 'icon',
        size: 'small',
        formatter: formatters.icon,
      };

      expect(formatters.icon(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the icon formatter with invalid size-override', () => {
      const columnData = {
        id: 'icon',
        name: 'Icon',
        field: 'icon',
        size: 'xxxx-large',
        formatter: formatters.icon,
      };

      expect(formatters.icon(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the favorite formatter', () => {
      const columnData = {
        id: 'inStock-favorite',
        name: 'Favorite',
        field: 'inStock',
        formatter: formatters.favorite,
      };

      expect(formatters.favorite(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the favorite formatter without value', () => {
      const columnData = {
        id: 'inStock-favorite',
        name: 'Favorite',
        field: 'inStock',
        formatter: formatters.favorite,
      };

      expect(formatters.favorite({ rowData, inStock: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the favorite formatter with size-override', () => {
      const columnData = {
        id: 'inStock-favorite',
        name: 'Favorite',
        field: 'inStock',
        size: 'xxl',
        formatter: formatters.favorite,
      };

      expect(formatters.favorite(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the tag formatter', () => {
      const columnData = {
        id: 'category-tag',
        name: 'Tag',
        field: 'category',
        formatter: formatters.tag,
      };

      expect(formatters.tag(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the tag formatter with color-override', () => {
      const columnData = {
        id: 'category-tag',
        name: 'Tag',
        field: 'category',
        color: 'success',
        formatter: formatters.tag,
      };

      expect(formatters.tag(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the tag formatter without value', () => {
      const columnData = {
        id: 'category-tag',
        name: 'Tag',
        field: 'category',
        formatter: formatters.tag,
      };

      expect(formatters.tag({ rowData, category: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the progress formatter', () => {
      const columnData = {
        id: 'count-progress',
        name: 'Progress Bar',
        field: 'count',
        formatter: formatters.progress,
      };

      expect(formatters.progress(rowData, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the progress formatter with max-override', () => {
      const columnData = {
        id: 'count-progress',
        name: 'Progress Bar',
        field: 'count',
        max: 5,
        formatter: formatters.progress,
      };

      expect(formatters.progress(rowData, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the progress formatter with text/label override', () => {
      const columnData = {
        id: 'count-progress',
        name: 'Progress Bar',
        field: 'count',
        text: 'Progess Override',
        formatter: formatters.progress,
      };

      expect(formatters.progress(rowData, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the progress formatter without value', () => {
      const columnData = {
        id: 'count-progress',
        name: 'Progress Bar',
        field: 'count',
        formatter: formatters.progress,
      };

      expect(formatters.progress({ rowData, count: null }, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the rating formatter', () => {
      const columnData = {
        id: 'count-rating',
        name: 'Rating',
        field: 'count',
        formatter: formatters.rating,
      };

      expect(formatters.rating(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the rating formatter as readonly=true', () => {
      const columnData = {
        id: 'count-rating',
        name: 'Rating',
        field: 'count',
        readonly: true,
        formatter: formatters.rating,
      };

      expect(formatters.rating(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the rating formatter as readonly=false', () => {
      const columnData = {
        id: 'count-rating',
        name: 'Rating',
        field: 'count',
        readonly: false,
        formatter: formatters.rating,
      };

      expect(formatters.rating(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the rating formatter with color-override', () => {
      const columnData = {
        id: 'count-rating',
        name: 'Rating',
        field: 'count',
        color: 'orange',
        formatter: formatters.rating,
      };

      expect(formatters.rating(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the rating formatter with max-override', () => {
      const columnData = {
        id: 'count-rating',
        name: 'Rating',
        field: 'count',
        max: 10,
        formatter: formatters.rating,
      };

      expect(formatters.rating(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the rating formatter with text/label override', () => {
      const columnData = {
        id: 'count-rating',
        name: 'Rating',
        field: 'count',
        text: 'Rating Override',
        formatter: formatters.rating,
      };

      expect(formatters.rating(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the rating formatter without value', () => {
      const columnData = {
        id: 'count-rating',
        name: 'Rating',
        field: 'count',
        formatter: formatters.rating,
      };

      expect(formatters.rating({ rowData, count: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the slider formatter', () => {
      const columnData = {
        id: 'count-slider',
        name: 'Slider',
        field: 'count',
        formatter: formatters.slider,
      };

      expect(formatters.slider(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the slider formatter as readonly=true', () => {
      const columnData = {
        id: 'count-slider',
        name: 'Slider',
        field: 'count',
        readonly: true,
        formatter: formatters.slider,
      };

      expect(formatters.slider(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the slider formatter as readonly=false', () => {
      const columnData = {
        id: 'count-slider',
        name: 'Slider',
        field: 'count',
        readonly: false,
        formatter: formatters.slider,
      };

      expect(formatters.slider(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the slider formatter with color-override', () => {
      const columnData = {
        id: 'count-slider',
        name: 'Slider',
        field: 'count',
        color: 'azure06',
        formatter: formatters.slider,
      };

      expect(formatters.slider(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the slider formatter with max-override', () => {
      const columnData = {
        id: 'count-slider',
        name: 'Slider',
        field: 'count',
        max: 5,
        formatter: formatters.slider,
      };

      expect(formatters.slider(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the slider formatter with min-override', () => {
      const columnData = {
        id: 'count-slider',
        name: 'Slider',
        field: 'count',
        min: 3,
        formatter: formatters.slider,
      };

      expect(formatters.slider(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the slider formatter with text/label override', () => {
      const columnData = {
        id: 'count-slider',
        name: 'Slider',
        field: 'count',
        text: 'Slider Override',
        formatter: formatters.slider,
      };

      expect(formatters.slider(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the slider formatter without value', () => {
      const columnData = {
        id: 'count-slider',
        name: 'Slider',
        field: 'count',
        formatter: formatters.slider,
      };

      expect(formatters.slider({ rowData, count: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the stepChart formatter', () => {
      const columnData = {
        id: 'count-step-chart',
        name: 'Step Chart',
        field: 'count',
        formatter: formatters.stepChart,
      };

      expect(formatters.stepChart(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the stepChart formatter with color-override', () => {
      const columnData = {
        id: 'count-step-chart',
        name: 'Step Chart',
        field: 'count',
        color: 'azure06',
        formatter: formatters.stepChart,
      };

      expect(formatters.stepChart(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the stepChart formatter with max-override', () => {
      const columnData = {
        id: 'count-step-chart',
        name: 'Step Chart',
        field: 'count',
        max: 7,
        formatter: formatters.stepChart,
      };

      expect(formatters.stepChart(rowData, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the stepChart formatter without value', () => {
      const columnData = {
        id: 'count-step-chart',
        name: 'Step Chart',
        field: 'count',
        formatter: formatters.stepChart,
      };

      expect(formatters.stepChart({ rowData, count: null }, columnData, 1)).toMatchSnapshot();
    });

    it('can render with the image formatter', () => {
      const columnData = {
        id: 'image',
        name: 'Image',
        field: 'image',
        formatter: formatters.image,
      };

      expect(formatters.image(rowData, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the image formatter with alt/title text', () => {
      const columnData = {
        id: 'image',
        name: 'Image',
        field: 'image',
        text: 'Image Alt/Title Text',
        formatter: formatters.image,
      };

      expect(formatters.image(rowData, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the image formatter without value', () => {
      const columnData = {
        id: 'image',
        name: 'Image',
        field: 'image',
        formatter: formatters.image,
      };

      expect(formatters.image({ rowData, image: null }, columnData, 0)).toMatchSnapshot();
    });

    it('can render with the card formatter', () => {
      const columnData = {
        id: 'card',
        name: 'Card',
        field: 'convention',
        formatter: formatters.card,
      };

      expect(formatters.card(rowData, columnData)).toMatchSnapshot();
    });

    it('can render with the card formatter without value', () => {
      const columnData = {
        id: 'card',
        name: 'Card',
        field: 'convention',
        formatter: formatters.card,
      };

      expect(formatters.card({ rowData, convention: null }, columnData)).toMatchSnapshot();
    });
  });
});
