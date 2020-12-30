/**
 * @jest-environment jsdom
 */
import IdsIcon from '../../src/ids-icon/ids-icon';

describe('IdsIcon Component', () => {
  let elem;

  beforeEach(async () => {
    const icon = new IdsIcon();
    icon.icon = 'close';
    document.body.appendChild(icon);
    elem = document.querySelector('ids-icon');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem.remove();
    elem = new IdsIcon();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-icon').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(elem.outerHTML).toMatchSnapshot();
    elem.size = 'small';
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('renders size setting', () => {
    elem.size = 'large';
    expect(elem.size).toEqual('large');
    expect(elem.getAttribute('size')).toEqual('large');
  });

  it('renders size setting then removes it', () => {
    elem = new IdsIcon();
    document.body.appendChild(elem);
    elem.size = 'large';
    expect(elem.size).toEqual('large');
    expect(elem.getAttribute('size')).toEqual('large');
    elem.size = null;
    expect(elem.size).toEqual('normal');
    expect(elem.getAttribute('size')).toEqual(null);
  });

  it('renders icon setting then removes it', () => {
    elem = new IdsIcon();
    document.body.appendChild(elem);
    elem.icon = 'delete';
    expect(elem.icon).toEqual('delete');
    expect(elem.getAttribute('icon')).toEqual('delete');
    elem.icon = null;
    expect(elem.icon).toEqual(null);
    expect(elem.getAttribute('size')).toEqual(null);
  });

  it('defaults to normal size', () => {
    expect(elem.template()).toContain('height="18"');
    expect(elem.template()).toContain('width="18"');
  });
});
