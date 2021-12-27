/**
 * @jest-environment jsdom
 */
import IdsLayoutGrid from '../../src/components/ids-layout-grid/ids-layout-grid';
import IdsLayoutGridCell from '../../src/components/ids-layout-grid/ids-layout-grid-cell';
import IdsContainer from '../../src/components/ids-container/ids-container';
import processAnimFrame from '../helpers/process-anim-frame';

describe('IdsLayoutGrid Component', () => {
  let gridElem;

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
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

  it('renders fluid-grid setting', async () => {
    await processAnimFrame();
    expect(gridElem.getAttribute('cols')).toBe('fluid-grid');
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

  it('resets no-margins setting', () => {
    const elem = new IdsLayoutGrid();
    elem.noMargins = true;
    document.body.appendChild(elem);
    elem.noMargins = false;
    expect(elem.noMargins).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-grid-no-margins').length).toEqual(0);
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
    document.body.appendChild(elem);
    elem.auto = true;
    expect(elem.auto).toEqual('true');
    expect(document.querySelectorAll('.ids-layout-grid-auto').length).toEqual(1);
  });

  it('renders auto setting then removes it', () => {
    const elem = new IdsLayoutGrid();
    elem.auto = true;
    elem.auto = false;
    document.body.appendChild(elem);
    expect(elem.auto).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-grid-cols-auto').length).toEqual(0);
  });

  it('renders grid gap setting', () => {
    const elem = new IdsLayoutGrid();
    elem.gap = 'md';
    document.body.appendChild(elem);
    expect(elem.gap).toEqual('md');
    expect(document.querySelectorAll('.ids-layout-grid-gap-md').length).toEqual(1);
  });

  it('resets grid gap setting', () => {
    const elem = new IdsLayoutGrid();
    elem.gap = 'md';
    document.body.appendChild(elem);
    elem.gap = '';

    expect(elem.gap).toEqual('md');
    expect(document.querySelectorAll('.ids-layout-grid-gap-md').length).toEqual(1);
  });

  it('renders cols setting', () => {
    const elem = new IdsLayoutGrid();
    document.body.appendChild(elem);
    elem.cols = 16;
    expect(elem.cols).toEqual('16');
    expect(document.querySelectorAll('.ids-layout-grid-cols').length).toEqual(1);
    expect(elem.getAttribute('style')).toEqual(`--grid-cols: 16;`);

    elem.cols = 'fluid-grid';
    expect(document.querySelectorAll('.ids-layout-fluid-grid').length).toEqual(2);
    expect(elem.getAttribute('style')).toEqual('');

    elem.cols = 'fluid-grid-xl';
    expect(document.querySelectorAll('.ids-layout-fluid-grid-xl').length).toEqual(1);
    expect(elem.getAttribute('style')).toEqual('');
  });

  it('resets grid gap setting', () => {
    const elem = new IdsLayoutGrid();
    elem.cols = 16;
    document.body.appendChild(elem);
    elem.cols = null;

    expect(elem.cols).toEqual('16');
    expect(document.querySelectorAll('.ids-layout-fluid-grid').length).toEqual(1);
  });

  it('renders rows setting', () => {
    const elem = new IdsLayoutGrid();
    elem.rows = 4;
    document.body.appendChild(elem);
    expect(elem.rows).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-rows').length).toEqual(1);
    expect(elem.getAttribute('style')).toEqual(`--grid-rows: 4;`);
  });

  it('resets grid rows setting', () => {
    const elem = new IdsLayoutGrid();
    elem.rows = 4;
    document.body.appendChild(elem);
    elem.rows = null;

    expect(document.querySelectorAll('.ids-layout-grid-rows').length).toEqual(0);
    expect(elem.getAttribute('style')).toEqual('');
  });

  it('renders min-col-width setting', () => {
    const elem = new IdsLayoutGrid();
    elem.minColWidth = '120px';
    document.body.appendChild(elem);

    expect(elem.minColWidth).toEqual('120px');
    expect(elem.getAttribute('style')).toEqual(`--grid-min-col-width: 120px;`);
  });

  it('resets min-col-width setting', () => {
    const elem = new IdsLayoutGrid();
    elem.minColWidth = '120px';
    document.body.appendChild(elem);
    elem.minColWidth = null;

    expect(elem.minColWidth).toEqual(null);
    expect(elem.getAttribute('style')).toEqual('');
  });

  it('renders col-span setting', () => {
    const col = new IdsLayoutGridCell();
    col.colSpan = 4;
    document.body.appendChild(col);
    expect(col.colSpan).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-span').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-col-span: 4;`);
  });

  it('resets col-span setting', () => {
    const col = new IdsLayoutGridCell();
    col.colSpan = 4;
    document.body.appendChild(col);
    col.colSpan = null;

    expect(col.colSpan).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-grid-col-span').length).toEqual(0);
    expect(col.getAttribute('style')).toEqual('');
  });

  it('renders col-span classes', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpan = 4;
    await processAnimFrame();
    expect(document.querySelectorAll('.ids-layout-grid-col-span-4').length).toEqual(1);
  });

  it('does not render col-span classes if cols are set', () => {
    const col = new IdsLayoutGridCell();
    gridElem.cols = '4';

    col.colSpanXs = '4';
    expect(document.querySelectorAll('.ids-layout-grid-col-span-xs-4').length).toEqual(0);

    col.colSpanSm = '4';
    expect(document.querySelectorAll('.ids-layout-grid-col-span-sm-4').length).toEqual(0);

    col.colSpanMd = '4';
    expect(document.querySelectorAll('.ids-layout-grid-col-span-md-4').length).toEqual(0);

    col.colSpanLg = '4';
    expect(document.querySelectorAll('.ids-layout-grid-col-span-lg-4').length).toEqual(0);

    col.colSpanXl = '4';
    expect(document.querySelectorAll('.ids-layout-grid-col-span-xl-4').length).toEqual(0);

    col.colSpanXxl = '4';
    expect(document.querySelectorAll('.ids-layout-grid-col-span-xxl-4').length).toEqual(0);
  });

  it('renders col-span-xs setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanXs = 4;
    await processAnimFrame();
    expect(col.colSpanXs).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-span-xs-4').length).toEqual(1);
  });

  it('resets col-span-xs setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanXs = null;
    await processAnimFrame();
    expect(col.colSpanXs).toEqual(null);
  });

  it('renders col-span-sm setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanSm = 4;
    await processAnimFrame();
    expect(col.colSpanSm).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-span-sm-4').length).toEqual(1);
  });

  it('resets col-span-sm setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanSm = null;
    await processAnimFrame();
    expect(col.colSpanSm).toEqual(null);
  });

  it('renders col-span-md setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanMd = 4;
    await processAnimFrame();
    expect(col.colSpanMd).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-span-md-4').length).toEqual(1);
  });

  it('resets col-span-md setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanMd = null;
    await processAnimFrame();
    expect(col.colSpanMd).toEqual(null);
  });

  it('renders col-span-lg setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanLg = 4;
    await processAnimFrame();
    expect(col.colSpanLg).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-span-lg-4').length).toEqual(1);
  });

  it('resets col-span-lg setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanLg = null;
    await processAnimFrame();
    expect(col.colSpanLg).toEqual(null);
  });

  it('renders col-span-xl setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanXl = 4;
    await processAnimFrame();
    expect(col.colSpanXl).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-span-xl-4').length).toEqual(1);
  });

  it('resets col-span-xl setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanXl = null;
    await processAnimFrame();
    expect(col.colSpanXl).toEqual(null);
  });

  it('renders col-span-xxl setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanXxl = 4;
    await processAnimFrame();
    expect(col.colSpanXxl).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-span-xxl-4').length).toEqual(1);
  });

  it('resets col-span-xxl setting', async () => {
    const col = new IdsLayoutGridCell();
    gridElem.appendChild(col);
    col.colSpanXxl = null;
    await processAnimFrame();
    expect(col.colSpanXxl).toEqual(null);
  });

  it('renders col-start setting', () => {
    const col = new IdsLayoutGridCell();
    col.colStart = 4;
    document.body.appendChild(col);
    expect(col.colStart).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-start').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-col-start: 4;`);
  });

  it('resets col-start setting', () => {
    const col = new IdsLayoutGridCell();
    col.colStart = 4;
    document.body.appendChild(col);
    col.colStart = null;

    expect(col.colStart).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-grid-col-start').length).toEqual(0);
    expect(col.getAttribute('style')).toEqual('');
  });

  it('renders col-end setting', () => {
    const col = new IdsLayoutGridCell();
    col.colEnd = 4;
    document.body.appendChild(col);
    expect(col.colEnd).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-col-end').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-col-end: 4;`);
  });

  it('resets col-end setting', () => {
    const col = new IdsLayoutGridCell();
    col.colEnd = 4;
    document.body.appendChild(col);
    col.colEnd = null;

    expect(col.colEnd).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-grid-col-end').length).toEqual(0);
    expect(col.getAttribute('style')).toEqual('');
  });

  it('renders row-span setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowSpan = 4;
    document.body.appendChild(col);
    expect(col.rowSpan).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-row-span').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-row-span: 4;`);
  });

  it('resets row-span setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowSpan = 4;
    document.body.appendChild(col);
    col.rowSpan = null;

    expect(col.rowSpan).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-grid-row-span').length).toEqual(0);
    expect(col.getAttribute('style')).toEqual('');
  });

  it('renders row-start setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowStart = 4;
    document.body.appendChild(col);
    expect(col.rowStart).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-row-start').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-row-start: 4;`);
  });

  it('resets row-start setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowStart = 4;
    document.body.appendChild(col);
    col.rowStart = null;

    expect(col.rowStart).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-grid-row-start').length).toEqual(0);
    expect(col.getAttribute('style')).toEqual('');
  });

  it('renders row-end setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowEnd = 4;
    document.body.appendChild(col);
    expect(col.rowEnd).toEqual('4');
    expect(document.querySelectorAll('.ids-layout-grid-row-end').length).toEqual(1);
    expect(col.getAttribute('style')).toEqual(`--grid-row-end: 4;`);
  });

  it('resets row-end setting', () => {
    const col = new IdsLayoutGridCell();
    col.rowEnd = 4;
    document.body.appendChild(col);
    col.rowEnd = null;

    expect(col.rowEnd).toEqual(null);
    expect(document.querySelectorAll('.ids-layout-grid-row-end').length).toEqual(0);
    expect(col.getAttribute('style')).toEqual('');
  });

  it('renders justify setting', () => {
    const col = new IdsLayoutGridCell();
    col.justify = 'end';
    document.body.appendChild(col);
    expect(col.justify).toEqual('end');
    col.justify = 'start';
    expect(col.justify).toEqual('start');
    expect(col.getAttribute('style')).toEqual(`justify-self: start; margin-right: 32px;`);
  });

  it('resets row-end setting', () => {
    const col = new IdsLayoutGridCell();
    col.justify = 'end';
    document.body.appendChild(col);
    col.justify = null;

    expect(col.justify).toEqual(null);
    expect(col.getAttribute('style')).toEqual('margin-right: 0px;');
  });
});
