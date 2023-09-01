/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';

// eslint-disable-next-line import/no-duplicates
import '../../src/components/ids-container/ids-container';
// eslint-disable-next-line import/no-duplicates
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsThemeSwitcher from '../../src/components/ids-theme-switcher/ids-theme-switcher';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import { messages as arMessages } from '../../src/components/ids-locale/data/ar-messages';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsThemeSwitcher Component', () => {
  let container: any;
  let switcher: any;

  beforeEach(async () => {
    container = new IdsContainer();
    IdsGlobal.getLocale().loadedLanguages.set('ar', arMessages);

    switcher = new IdsThemeSwitcher();
    container.appendChild(switcher);
    document.body.appendChild(container);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const container2: any = new IdsContainer();
    const switcher2 = new IdsThemeSwitcher();
    container2.appendChild(switcher2);
    document.body.appendChild(container2);
    container2.remove();
    switcher2.remove();
    expect(document.querySelectorAll('ids-container').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    switcher.shadowRoot.querySelector('style').remove();
    expect(switcher.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('handles selected from the ids-popup-menu', () => {
    const event = new CustomEvent('selected', { detail: { elem: { value: 'classic' } } });
    switcher.shadowRoot.querySelector('ids-popup-menu').dispatchEvent(event);

    event.detail.elem.value = 'contrast';
    switcher.shadowRoot.querySelector('ids-popup-menu').dispatchEvent(event);

    expect(switcher.mode).toEqual('contrast');
  });

  it('can set mode and then clear it to default', () => {
    switcher.mode = 'dark';
    switcher.mode = '';
    expect(switcher.mode).toEqual('light');
    expect(switcher.getAttribute('mode')).toBeFalsy();
  });

  it('supports setting color variants', async () => {
    await expectEnumAttributeBehavior({
      elem: switcher.container,
      attribute: 'color-variant',
      values: ['alternate'],
      defaultValue: null
    });
  });

  it('sync color variant with the container', async () => {
    switcher.colorVariant = 'alternate';
    switcher.onColorVariantRefresh();
    expect(switcher.container.colorVariant).toEqual('alternate');
  });

  it('can change language', async () => {
    await IdsGlobal.getLocale().setLanguage('ar');
    setTimeout(() => {
      expect(switcher.getAttribute('dir')).toEqual('rtl');
    });
  });
});
