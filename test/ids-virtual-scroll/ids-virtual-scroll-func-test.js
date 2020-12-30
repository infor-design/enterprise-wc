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

  it('renders rows on native scroll events', async () => {
    const startingHtml = virtualScroll.innerHTML;

    virtualScroll.container.dispatchEvent(new Event('scroll'));

    expect(virtualScroll.innerHTML).toEqual(startingHtml);
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

  it('can set the bufferSize attribute', async () => {
    expect((virtualScroll.innerHTML.match(/<li/g) || []).length).toEqual(56);
    virtualScroll.bufferSize = 100;
    expect(virtualScroll.getAttribute('buffer-size')).toEqual('100');

    virtualScroll.renderItems();

    expect((virtualScroll.innerHTML.match(/<li/g) || []).length).toEqual(216);
  });

  it('removes the height attribute when reset', () => {
    virtualScroll.height = null;
    expect(virtualScroll.getAttribute('height')).toEqual(null);
  });

  it('removes the bufferSize attribute when reset', () => {
    virtualScroll.bufferSize = null;
    expect(virtualScroll.getAttribute('buffer-size')).toEqual(null);
  });

  it('removes the itemHeight attribute when reset', () => {
    virtualScroll.itemHeight = null;
    expect(virtualScroll.getAttribute('item-height')).toEqual(null);
  });

  it('removes the itemCount attribute when reset', () => {
    virtualScroll.itemCount = null;
    expect(virtualScroll.getAttribute('item-count')).toEqual(null);
  });

  it('removes the data value when reset', () => {
    virtualScroll.data = null;
    expect(virtualScroll.datasource.data).toEqual(null);
  });

  it('has a simple default template', () => {
    const elem = new IdsVirtualScroll();
    elem.stringTemplate = '<div class="ids-virtual-scroll-item">${productName}</div>'; //eslint-disable-line
    const template = elem.itemTemplate({ productName: 'test' });
    expect(template).toEqual('<div class="ids-virtual-scroll-item">test</div>');
  });

  it('handles setting scrollTarget', () => {
    const errors = jest.spyOn(global.console, 'error');
    virtualScroll.scrollTarget = virtualScroll.shadowRoot.querySelector('.ids-virtual-scroll');
    expect(virtualScroll.scrollTarget).not.toBe(null);

    virtualScroll.scrollTarget = null;
    expect(errors).not.toHaveBeenCalled();
  });
});
