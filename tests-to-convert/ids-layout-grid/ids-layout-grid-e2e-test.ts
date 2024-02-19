import { AxePuppeteer } from '@axe-core/puppeteer';

describe('ids-layout-grid', () => {
  const url = 'http://localhost:4444/ids-layout-grid/example.html';

  test('should render 8 column ids-layout-grid with child elements', async () => {
    // find the ids-layout-grid component
    const idsLayoutGrid = await page.$('#eight-column-grid');

    // verify that the component exists
    expect(idsLayoutGrid).toBeTruthy();
    const cols = await idsLayoutGrid.evaluate((grid: any) => grid.getAttribute('cols'));
    expect(cols).toEqual('8');

    // verify the number of child elements
    const cells = await idsLayoutGrid.$$('ids-layout-grid-cell');
    expect(cells.length).toBe(21);

    // verify the attributes of the child elements
    const expectedAttributes = [
      { colSpan: '1' },
      { colSpan: '1' },
      { colSpan: '1' },
      { colSpan: '1' },
      { colSpan: '1' },
      { colSpan: '1' },
      { colSpan: '1' },
      { colSpan: '1' },
      { colSpan: '2' },
      { colSpan: '2' },
      { colSpan: '2' },
      { colSpan: '2' },
      { colSpan: '4' },
      { colSpan: '4' },
      { colSpan: '5' },
      { colSpan: '3' },
      { colSpan: '6' },
      { colSpan: '2' },
      { colSpan: '7' },
      { colSpan: '1' },
      { colSpan: '8' },
    ];
    for (let i = 0; i < cells.length; i++) {
      const attributes = await cells[i].evaluate((cell: any) => ({
        colSpan: cell.getAttribute('col-span')
      }));
      expect(attributes).toEqual(expectedAttributes[i]);
    }
  });
});
