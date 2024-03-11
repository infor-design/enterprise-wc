/**
 * @jest-environment jsdom
 */
import IdsButton from '../../src/components/ids-button/ids-button';
import IdsContainer from '../../src/components/ids-container/ids-container';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import '../../src/components/ids-icon/ids-icon';
import type IdsIcon from '../../src/components/ids-icon/ids-icon';
import arMessages from '../../src/components/ids-locale/data/ar-messages.json';
import IdsGlobal from '../../src/components/ids-global/ids-global';
import IdsLocale from '../../src/components/ids-locale/ids-locale';

describe('IdsButton Component', () => {
  let btn: IdsButton;
  let locale: IdsLocale;

  beforeEach(() => {
    btn = new IdsButton();
    locale = IdsGlobal.getLocale();
    btn.id = 'test-button';
    btn.text = 'Test Button';
    document.body.appendChild(btn);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('exposes its inner button component', () => {
    expect(btn.button).toBeDefined();
    expect(btn.button instanceof HTMLElement).toBeTruthy();
  });

  test('focuses the inner button component when told to focus', () => {
    btn.focus();

    expect(btn.shadowRoot?.activeElement?.isEqualNode(btn.button));
  });

  test('can set rtl correctly', async () => {
    const container: any = new IdsContainer();
    btn = new IdsButton();
    btn.text = 'test';
    container.appendChild(btn);
    document.body.appendChild(container);
    expect(btn.container?.classList.contains('rtl')).toBeFalsy();
    locale.loadedLanguages.set('ar', arMessages);
    await IdsGlobal.getLocale().setLanguage('ar');
    expect(btn.localeAPI.isRTL()).toEqual(true);
  });

  test('can rerender', () => {
    btn.text = 'New';
    btn.icon = 'check';
    btn.disabled = true;
    btn.tabIndex = -1;
    btn.appearance = 'secondary';
    btn.cssClass = ['awesome'];
    btn.iconAlign = 'end';

    expect(btn.text).toEqual('New');
  });

  test('can get the icon element', () => {
    btn.icon = 'add';
    expect(btn.iconEl?.nodeName).toEqual('IDS-ICON');
  });

  test('supports setting color variants', async () => {
    await expectEnumAttributeBehavior({
      elem: btn,
      attribute: 'color-variant',
      values: ['alternate'],
      defaultValue: null
    });
  });
});
