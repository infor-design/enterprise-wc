import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';

test.describe('IdsDataGrid formatters tests', () => {
  const url = '/ids-data-grid/columns-formatters.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test('can render with the text formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 3)?.textContent)).toBe('101');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.data[0].description = null;
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 3)?.textContent)).toBe('');
  });

  test('can render with the password formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(1, 5)?.textContent)).toBe('••••');
  });

  test('can render with the rowNumber formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
      const cells = elem.container?.querySelectorAll('.ids-data-grid-cell.formatter-rowNumber');
      return [...(cells || [])].map((cell) => cell.textContent);
    });
    expect(results).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  });

  test('can render with the date formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 6)?.textContent)).toBe('4/23/2021');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.data[0].publishDate = null;
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 6)?.textContent)).toBe('');
  });

  test('can render with the time formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const text = elem.cellByIndex(0, 7)?.textContent;
      return text;
    })).toBe(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const formatted = elem.localeAPI.formatDate(elem.data[0].publishDate, { timeStyle: 'short' });
      return formatted;
    }));
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.data[0].publishDate = null;
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 7)?.textContent)).toBe('');
  });

  test('can render with the decimal formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const getCellText = async () => {
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        const cell = elem.container?.querySelector('.ids-data-grid-cell.formatter-decimal');
        return cell?.textContent;
      });
      return results;
    };
    expect(await getCellText()).toEqual('12.99');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      delete elem.columns[8].formatOptions;
      elem.redraw();
    });
    expect(await getCellText()).toEqual('12.99');
  });

  test('can render with the integer formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns[9].formatOptions = { locale: 'en-US', style: 'integer' };
      elem.data[0].price = 12;
      elem.redraw();
    });
    const getCellText = async () => {
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        const cell = elem.container?.querySelector('.ids-data-grid-cell.formatter-integer');
        return cell?.textContent;
      });
      return results;
    };
    expect(await getCellText()).toEqual('12.00');
  });

  test('can render with the hyperlink formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    const getCellText = async () => {
      const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
        const cell = elem.container?.querySelector('.ids-data-grid-cell.formatter-hyperlink');
        return cell?.textContent;
      });
      return results;
    };
    expect(await getCellText()).toEqual('United States');
    // can render disabled hyperlink
    expect(await page.locator('ids-data-grid ids-hyperlink').first().getAttribute('disabled')).not.toBeNull();
    // can render with the hyperlink formatter (with default href)
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      delete elem.columns[4].href;
      elem.redraw();
    });
    expect(await getCellText()).toEqual('United States');
    // can focus with the hyperlink when clicked instead of the cell
    await page.locator('ids-data-grid ids-hyperlink').last().click();
    // can render with the hyperlink formatter (with href function)
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns[4].href = (row: any) => `${row.book}`;
      elem.redraw();
    });
    expect(await page.locator('ids-data-grid ids-hyperlink').first().evaluate((elem: any) => elem.href)).toBe('101');
  });

  test('can render with the checkbox formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(1, 0)?.querySelector('.ids-data-grid-checkbox'))).not.toBeNull();
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector('.ids-data-grid-checkbox')?.classList?.contains('disabled'))).toBeTruthy();
  });

  test('can render with a custom formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 24)?.textContent)).toBe('Custom: 12.99');
  });

  test('can render with the button formatter (with click function)', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      (window as any).clicked = false;
      const clickListener = () => {
        (window as any).clicked = true;
      };
      elem.columns = [{
        id: 'button',
        name: 'button',
        sortable: false,
        resizable: false,
        formatter: elem.formatters.button,
        icon: 'settings',
        align: 'center',
        type: 'icon',
        click: clickListener,
        text: 'button'
      }, ...elem.columns];
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector('ids-button'))).not.toBeNull();
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector('ids-icon'))).not.toBeNull();
    await page.locator('ids-data-grid ids-button').first().click();
    expect(await page.evaluate(() => (window as any).clicked)).toBeTruthy();
  });

  test('can render with the button formatter (with menu functions)', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await expect(await page.locator('#actions-menu[hidden]').first()).toBeTruthy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      (elem.shadowRoot!.querySelector('ids-data-grid-row:nth-child(2) ids-button') as any).click();
    });
    await expect(await page.locator('#actions-menu:not([hidden])').first()).toBeTruthy();
  });

  test('can render with the button formatter defaults', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns = [{
        id: 'button',
        name: 'button',
        sortable: false,
        resizable: false,
        formatter: elem.formatters.button,
        align: 'center'
      }, ...elem.columns];
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector('ids-button'))).not.toBeNull();
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector('ids-button')?.textContent)).toContain('Button');
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector('ids-icon'))).toBeNull();
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector<any>('ids-button')?.appearance)).toBe('tertiary');
  });

  test('can render disabled buttons', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns = [{
        id: 'button',
        name: 'button',
        sortable: false,
        resizable: false,
        formatter: elem.formatters.button,
        icon: 'settings',
        align: 'center',
        disabled: (row: number, value: string, col: any, item: Record<string, any>) => item.book === 101,
        text: 'button'
      }, ...elem.columns];
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector<any>('ids-button')?.disabled)).toBeTruthy();
  });

  test('can disabled formatters edge cases', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns = [{
        id: 'test',
        name: 'test',
        formatter: elem.formatters.button,
        disabled: undefined
      }, ...elem.columns];
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector<any>('ids-button')?.disabled)).toBeFalsy();
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns[0].disabled = true;
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector<any>('ids-button')?.disabled)).toBeTruthy();
    await dataGrid.evaluate((elem: any) => {
      elem.columns[0].disabled = 'true';
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.cellByIndex(0, 0)?.querySelector<any>('ids-button')?.disabled)).toBeTruthy();
  });

  test('can render with the badge formatter (with color function)', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      (window as any).count = 0;
      const colorListener = () => {
        (window as any).count++;
        return 'info';
      };
      elem.columns = [{
        id: 'badge',
        name: 'badge',
        sortable: false,
        resizable: false,
        formatter: elem.formatters.badge,
        icon: 'settings',
        align: 'center',
        color: colorListener,
        field: 'price'
      }, ...elem.columns];
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const badge = elem.cellByIndex(0, 0)?.querySelector('ids-badge');
      return { text: badge?.textContent, color: badge?.getAttribute('color') };
    })).toEqual({ text: '12.99', color: 'info' });
    expect(await page.evaluate(() => (window as any).count)).toBe(14);
  });

  test('can render with the badge formatter with color class', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns = [{
        id: 'badge',
        name: 'badge',
        sortable: false,
        resizable: false,
        formatter: elem.formatters.badge,
        icon: 'settings',
        align: 'center',
        color: 'error',
        field: 'price'
      }, ...elem.columns];
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const badge = elem.cellByIndex(0, 0)?.querySelector('ids-badge');
      return { text: badge?.textContent, color: badge?.getAttribute('color') };
    })).toEqual({ text: '12.99', color: 'error' });
  });

  test('can render with the badge formatter with no color class', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns = [{
        id: 'badge',
        name: 'badge',
        sortable: false,
        resizable: false,
        formatter: elem.formatters.badge,
        icon: 'settings',
        align: 'center',
        field: 'price'
      }, ...elem.columns];
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const badge = elem.cellByIndex(0, 0)?.querySelector('ids-badge');
      return { text: badge?.textContent, color: badge?.getAttribute('color') };
    })).toEqual({ text: '12.99', color: null });
  });

  test('can render with the tree formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: IdsDataGrid) => {
      elem.columns = [{
        id: 'description',
        name: 'description',
        sortable: false,
        resizable: false,
        formatter: elem.formatters.tree
      }, ...elem.columns];
      elem.treeGrid = true;
      elem.data[0].children = [{ description: 'test' }];
      elem.data[0].rowExpanded = true;
      elem.data[1].children = [{ description: 'test' }];
      elem.data[1].rowExpanded = false;
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const button = elem?.cellByIndex(0, 0)?.querySelector<any>('ids-button');
      return { tabIndex: button?.tabIndex, button: Boolean(button), icon: button?.querySelector('ids-icon')?.getAttribute('icon') };
    })).toEqual({ tabIndex: -1, button: true, icon: 'plusminus-folder-open' });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const button = elem?.cellByIndex(1, 0)?.querySelector('ids-button');
      return { button: Boolean(button), icon: button?.querySelector('ids-icon')?.getAttribute('icon') };
    })).toEqual({ button: true, icon: 'plusminus-folder-closed' });
  });

  test('can render with the expander formatter', async ({ page }) => {
    const dataGrid = await page.locator('ids-data-grid');
    await dataGrid.evaluate((elem: any) => {
      elem.columns = [{
        id: 'description',
        name: 'description',
        formatter: elem.formatters.expander
      }, ...elem.columns];
      // eslint-disable-next-line no-template-curly-in-string
      elem.insertAdjacentHTML('afterbegin', '<template id="template-id"><span>${description}</span></template>');
      elem.expandableRow = true;
      elem.expandableRowTemplate = `template-id`;
      elem.data[1].rowExpanded = true;
      elem.redraw();
    });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const button = elem?.cellByIndex(0, 0)?.querySelector<any>('ids-button');
      return { tabIndex: button?.tabIndex, button: Boolean(button), icon: button?.querySelector('ids-icon')?.getAttribute('icon') };
    })).toEqual({ tabIndex: -1, button: true, icon: 'plusminus-folder-closed' });
    expect(await dataGrid.evaluate((elem: IdsDataGrid) => {
      const button = elem?.cellByIndex(1, 0)?.querySelector('ids-button');
      return { button: Boolean(button), icon: button?.querySelector('ids-icon')?.getAttribute('icon') };
    })).toEqual({ button: true, icon: 'plusminus-folder-open' });
  });

  test.describe('snapshots', () => {
    const rowData = {
      book: 102,
      description: '102',
      ledger: 'CORE',
      bookCurrency: 'eur',
      transactionCurrency: 'Book',
      postHistory: false,
      active: 'Yes',
      inStock: true,
      image: '/src/assets/images/placeholder-154x120.png',
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

    test('can render with the alert formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'category-alert',
          name: 'Alert',
          field: 'category',
          align: 'center',
          formatter: elem.formatters.alert,
          color: 'info',
        };

        return elem.formatters.alert(arg, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the alert formatter with icon', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'category-alert',
          name: 'Alert',
          field: 'category',
          align: 'center',
          formatter: elem.formatters.alert,
          color: 'info',
          icon: 'confirm',
        };

        return elem.formatters.alert(arg, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the alert formatter without tooltip', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'category-alert',
          name: 'Alert',
          field: 'category',
          color: 'info',
          icon: 'confirm',
          formatter: elem.formatters.alert,
        };

        return elem.formatters.alert({ ...arg, category: null }, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the color formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'color',
          name: 'Color',
          field: 'color',
          formatter: elem.formatters.color,
        };

        return elem.formatters.color(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the color formatter with color-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'color',
          name: 'Color',
          field: 'color',
          color: '#FF0000',
          formatter: elem.formatters.color,
        };

        return elem.formatters.color(arg, columnData, 1);
      }, rowData);
      expect(rendered).toMatchSnapshot();
    });

    test('can render with the color formatter without tooltip', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'color',
          name: 'Color',
          field: 'color',
          color: '#FF0000',
          formatter: elem.formatters.color,
        };

        return elem.formatters.color({ ...arg, color: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the color formatter with blank color', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'color',
          name: 'Color',
          field: 'color',
          formatter: elem.formatters.color,
        };

        return elem.formatters.color({ ...arg, color: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the icon formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'icon',
          name: 'Icon',
          field: 'icon',
          formatter: elem.formatters.icon,
        };

        return elem.formatters.icon(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the icon formatter as empty string', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'icon',
          name: 'Icon',
          field: 'icon',
          formatter: elem.formatters.icon,
        };

        return elem.formatters.icon({ ...arg, icon: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the icon formatter with icon-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'icon',
          name: 'Icon',
          field: 'icon',
          formatter: elem.formatters.icon,
          icon: 'icon-confirm',
        };

        return elem.formatters.icon(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the icon formatter with icon-override without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'icon',
          name: 'Icon',
          field: 'icon',
          formatter: elem.formatters.icon,
          icon: 'icon-confirm',
        };

        return elem.formatters.icon({ ...arg, icon: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the icon formatter with color-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'icon',
          name: 'Icon',
          field: 'icon',
          color: '#FF00FF',
          formatter: elem.formatters.icon,
        };

        return elem.formatters.icon(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the icon formatter with size-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'icon',
          name: 'Icon',
          field: 'icon',
          size: 'small',
          formatter: elem.formatters.icon,
        };

        return elem.formatters.icon(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the icon formatter with invalid size-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'icon',
          name: 'Icon',
          field: 'icon',
          size: 'xxxx-large',
          formatter: elem.formatters.icon,
        };

        return elem.formatters.icon(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the favorite formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'inStock-favorite',
          name: 'Favorite',
          field: 'inStock',
          formatter: elem.formatters.favorite,
        };

        return elem.formatters.favorite(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the favorite formatter without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'inStock-favorite',
          name: 'Favorite',
          field: 'inStock',
          formatter: elem.formatters.favorite,
        };

        return elem.formatters.favorite({ ...arg, inStock: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the favorite formatter with size-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'inStock-favorite',
          name: 'Favorite',
          field: 'inStock',
          size: 'xxl',
          formatter: elem.formatters.favorite,
        };

        return elem.formatters.favorite(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the tag formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'category-tag',
          name: 'Tag',
          field: 'category',
          formatter: elem.formatters.tag,
        };

        return elem.formatters.tag(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the tag formatter with color-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'category-tag',
          name: 'Tag',
          field: 'category',
          color: 'success',
          formatter: elem.formatters.tag,
        };

        return elem.formatters.tag(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the tag formatter without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'category-tag',
          name: 'Tag',
          field: 'category',
          formatter: elem.formatters.tag,
        };

        return elem.formatters.tag({ ...arg, category: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the progress formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-progress',
          name: 'Progress Bar',
          field: 'count',
          formatter: elem.formatters.progress,
        };

        return elem.formatters.progress(arg, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the progress formatter with max-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-progress',
          name: 'Progress Bar',
          field: 'count',
          max: 5,
          formatter: elem.formatters.progress,
        };

        return elem.formatters.progress(arg, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the progress formatter with text/label override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-progress',
          name: 'Progress Bar',
          field: 'count',
          text: 'Progess Override',
          formatter: elem.formatters.progress,
        };

        return elem.formatters.progress(arg, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the progress formatter without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-progress',
          name: 'Progress Bar',
          field: 'count',
          formatter: elem.formatters.progress,
        };

        return elem.formatters.progress({ ...arg, count: null }, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the rating formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-rating',
          name: 'Rating',
          field: 'count',
          formatter: elem.formatters.rating,
        };

        return elem.formatters.rating(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the rating formatter as readonly=true', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-rating',
          name: 'Rating',
          field: 'count',
          readonly: true,
          formatter: elem.formatters.rating,
        };

        return elem.formatters.rating(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the rating formatter as readonly=false', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-rating',
          name: 'Rating',
          field: 'count',
          readonly: false,
          formatter: elem.formatters.rating,
        };

        return elem.formatters.rating(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the rating formatter with color-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'count-rating',
          name: 'Rating',
          field: 'count',
          color: 'orange',
          formatter: elem.formatters.rating,
        };

        return elem.formatters.rating(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the rating formatter with max-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'count-rating',
          name: 'Rating',
          field: 'count',
          max: 10,
          formatter: elem.formatters.rating,
        };

        return elem.formatters.rating(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the rating formatter with text/label override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-rating',
          name: 'Rating',
          field: 'count',
          text: 'Rating Override',
          formatter: elem.formatters.rating,
        };

        return elem.formatters.rating(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the rating formatter without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-rating',
          name: 'Rating',
          field: 'count',
          formatter: elem.formatters.rating,
        };

        return elem.formatters.rating({ ...arg, count: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the slider formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-slider',
          name: 'Slider',
          field: 'count',
          formatter: elem.formatters.slider,
        };

        return elem.formatters.slider(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the slider formatter as readonly=true', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-slider',
          name: 'Slider',
          field: 'count',
          readonly: true,
          formatter: elem.formatters.slider,
        };

        return elem.formatters.slider(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the slider formatter as readonly=false', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-slider',
          name: 'Slider',
          field: 'count',
          readonly: false,
          formatter: elem.formatters.slider,
        };

        return elem.formatters.slider(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the slider formatter with color-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'count-slider',
          name: 'Slider',
          field: 'count',
          color: 'blue06',
          formatter: elem.formatters.slider,
        };

        return elem.formatters.slider(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the slider formatter with max-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-slider',
          name: 'Slider',
          field: 'count',
          max: 5,
          formatter: elem.formatters.slider,
        };

        return elem.formatters.slider(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the slider formatter with min-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-slider',
          name: 'Slider',
          field: 'count',
          min: 3,
          formatter: elem.formatters.slider,
        };

        return elem.formatters.slider(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the slider formatter with text/label override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-slider',
          name: 'Slider',
          field: 'count',
          text: 'Slider Override',
          formatter: elem.formatters.slider,
        };

        return elem.formatters.slider(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the slider formatter without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-slider',
          name: 'Slider',
          field: 'count',
          formatter: elem.formatters.slider,
        };

        return elem.formatters.slider({ ...arg, count: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the stepChart formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-step-chart',
          name: 'Step Chart',
          field: 'count',
          formatter: elem.formatters.stepChart,
        };

        return elem.formatters.stepChart(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the stepChart formatter with color-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData: any = {
          id: 'count-step-chart',
          name: 'Step Chart',
          field: 'count',
          color: 'blue06',
          formatter: elem.formatters.stepChart,
        };

        return elem.formatters.stepChart(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the stepChart formatter with max-override', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-step-chart',
          name: 'Step Chart',
          field: 'count',
          max: 7,
          formatter: elem.formatters.stepChart,
        };

        return elem.formatters.stepChart(arg, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the stepChart formatter without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'count-step-chart',
          name: 'Step Chart',
          field: 'count',
          formatter: elem.formatters.stepChart,
        };

        return elem.formatters.stepChart({ ...arg, count: null }, columnData, 1);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the image formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'image',
          name: 'Image',
          field: 'image',
          formatter: elem.formatters.image,
        };

        return elem.formatters.image(arg, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the image formatter with alt/title text', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'image',
          name: 'Image',
          field: 'image',
          text: 'Image Alt/Title Text',
          formatter: elem.formatters.image,
        };

        return elem.formatters.image(arg, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the image formatter without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'image',
          name: 'Image',
          field: 'image',
          formatter: elem.formatters.image,
        };

        return elem.formatters.image({ ...arg, image: null }, columnData, 0);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the card formatter', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'card',
          name: 'Card',
          field: 'convention',
          formatter: elem.formatters.card,
        };

        return elem.formatters.card(arg, columnData);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the card formatter without value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'card',
          name: 'Card',
          field: 'convention',
          formatter: elem.formatters.card,
        };

        return elem.formatters.card({ ...arg, convention: null }, columnData);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the lookup formatter without editor', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: IdsDataGrid, arg) => {
        const columnData = {
          id: 'location-lookup',
          name: 'Location',
          field: 'location',
          formatter: elem.formatters.lookup,
        };

        return elem.formatters.lookup(arg, columnData);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });

    test('can render with the lookup formatter with editor', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      const rendered = await dataGrid.evaluate((elem: any, arg) => {
        const columnData = {
          id: 'location-lookup',
          name: 'Location',
          field: 'location',
          formatter: elem.formatters.lookup,
          editor: {
            type: 'lookup' as any,
            editorSettings: {
              field: 'location',
              delimiter: ', ',
              columns: [],
              data: [],
            }
          }
        };

        return elem.formatters.lookup(arg, columnData);
      }, rowData);

      expect(rendered).toMatchSnapshot();
    });
  });
});
