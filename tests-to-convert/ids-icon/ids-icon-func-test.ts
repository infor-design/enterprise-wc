/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsIcon from '../../src/components/ids-icon/ids-icon';
import processAnimFrame from '../helpers/process-anim-frame';
import { messages as arMessages } from '../../src/components/ids-locale/data/ar-messages';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';
import customIconJSON from '../../src/components/ids-icon/demos/custom-icon-data.json';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsIcon Component', () => {
  let elem: IdsIcon;
  let container: IdsContainer;

  beforeEach(() => {
    container = new IdsContainer();
    IdsGlobal.getLocale().loadedLanguages.set('de', deMessages);
    IdsGlobal.getLocale().loadedLanguages.set('ar', arMessages);
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
    expect(elem.template()).toContain('0 0 18 18');
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

    await processAnimFrame();
    await container.localeAPI.setLanguage('ar');
    IdsGlobal.getLocale().setLanguage('ar');
    await processAnimFrame();
    expect(icon.isMirrored('previous-page')).toBeTruthy();
    expect(icon.template()).toContain('class="mirrored"');
  });

  it('can change language from the container', async () => {
    elem.icon = 'previous-page';
    await container.localeAPI.setLanguage('de');
    await processAnimFrame();
    expect(elem.getAttribute('dir')).toBeFalsy();
    expect(elem.container?.getAttribute('dir')).toBeFalsy();
    await container.localeAPI.setLanguage('ar');
    await processAnimFrame();
    expect(elem.template()).toContain('class="mirrored"');
  });

  it('can be updated with notification badges', () => {
    elem.icon = 'server';
    elem.badgePosition = 'bottom-right';
    elem.badgeColor = 'error';
    expect(elem.getAttribute('badge-position')).toBe('bottom-right');
    expect(elem.getAttribute('badge-color')).toBe('error');
  });

  it('can be reset after setting notification badges', () => {
    elem.icon = 'server';
    elem.badgeColor = 'error';
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

  it('can add a custom icon sheet', async () => {
    expect(customIconJSON).toBeTruthy();
    IdsGlobal.customIconData = customIconJSON;
    expect(IdsGlobal.customIconData).toBeTruthy();

    // <ids-icon icon="custom-airplane" size="large"></ids-icon>
    elem.icon = 'custom-airplane';
    expect((IdsGlobal.customIconData as any)['custom-airplane']).toBeTruthy();
    expect(elem.container?.innerHTML).toEqual((IdsGlobal.customIconData as any)['custom-airplane']);
  });
});
