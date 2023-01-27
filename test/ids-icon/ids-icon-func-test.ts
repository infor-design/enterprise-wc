/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsIcon, { addIcon } from '../../src/components/ids-icon/ids-icon';
import processAnimFrame from '../helpers/process-anim-frame';
import { messages as arMessages } from '../../src/components/ids-locale/data/ar-messages';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';

describe('IdsIcon Component', () => {
  let elem: IdsIcon;
  let container: IdsContainer;

  beforeEach(() => {
    container = new IdsContainer();
    container.locale.loadedLanguages.set('de', deMessages);
    container.locale.loadedLanguages.set('ar', arMessages);
    elem = new IdsIcon();

    elem.icon = 'close';
    container.appendChild(elem);
    document.body.appendChild(container);
  });

  afterEach(() => {
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
    expect(elem.vertical).toBeTruthy();
    expect(elem.getAttribute('vertical')).toEqual('');
    elem.vertical = null;
    expect(elem.vertical).toEqual(false);
    expect(elem.getAttribute('vertical')).toEqual(null);
  });

  it('will flip some icons in RTL', async () => {
    document.body.innerHTML = '';
    container = new IdsContainer();
    const icon = new IdsIcon();
    icon.icon = 'previous-page';
    container.appendChild(icon);
    document.body.appendChild(container);
    container.language = 'ar';
    await processAnimFrame();
    expect(icon.isMirrored('previous-page')).toBeTruthy();
    expect(icon.template()).toContain('class="mirrored"');
  });

  it('can change language from the container', async () => {
    elem.icon = 'previous-page';
    container.language = 'de';
    await processAnimFrame();
    expect(elem.getAttribute('dir')).toBeFalsy();
    expect(elem.container?.getAttribute('dir')).toBeFalsy();
    container.language = 'ar';
    await processAnimFrame();
    expect(elem.template()).toContain('class="mirrored"');
  });

  it('can be updated with notification badges', () => {
    elem.icon = 'server';
    elem.badgePosition = 'bottom-right';
    elem.badgeColor = 'danger';
    expect(elem.getAttribute('badge-position')).toBe('bottom-right');
    expect(elem.getAttribute('badge-color')).toBe('danger');
  });

  it('can be reset after setting notification badges', () => {
    elem.icon = 'server';
    elem.badgeColor = 'danger';
    elem.badgePosition = 'bottom-right';
    elem.badgeColor = null;
    elem.badgePosition = null;
    expect(elem.getAttribute('badge-position')).toBeFalsy();
    expect(elem.getAttribute('badge-color')).toBeFalsy();
  });

  it('can use empty message icons', () => {
    expect(elem.getAttribute('icon')).toBe('close');
    elem.icon = 'empty-generic';
    expect(elem.getAttribute('icon')).toBe('empty-generic');
  });

  it('can add a custom height, width and viewbox', () => {
    elem.icon = 'empty-generic';
    elem.viewbox = '0 0 80 80';
    elem.height = '80';
    elem.width = '80';
    expect(elem.getAttribute('viewbox')).toBe('0 0 80 80');
    expect(elem.getAttribute('height')).toBe('80');
    expect(elem.getAttribute('width')).toBe('80');
    expect(elem.container);

    elem.viewbox = '';
    expect(elem.getAttribute('viewbox')).toBeFalsy();
    elem.height = '';
    expect(elem.getAttribute('height')).toBeFalsy();
    elem.width = '';
    expect(elem.getAttribute('width')).toBeFalsy();
  });

  it('can add a custom icon', () => {
    // test passing object-defined SVG
    addIcon('test-custom', [{
      shape: 'circle',
      id: 'circleId',
      cx: '9',
      cy: '9',
      r: '7',
      stroke: '#606066',
      'vector-effect': 'non-scaling-stroke'
    }]);

    elem.icon = 'test-custom';
    expect(elem.container?.querySelector('circle')?.id).toEqual('circleId');

    // test passing SVG markup
    addIcon('test-custom2', '<circle id="circleId2" cx="9" cy="9" r="7"></circle>');
    elem.icon = 'test-custom2';
    expect(elem.container?.querySelector('circle')?.id).toEqual('circleId2');
  });
});
