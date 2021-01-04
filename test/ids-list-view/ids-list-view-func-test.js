/**
 * @jest-environment jsdom
 */
import IdsListView from '../../src/ids-list-view/ids-list-view';
import dataset from '../../app/data/products.json';

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
    expect(listView.shadowRoot.querySelectorAll('li').length).toEqual(listView.data.length);
  });

  it('renders the template with virtual scroll', () => {
    document.body.innerHTML = '';
    listView = new IdsListView();
    listView.virtualScroll = true;
    listView.innerHTML = '<template><ids-text type="h2">${productName}</ids-text></template></ids-list-view>'; //eslint-disable-line
    document.body.appendChild(listView);
    listView.data = dataset;

    expect(listView.shadowRoot.querySelectorAll('li').length).toEqual(41);
  });

  it('renders without errors with no template', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    listView.data = dataset;

    expect(listView.shadowRoot.querySelectorAll('li').length).toEqual(1000);
    expect(errors).not.toHaveBeenCalled();
  });

  it('rerenders without errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    listView.data = dataset;
    listView.rerender();

    expect(listView.shadowRoot.querySelectorAll('li').length).toEqual(1000);
    expect(errors).not.toHaveBeenCalled();
  });

  it('rerenders without errors', () => {
    const errors = jest.spyOn(global.console, 'error');

    document.body.innerHTML = '';
    listView = new IdsListView();
    document.body.appendChild(listView);
    listView.data = dataset;
    listView.rerender();

    expect(listView.shadowRoot.querySelectorAll('li').length).toEqual(1000);
    expect(errors).not.toHaveBeenCalled();
  });

  it('removes the virtualScroll attribute when reset', () => {
    listView.virtualScroll = true;
    expect(listView.getAttribute('virtual-scroll')).toEqual('true');
    expect(listView.shadowRoot.querySelectorAll('li').length).toEqual(41);

    listView.virtualScroll = false;
    expect(listView.getAttribute('virtual-scroll')).toEqual(null);
    expect(listView.shadowRoot.querySelectorAll('li').length).toEqual(1000);
  });

  it('render with empty data', () => {
    listView.data = null;
    expect(listView.shadowRoot.querySelectorAll('li').length).toEqual(0);
  });
});
