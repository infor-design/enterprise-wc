/**
 * @jest-environment jsdom
 */
import IdsGridContainer from '../../src/ids-grid/ids-grid-container';
import IdsGridCell from '../../src/ids-grid/ids-grid-cell';

describe('IdsGrid Component', () => {
  let gridElem;

  beforeEach(async () => {
    const grid = new IdsGridContainer();
    const cell1 = new IdsGridCell();
    const cell2 = new IdsGridCell();
    const cell3 = new IdsGridCell();

    document.body.appendChild(grid);

    grid.appendChild(cell1);
    grid.appendChild(cell2);
    grid.appendChild(cell3);

    gridElem = document.querySelector('ids-grid-container');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    let elem = new IdsGridContainer();
    document.body.appendChild(elem);
    elem.remove();

    elem = new IdsGridCell();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-grid-container').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(gridElem.outerHTML).toMatchSnapshot();
    gridElem.fixed = false;
    expect(gridElem.outerHTML).toMatchSnapshot();
  });

  it('renders fixed setting', () => {
    const elem = new IdsGridContainer();
    elem.fixed = true;
    document.body.appendChild(elem);
    expect(elem.fixed).toEqual('true');
    expect(document.querySelectorAll('.ids-fixed').length).toEqual(1);
  });

  it('renders fixed setting then removes it', () => {
    const elem = new IdsGridContainer();
    elem.fixed = true;
    document.body.appendChild(elem);
    elem.fixed = false;
    expect(elem.fixed).toEqual(null);
    expect(document.querySelectorAll('.ids-fixed').length).toEqual(0);
  });

  it('renders fill setting', () => {
    const col = new IdsGridCell();
    col.fill = true;
    document.body.appendChild(col);
    expect(col.fill).toEqual('true');
    expect(document.querySelectorAll('.ids-background-fill').length).toEqual(1);
  });

  it('renders fill setting then removes it', () => {
    const col = new IdsGridCell();
    document.body.appendChild(col);
    col.fill = true;
    col.fill = false;
    expect(col.fill).toEqual(null);
    expect(document.querySelectorAll('.ids-background-fill').length).toEqual(0);
  });

  it('renders auto setting', () => {
    const elem = new IdsGridContainer();
    elem.auto = true;
    document.body.appendChild(elem);
    expect(elem.auto).toEqual('true');
    expect(document.querySelectorAll('.ids-grid-cols-auto').length).toEqual(1);
  });

  it('renders auto setting then removes it', () => {
    const elem = new IdsGridContainer();
    elem.auto = true;
    elem.auto = false;
    document.body.appendChild(elem);
    expect(elem.auto).toEqual(null);
    expect(document.querySelectorAll('.ids-grid-cols-auto').length).toEqual(0);
  });

  it('renders span setting', () => {
    const elem = new IdsGridCell();
    elem.span = 4;
    document.body.appendChild(elem);
    expect(elem.span).toEqual('4');
    expect(document.querySelectorAll('.ids-grid-span-4').length).toEqual(1);
  });
});
