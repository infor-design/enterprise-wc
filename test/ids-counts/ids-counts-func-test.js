/**
 * @jest-environment jsdom
 */
import { IdsCounts } from '../../src/ids-counts/ids-counts';

describe('IdsCounts Component', () => {
  let count;

  beforeEach(async () => {
    const elem = new IdsCounts();
    document.body.appendChild(elem);
    count = document.querySelector('ids-counts');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsCounts();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-counts').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(count.outerHTML).toMatchSnapshot();
  });

  it('renders a specific hex color', () => {
    count.color = '#800000';
    expect(count.getAttribute('color')).toEqual('#800000');
    expect(count.color).toEqual('#800000');
  });

  it('is able to change sizes via compact attribute', () => {
    count.compact = 'true';
    expect(count.getAttribute('compact')).toEqual('true');
  });

  it('is able to change link via href attribute', () => {
    count.href = 'http://www.google.com';
    expect(count.getAttribute('href')).toEqual('http://www.google.com');
  });
});
