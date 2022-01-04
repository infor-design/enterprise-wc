/**
 * @jest-environment jsdom
 */
import IdsVirtualScroll from '../../src/components/ids-virtual-scroll/ids-virtual-scroll';
import dataset from '../../demos/data/bikes.json';

describe('IdsVirtualScroll Component', () => {
  let virtualScroll;

  const appendVirtualScroll = () => {
    const elem = new IdsVirtualScroll();
    elem.innerHTML = `<div class="ids-list-view-body" part="contents"></div>`;
    document.body.appendChild(elem);
    elem.height = 308;
    elem.itemHeight = 20;
    elem.itemTemplate = (item) => `<div part="list-item" class="ids-virtual-scroll-item">${item.manufacturerName}</div>`;
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
    requestAnimationFrame(async () => {
      const startingHtml = virtualScroll.innerHTML;

      virtualScroll.scrollTop = 30000;
      virtualScroll.handleScroll({ target: virtualScroll });
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 50));
      expect(virtualScroll.innerHTML).not.toEqual(startingHtml);
    });
  });

  it('renders cancels multiple handleScroll', async () => {
    requestAnimationFrame(async () => {
      const startingHtml = virtualScroll.innerHTML;

      virtualScroll.scrollTop = 500;
      virtualScroll.handleScroll({ target: virtualScroll });
      virtualScroll.scrollTop = 500;
      virtualScroll.handleScroll({ target: virtualScroll });
      virtualScroll.scrollTop = 501;
      virtualScroll.handleScroll({ target: virtualScroll });
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 50));

      expect(virtualScroll.innerHTML).not.toEqual(startingHtml);
    });
  });

  it('can set the bufferSize attribute', async () => {
    requestAnimationFrame(() => {
      expect((virtualScroll.innerHTML.match(/<div part="list-item"/g) || []).length > 0).toBeTruthy();
      virtualScroll.bufferSize = 100;
      expect(virtualScroll.getAttribute('buffer-size')).toEqual('100');

      virtualScroll.renderItems();

      expect((virtualScroll.innerHTML.match(/<div part="list-item"/g) || []).length).toEqual(virtualScroll.visibleItemCount());
    });
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

  it('can scroll to an item', () => {
    expect(virtualScroll.scrollTop).toEqual('0');
    const index = 900;
    virtualScroll.scrollToIndex(index);
    expect(virtualScroll.scrollTop).toEqual((index * virtualScroll.itemHeight).toString());
  });

  it('can reset the scrollTop', () => {
    expect(virtualScroll.scrollTop).toEqual('0');
    virtualScroll.scrollTop = null;
    virtualScroll.scrollTop = 100;
    virtualScroll.scrollTop = 0;
    virtualScroll.scrollTop = null;
    expect(virtualScroll.scrollTop).toEqual(0);
    expect(virtualScroll.getAttribute('scroll-top')).toEqual(null);
  });

  it('can reset the data', () => {
    requestAnimationFrame(() => {
      let list = virtualScroll.querySelectorAll('.ids-virtual-scroll-item');
      let listSize = list.length;
      expect(listSize > 0).toBeTruthy();
      virtualScroll.data = virtualScroll.data.slice(1, 3);

      // reselect
      list = virtualScroll.querySelectorAll('.ids-virtual-scroll-item');
      listSize = list.length;
      expect(listSize).toEqual(2);
    });
  });

  it('can reset the data to zero', () => {
    requestAnimationFrame(() => {
      let list = virtualScroll.querySelectorAll('div[part="list-item"]');
      let listSize = list.length;
      expect(listSize > 0).toBeTruthy();
      virtualScroll.data = [];

      // reselect
      list = virtualScroll.querySelectorAll('div[part="list-item"]');
      listSize = list.length;
      expect(listSize).toEqual(0);
    });
  });
});
