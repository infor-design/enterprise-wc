/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/components/ids-container/ids-container';
import { messages as arMessages } from '../../src/components/ids-locale/data/ar-messages';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';
import { locale as deDELocale } from '../../src/components/ids-locale/data/de-DE';
import { locale as arSALocale } from '../../src/components/ids-locale/data/ar-SA';
import IdsLocaleData from '../../src/components/ids-locale/ids-locale-data';

describe('IdsContainer Component', () => {
  let container: IdsContainer;

  beforeEach(() => {
    container = new IdsContainer();
    IdsLocaleData.loadedLanguages.set('ar', arMessages);
    IdsLocaleData.loadedLanguages.set('de', deMessages);
    IdsLocaleData.loadedLocales.set('de-DE', deDELocale);
    IdsLocaleData.loadedLocales.set('ar-SA', arSALocale);

    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsContainer();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-container').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set language via async func', async () => {
    await container.setLanguage('ar');
    expect(container.getAttribute('dir')).toEqual('rtl');
  });

  it('can set locale via attribute', () => {
    container.locale = 'de-DE';
    expect(container.locale).toEqual('de-DE');
  });

  it('can set locale via async func', async () => {
    await container.setLocale('ar-SA');
    expect(container.locale).toEqual('ar-SA');
    expect(container.getAttribute('dir')).toEqual('rtl');
  });

  it('renders correctly', () => {
    container.shadowRoot?.querySelector('style')?.remove();
    expect(container.shadowRoot?.innerHTML).toMatchSnapshot();
  });

  it('renders correctly for unscrollable', () => {
    container.scrollable = false;
    expect(container.template()).toEqual('<div class="ids-container" part="container"><slot></slot></div>');
  });

  it('can set and reset scrollable', () => {
    expect(container.scrollable).toEqual('true');
    container.scrollable = true;
    expect(container.scrollable).toEqual('true');
    expect(container.container?.getAttribute('scrollable')).toEqual('true');
    container.scrollable = false;
    expect(container.scrollable).toEqual('false');
    expect(container.getAttribute('scrollable')).toEqual('false');
    expect(container.container?.getAttribute('scrollable')).toEqual('false');
    container.scrollable = 'true';
    expect(container.scrollable).toEqual('true');
    expect(container.getAttribute('scrollable')).toEqual('true');
  });

  it('supports setting mode', () => {
    container.mode = 'dark';
    expect(container.container?.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting language', () => {
    container.language = 'ar';
    expect(container.getAttribute('language')).toEqual('ar');
    expect(container.getAttribute('dir')).toEqual('rtl');

    container.language = 'de';
    expect(container.getAttribute('language')).toEqual('de');
    expect(container.getAttribute('dir')).toEqual(null);
  });

  it('has a padding attribute', () => {
    container.padding = '18';
    expect(container.getAttribute('padding')).toEqual('18');
    expect(container.padding).toEqual('18');
  });

  it('has a reset attribute', () => {
    expect(container.reset).toBeTruthy();
    container.reset = false;
    expect(document.querySelector('body')?.style.margin).toEqual('');
    expect(container.getAttribute('reset')).toBeFalsy();
    container.reset = true;
    expect(document.querySelector('body')?.style.margin).toEqual('0px');
  });

  it('should remove hidden on window elem', () => {
    container.hidden = true;
    const event = new KeyboardEvent('load', { });
    window.dispatchEvent(event);
    expect(container.hidden).toEqual(false);
  });
});
