/**
 * @jest-environment jsdom
 */
import IdsLoadingIndicator from '../../src/ids-loading-indicator/ids-loading-indicator';

describe('IdsLoadingIndicator Component', () => {
  let loader;

  beforeEach(async () => {
    const elem = new IdsLoadingIndicator();
    document.body.appendChild(elem);
    loader = document.querySelector('ids-loading-indicator');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    document.body.innerHTML = '';
    loader = new IdsLoadingIndicator();
    document.body.appendChild(loader);
    expect(document.querySelectorAll('ids-loading-indicator').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(loader.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('supports setting mode', () => {
    loader.mode = 'dark';
    expect(loader.container.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    loader.version = 'classic';
    expect(loader.container.getAttribute('version')).toEqual('classic');
  });
});
