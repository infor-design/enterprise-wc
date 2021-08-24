/**
 * @jest-environment jsdom
 */
import IdsSkipLink from '../../src/components/ids-skip-link/ids-skip-link';

describe('IdsSkipLink Component', () => {
  let elem;

  beforeEach(async () => {
    const link = new IdsSkipLink();
    document.body.appendChild(link);
    elem = document.querySelector('ids-skip-link');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove();
    elem = new IdsSkipLink();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-skip-link').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    elem.href = 'test';
    elem.target = '_blank';
    expect(elem.shadowRoot.outerHTML).toMatchSnapshot();
  });

  it('renders href setting', () => {
    elem.href = 'test';
    expect(elem.href).toEqual('test');
    expect(document.querySelectorAll('[href="test"]').length).toEqual(1);
  });

  it('renders href setting then removes it', () => {
    elem.href = 'test';
    expect(elem.href).toEqual('test');
    elem.href = null;
    expect(elem.href).toEqual(null);
    expect(elem.getAttribute('href')).toEqual(null);
  });
});
