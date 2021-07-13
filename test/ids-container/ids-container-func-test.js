/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/ids-container/ids-container';

describe('IdsContainer Component', () => {
  let container;

  beforeEach(async () => {
    container = new IdsContainer();
    document.body.appendChild(container);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsContainer();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-container').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(container.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders correctly for unscrollable', () => {
    container.scrollable = false;
    expect(container.template()).toEqual('<div class="ids-container" part="container"><slot></slot></div>');
  });

  it('can set and reset scrollable', () => {
    expect(container.scrollable).toEqual('true');
    container.scrollable = true;
    expect(container.scrollable).toEqual('true');
    expect(container.container.getAttribute('scrollable')).toEqual('true');
    container.scrollable = false;
    expect(container.scrollable).toEqual('false');
    expect(container.getAttribute('scrollable')).toEqual('false');
    expect(container.container.getAttribute('scrollable')).toEqual('false');
    container.scrollable = 'true';
    expect(container.scrollable).toEqual('true');
    expect(container.getAttribute('scrollable')).toEqual('true');
  });

  it('supports setting mode', () => {
    container.mode = 'dark';
    expect(container.container.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    container.version = 'classic';
    expect(container.container.getAttribute('version')).toEqual('classic');
  });

  it('has a padding attribute', () => {
    const padding = '18px';
    container.setAttribute('padding', padding);
    expect(container.getAttribute('padding')).toEqual(padding);
  });
});
