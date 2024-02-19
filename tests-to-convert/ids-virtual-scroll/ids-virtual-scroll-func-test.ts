/**
 * @jest-environment jsdom
 */
import IdsVirtualScroll from '../../src/components/ids-virtual-scroll/ids-virtual-scroll';
import dataset from '../../src/assets/data/bikes.json';

describe('IdsVirtualScroll Component', () => {
  let virtualScroll: IdsVirtualScroll;

  const appendVirtualScroll = () => {
    const elem = new IdsVirtualScroll();
    elem.innerHTML = `<div class="ids-list-view-body" part="contents"></div>`;
    document.body.appendChild(elem);
    elem.height = 308;
    elem.itemHeight = 20;
    elem.itemTemplate = (item: any) => `<div part="list-item" class="ids-virtual-scroll-item">${item.manufacturerName}</div>`;
    elem.data = dataset;
    return elem;
  };

  beforeEach(async () => {
    virtualScroll = appendVirtualScroll();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('renders rows on native scroll events', async () => {
    const startingHtml = virtualScroll.innerHTML;

    virtualScroll.container?.dispatchEvent(new Event('scroll'));

    expect(virtualScroll.innerHTML).toEqual(startingHtml);
  });

  test('renders rows on scroll', async () => {
    requestAnimationFrame(async () => {
      const startingHtml = virtualScroll.innerHTML;

      virtualScroll.scrollTop = 30000;
      virtualScroll.handleScroll({ target: virtualScroll });
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((r) => setTimeout(r, 50));
      expect(virtualScroll.innerHTML).not.toEqual(startingHtml);
    });
  });

  test('renders cancels multiple handleScroll', async () => {
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

  test('can set the bufferSize attribute', async () => {
    requestAnimationFrame(() => {
      expect((virtualScroll.innerHTML.match(/<div part="list-item"/g) || []).length > 0).toBeTruthy();
      virtualScroll.bufferSize = 100;
      expect(virtualScroll.getAttribute('buffer-size')).toEqual('100');

      virtualScroll.renderItems(false);

      expect((virtualScroll.innerHTML.match(/<div part="list-item"/g) || []).length).toEqual(virtualScroll.visibleItemCount());
    });
  });

  test('removes the height attribute when reset', () => {
    virtualScroll.height = null;
    expect(virtualScroll.getAttribute('height')).toEqual(null);
  });

  test('removes the bufferSize attribute when reset', () => {
    virtualScroll.bufferSize = null;
    expect(virtualScroll.getAttribute('buffer-size')).toEqual(null);
  });

  test('removes the itemHeight attribute when reset', () => {
    virtualScroll.itemHeight = null;
    expect(virtualScroll.getAttribute('item-height')).toEqual(null);
  });

  test('removes the data value when reset', () => {
    virtualScroll.data = null;
    expect(virtualScroll.datasource?.data).toEqual(null);
  });

  test('has a simple default template', () => {
    const elem = new IdsVirtualScroll();
    elem.stringTemplate = '<div class="ids-virtual-scroll-item">${productName}</div>'; //eslint-disable-line
    const template = elem.itemTemplate({ productName: 'test' }, 0);
    expect(template).toEqual('<div class="ids-virtual-scroll-item">test</div>');
  });

  test('handles setting scrollTarget', () => {
    const errors = jest.spyOn(global.console, 'error');
    virtualScroll.scrollTarget = virtualScroll.shadowRoot?.querySelector('.ids-virtual-scroll');
    expect(virtualScroll.scrollTarget).not.toBe(null);

    virtualScroll.scrollTarget = null;
    expect(errors).not.toHaveBeenCalled();
  });

  test('can scroll to an item', () => {
    expect(virtualScroll.scrollTop).toEqual(0);
    const index = 900;
    virtualScroll.scrollToIndex(index);
    expect(virtualScroll.scrollTop).toEqual((index * virtualScroll.itemHeight));
  });

  test('can reset the scrollTop', () => {
    expect(virtualScroll.scrollTop).toEqual(0);
    virtualScroll.scrollTop = (null as any);
    virtualScroll.scrollTop = 100;
    virtualScroll.scrollTop = 0;
    virtualScroll.scrollTop = (null as any);
    expect(virtualScroll.scrollTop).toEqual(0);
    expect(virtualScroll.getAttribute('scroll-top')).toEqual(null);
  });

  test('can reset the data', () => {
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

  test('can reset the data to zero', () => {
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
