/**
 * @jest-environment jsdom
 */
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';
import IdsLayoutGridCell from '../../src/ids-layout-grid/ids-layout-grid-cell';

describe('IdsLayoutGrid Component', () => {
  let gridElem;

  beforeEach(async () => {
    const grid = new IdsLayoutGrid();
    const cell1 = new IdsLayoutGridCell();
    const cell2 = new IdsLayoutGridCell();
    const cell3 = new IdsLayoutGridCell();

    document.body.appendChild(grid);

    grid.appendChild(cell1);
    grid.appendChild(cell2);
    grid.appendChild(cell3);

    gridElem = document.querySelector('ids-layout-grid');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    let elem = new IdsLayoutGrid();
    document.body.appendChild(elem);
    elem.remove();

    elem = new IdsLayoutGridCell();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-layout-grid').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(gridElem.outerHTML).toMatchSnapshot();
    gridElem.fixed = true;
    expect(gridElem.outerHTML).toMatchSnapshot();
  });

  it('renders fixed setting', () => {
    const elem = new IdsLayoutGrid();
    elem.fixed = true;
    document.body.appendChild(elem);
    expect(elem.fixed).toEqual('true');
    expect(document.querySelectorAll('.ids-fixed').length).toEqual(1);
  });

  it('renders no-margins setting', () => {
    const elem = new IdsLayoutGrid();
    elem.noMargins = true;
    document.body.appendChild(elem);
    expect(elem.noMargins).toEqual('true');
    expect(document.querySelectorAll('.ids-layout-grid-no-margins').length).toEqual(1);
  });

  it('renders fill setting', () => {
    const col = new IdsLayoutGridCell();
    col.fill = true;
    document.body.appendChild(col);
    expect(col.fill).toEqual('true');
    expect(document.querySelectorAll('.ids-background-fill').length).toEqual(1);
  });

  it('renders fixed setting then removes it', () => {
    const elem = new IdsLayoutGrid();
    elem.fixed = true;
    document.body.appendChild(elem);
    elem.fixed = false;
    expect(elem.fixed).toEqual(null);
    expect(document.querySelectorAll('.ids-fixed').length).toEqual(0);
  });

  it('renders fill setting then removes it', () => {
    const col = new IdsLayoutGridCell();
    document.body.appendChild(col);
    col.fill = true;
    col.fill = false;
    expect(col.fill).toEqual(null);
    expect(document.querySelectorAll('.ids-background-fill').length).toEqual(0);
  });

  it('renders auto setting', () => {
    const elem = new IdsLayoutGrid();
    elem.auto = true;
    document.body.appendChild(elem);
    expect(elem.auto).toEqual('true');
    expect(document.querySelectorAll('.ids-layout-cols-auto').length).toEqual(1);
  });

  it('renders auto setting then removes it', () => {
    const elem = new IdsLayoutGrid();
    elem.auto = true;
    elem.auto = false;
    document.body.appendChild(elem);
    expect(elem.auto).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-cols-auto').length).toEqual(0);
  });

  it('renders grid gap setting', () => {
    const elem = new IdsLayoutGrid();
    elem.gap = 'md';
    document.body.appendChild(elem);
    expect(elem.gap).toEqual('md');
    expect(document.querySelectorAll('.ids-layout-grid-gap-md').length).toEqual(1);
  });

  it('renders cols setting', () => {
    const elem = new IdsLayoutGrid();
    elem.cols = 16;
    document.body.appendChild(elem);
    expect(elem.cols).toEqual('16');
    expect(document.querySelectorAll('.ids-layout-cols').length).toEqual(1);
    expect(elem.getAttribute('style')).toEqual(`--grid-cols: 16;`);
  });

  it('renders rows setting', () => {
    const elem = new IdsLayoutGrid();
    elem.rows = 4;
    document.body.appendChild(elem);
    expect(elem.rows).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-rows').length).toEqual(1);
    expect(elem.getAttribute('style')).toEqual(`--grid-rows: 4;`);
  });

  it('renders col-span setting', () => {
    const col = new IdsLayoutGridCell();
    col.colSpan = 4;
    document.body.appendChild(col);
    expect(col.colSpan).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-col-span').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-col-span: 4;`);
  });

  it('renders col-start setting', () => {
    const col = new IdsLayoutGridCell();
    col.colStart = 4;
    document.body.appendChild(col);
    expect(col.colStart).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-col-start').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-col-start: 4;`);
  });

  it('renders col-end setting', () => {
    const col = new IdsLayoutGridCell();
    col.colEnd = 4;
    document.body.appendChild(col);
    expect(col.colEnd).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-col-end').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-col-end: 4;`);
  });

  it('renders row-span setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowSpan = 4;
    document.body.appendChild(col);
    expect(col.rowSpan).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-row-span').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-row-span: 4;`);
  });

  it('renders row-start setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowStart = 4;
    document.body.appendChild(col);
    expect(col.rowStart).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-row-start').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-row-start: 4;`);
  });

  it('renders row-end setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowEnd = 4;
    document.body.appendChild(col);
    expect(col.rowEnd).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-row-end').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-row-end: 4;`);
  });
});
