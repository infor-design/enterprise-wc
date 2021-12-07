/**
 * @jest-environment jsdom
 */
import IdsListView from '../../src/components/ids-list-view/ids-list-view';
import dataset from '../../demos/data/products.json';

describe('IdsListView Component', () => {
  let listView;
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

  beforeEach(async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 320 });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 320 });

    listView = new IdsListView();
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line
    document.body.appendChild(listView);
    listView.data = dataset;
  });

  afterEach(async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    listView = new IdsListView();
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line
    document.body.appendChild(listView);
    listView.data = dataset;

    listView.remove();

    expect(document.querySelectorAll('ids-list-view').length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders the template without virtual scroll', () => {
    listView.data = dataset;
    expect(listView.shadowRoot.querySelectorAll('div[part="list-item"]').length).toEqual(listView.data.length);
  });

  it('renders the template with virtual scroll', () => {
    document.body.innerHTML = '';
    listView = new IdsListView();
    listView.virtualScroll = true;
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line
    document.body.appendChild(listView);
    listView.data = dataset;

    expect(listView.shadowRoot.querySelectorAll('div[part="list-item"]').length).toEqual(listView.shadowRoot.querySelector('ids-virtual-scroll').visibleItemCount());
  });

  it('renders without errors with no template', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    listView.data = dataset;

    expect(listView.shadowRoot.querySelectorAll('div[part="list-item"]').length).toEqual(1000);
    expect(errors).not.toHaveBeenCalled();
  });

  it('rerenders without errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    listView.data = dataset;

    expect(listView.shadowRoot.querySelectorAll('div[part="list-item"]').length).toEqual(1000);
    expect(errors).not.toHaveBeenCalled();
  });

  it('rerenders without errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    listView.data = dataset;

    expect(listView.shadowRoot.querySelectorAll('div[part="list-item"]').length).toEqual(1000);
    expect(errors).not.toHaveBeenCalled();
  });

  it('removes the virtualScroll attribute when reset', () => {
    listView.virtualScroll = true;
    expect(listView.getAttribute('virtual-scroll')).toEqual('true');
    expect(listView.shadowRoot.querySelectorAll('div[part="list-item"]').length).toEqual(listView.shadowRoot.querySelector('ids-virtual-scroll').visibleItemCount());

    listView.virtualScroll = false;
    expect(listView.getAttribute('virtual-scroll')).toEqual(null);
    expect(listView.shadowRoot.querySelectorAll('div[part="list-item"]').length).toEqual(1000);
  });

  it('render with empty data', () => {
    listView.data = null;
    expect(listView.shadowRoot.querySelectorAll('div[part="list-item"]').length).toEqual(0);
  });

  it('supports setting mode', () => {
    listView.mode = 'dark';
    expect(listView.container.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    listView.version = 'classic';
    expect(listView.container.getAttribute('version')).toEqual('classic');
  });

  it('supports setting height', () => {
    listView.height = '600px';
    expect(listView.getAttribute('height')).toEqual('600px');
    listView.height = undefined;
    expect(listView.getAttribute('height')).toEqual('100%');
  });

  it('supports setting itemHeight', () => {
    listView.itemHeight = '40px';
    expect(listView.getAttribute('item-height')).toEqual('40px');
    listView.itemHeight = undefined;
    expect(listView.getAttribute('item-height')).toBeFalsy();
  });

  it('supports setting draggable', () => {
    listView.draggable = true;
    expect(listView.getAttribute('draggable')).toEqual('true');
    listView.draggable = false;
    expect(listView.getAttribute('draggable')).toBeFalsy();
  });

  it('supports setting focus', () => {
    listView.focus();
    expect(document.activeElement.tagName).toEqual('IDS-LIST-VIEW');
  });

  it('can use arrow keys to navigate', () => {
    requestAnimationFrame(() => {
      expect(listView.shadowRoot.querySelector('[part="list-item"][tabindex="0"]').innerHTML.indexOf('Discretionary') > -1).toEqual(true);
      listView.shadowRoot.querySelector('[part="list-item"][tabindex="0"]').focus();
      let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      listView.dispatchEvent(event);
      expect(listView.shadowRoot.querySelector('[part="list-item"][tabindex="0"]').innerHTML.indexOf('Dentist') > -1).toEqual(true);

      event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      listView.dispatchEvent(event);
      expect(listView.shadowRoot.querySelector('[part="list-item"][tabindex="0"]').innerHTML.indexOf('Discretionary') > -1).toEqual(true);
    });
  });
});
