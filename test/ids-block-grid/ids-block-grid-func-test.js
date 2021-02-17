/**
 * @jest-environment jsdom
 */
import IdsBlockgrid from '../../src/ids-block-grid/ids-block-grid';
import IdsBlockgridItem from '../../src/ids-block-grid/ids-block-grid-item';

describe('IdsBlockgrid Component', () => {
  let blockgridEl;

  beforeEach(async () => {
    const blockgrid = new IdsBlockgrid();
    const blockgridItem = new IdsBlockgridItem();

    document.body.appendChild(blockgrid);

    blockgrid.appendChild(blockgridItem);

    blockgridEl = document.querySelector('ids-block-grid');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    let elem = new IdsBlockgrid();
    document.body.appendChild(elem);
    elem.remove();

    elem = new IdsBlockgridItem();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-block-grid').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    blockgridEl.align = 'left';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
    blockgridEl.align = 'centered';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
    blockgridEl.align = 'right';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
  });

  it('renders align setting', () => {
    blockgridEl.align = 'centered';
    expect(blockgridEl.align).toEqual('centered');
    expect(blockgridEl.getAttribute('align')).toEqual('centered');
  });

  it('renders blockgrid left correctly then removes it', () => {
    const elem = new IdsBlockgrid();
    document.body.appendChild(elem);
    elem.align = 'centered';
    expect(elem.align).toEqual('centered');
    expect(elem.getAttribute('align')).toEqual('centered');
    expect(elem.style.textAlign).toEqual('center');

    elem.removeAttribute('align');
    expect(elem.getAttribute('align')).toEqual(null);
    expect(elem.style.textAlign).toEqual('');
  });
});
