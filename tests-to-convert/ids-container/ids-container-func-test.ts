/**
 * @jest-environment jsdom
 */
import IdsContainer from '../../src/components/ids-container/ids-container';
import { messages as arMessages } from '../../src/components/ids-locale/data/ar-messages';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';
import { locale as deDELocale } from '../../src/components/ids-locale/data/de-DE';
import { locale as arSALocale } from '../../src/components/ids-locale/data/ar-SA';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsContainer Component', () => {
  let container: IdsContainer;
  let locale;

  beforeEach(() => {
    container = new IdsContainer();
    locale = IdsGlobal.getLocale();
    locale.loadedLanguages.set('ar', arMessages);
    locale.loadedLanguages.set('de', deMessages);
    locale.loadedLocales.set('de-DE', deDELocale);
    locale.loadedLocales.set('ar-SA', arSALocale);

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
    await container.localeAPI.setLanguage('ar');
    expect(container.getAttribute('dir')).toEqual('rtl');
  });

  it('can set locale via attribute', () => {
    container.locale = 'de-DE';
    expect(container.locale).toEqual('de-DE');
  });

  it('can set locale via async func', async () => {
    await container.localeAPI.setLocale('ar-SA');
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

  it('supports setting language', async () => {
    await container.localeAPI.setLanguage('ar');
    expect(container.getAttribute('language')).toEqual('ar');
    expect(container.getAttribute('dir')).toEqual('rtl');

    await container.localeAPI.setLanguage('de');
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
