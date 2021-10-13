/**
 * @jest-environment jsdom
 */

/* eslint-disable no-debugger */
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsIcon from '../../src/components/ids-icon/ids-icon';

describe('IdsIcon Component', () => {
  let elem;
  let container;
  beforeEach(async () => {
    container = new IdsContainer();
    const icon = new IdsIcon();
    icon.icon = 'close';
    container.appendChild(icon);
    document.body.appendChild(container);
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
    expect(elem.icon).toEqual('');
    expect(elem.getAttribute('size')).toEqual(null);
  });

  it('defaults to normal size', () => {
    expect(elem.template()).toContain('height="18"');
    expect(elem.template()).toContain('width="18"');
  });

  it('renders vertical setting then removes it', () => {
    elem = new IdsIcon();
    document.body.appendChild(elem);
    elem.vertical = true;
    expect(elem.vertical).toEqual('true');
    expect(elem.getAttribute('vertical')).toEqual('true');
    elem.vertical = null;
    expect(elem.vertical).toEqual(false);
    expect(elem.getAttribute('vertical')).toEqual(null);
  });

  it('can change language', () => {
    elem = new IdsIcon();
    document.body.appendChild(elem);
    elem.language = 'ar';
    expect(elem.getAttribute('dir')).toEqual('rtl');
    expect(elem.container.getAttribute('dir')).toEqual('rtl');
  });

  it('will flip some icons in RTL', () => {
    document.body.innerHTML = '';
    container = new IdsContainer();
    const icon = new IdsIcon();
    icon.icon = 'previous-page';
    icon.language = 'ar';
    container.appendChild(icon);
    document.body.appendChild(container);
    icon.language = 'ar';
    expect(icon.isFlipped('previous-page')).toBeTruthy();
    expect(icon.template()).toContain('class="flipped"');
  });

  it('can change language from the container', () => {
    elem.icon = 'previous-page';
    container.language = 'ar';
    expect(elem.getAttribute('dir')).toEqual('rtl');
    expect(elem.container.getAttribute('dir')).toEqual('rtl');
    expect(elem.template()).toContain('class="flipped"');
    container.language = 'en';
  });

  it('can change language from the container', () => {
    elem.icon = 'previous-page';
    container.language = 'de';
    expect(elem.getAttribute('dir')).toBeFalsy();
    expect(elem.container.getAttribute('dir')).toBeFalsy();
    container.language = 'ar';
    expect(elem.template()).toContain('class="flipped"');
  });

  it('can be updated with notification badges', () => {
    elem.icon = 'server';
    elem.badgePosition = 'bottom-right';
    elem.badgeColor = 'danger';
    expect(elem.getAttribute('badge-position')).toBe('bottom-right');
    expect(elem.getAttribute('badge-color')).toBe('danger');
  });
});
