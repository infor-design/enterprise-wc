/**
 * @jest-environment jsdom
 */
import IdsVirtualScroll from '../../src/ids-virtual-scroll/ids-virtual-scroll';
import dataset from '../../app/data/products.json';

describe('IdsVirtualScroll Component', () => {
  let virtualScroll;

  const appendVirtualScroll = () => {
    const elem = new IdsVirtualScroll();
    elem.innerHTML = `<div class="ids-list-view"><ul slot="contents"></ul></div>`;
    document.body.appendChild(elem);
    elem.height = 308;
    elem.itemHeight = 20;
    elem.itemTemplate = (item) => `<li class="ids-virtual-scroll-item">${item.productName}</li>`;
    elem.data = dataset;
    return elem;
  };

  beforeEach(async () => {
    virtualScroll = appendVirtualScroll();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    appendVirtualScroll();
    expect(document.querySelectorAll('ids-virtual-scroll').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(virtualScroll.innerHTML).toMatchSnapshot();
  });

  it('renders rows on scroll', async () => {
    const startingHtml = virtualScroll.innerHTML;

    virtualScroll.scrollTop = 30000;
    virtualScroll.handleScroll({ target: virtualScroll });
    await new Promise((r) => setTimeout(r, 50));

    expect(virtualScroll.innerHTML).not.toEqual(startingHtml);
  });

  it('renders cancels multiple handleScroll', async () => {
    const startingHtml = virtualScroll.innerHTML;

    virtualScroll.scrollTop = 500;
    virtualScroll.handleScroll({ target: virtualScroll });
    virtualScroll.scrollTop = 500;
    virtualScroll.handleScroll({ target: virtualScroll });
    virtualScroll.scrollTop = 501;
    virtualScroll.handleScroll({ target: virtualScroll });
    await new Promise((r) => setTimeout(r, 50));

    expect(virtualScroll.innerHTML).not.toEqual(startingHtml);
  });
});
