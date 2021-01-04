/**
 * @jest-environment jsdom
 */
import IdsLoader from '../../src/ids-loader/ids-loader';

describe('IdsLoader Component', () => {
  let loader;

  beforeEach(async () => {
    const elem = new IdsLoader();
    document.body.appendChild(elem);
    loader = document.querySelector('ids-loader');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    document.body.innerHTML = '';
    loader = new IdsLoader();
    document.body.appendChild(loader);
    expect(document.querySelectorAll('ids-loader').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(loader.shadowRoot.innerHTML).toMatchSnapshot();
  });
});
