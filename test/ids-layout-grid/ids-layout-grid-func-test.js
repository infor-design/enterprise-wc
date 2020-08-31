/**
 * @jest-environment jsdom
 */
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';
import IdsLayoutColumn from '../../src/ids-layout-grid/ids-layout-column';

describe('IdsLayoutGrid Component', () => {
  let gridElem;

  beforeEach(async () => {
    const grid = new IdsLayoutGrid();
    const column1 = new IdsLayoutColumn();
    const column2 = new IdsLayoutColumn();
    const column3 = new IdsLayoutColumn();

    document.body.appendChild(grid);

    grid.appendChild(column1);
    grid.appendChild(column2);
    grid.appendChild(column3);

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

    elem = new IdsLayoutColumn();
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

  it('renders fill setting', () => {
    const col = new IdsLayoutColumn();
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
    const col = new IdsLayoutColumn();
    document.body.appendChild(col);
    col.fill = true;
    col.fill = false;
    expect(col.fill).toEqual(null);
    expect(document.querySelectorAll('.ids-background-fill').length).toEqual(0);
  });
});
