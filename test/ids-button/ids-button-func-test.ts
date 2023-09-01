/**
 * @jest-environment jsdom
 */
import IdsButton from '../../src/components/ids-button/ids-button';
import IdsContainer from '../../src/components/ids-container/ids-container';
import expectEnumAttributeBehavior from '../helpers/expect-enum-attribute-behavior';
import processAnimFrame from '../helpers/process-anim-frame';
import '../../src/components/ids-icon/ids-icon';
import type IdsIcon from '../../src/components/ids-icon/ids-icon';
import { messages as arMessages } from '../../src/components/ids-locale/data/ar-messages';
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

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    btn.remove();
    btn = new IdsButton();
    document.body.appendChild(btn);

    expect(document.querySelectorAll('ids-button').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    expect(btn.shouldUpdate).toBeTruthy();
  });

  it('renders correctly', async () => {
    const elem: any = new IdsButton();
    document.body.appendChild(elem);
    elem.cssClass = 'test-class';
    elem.disabled = true;
    elem.icon = 'add';
    elem.text = 'test';
    elem.state.appearance = 'icon';
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('renders icons on the opposite side correctly', () => {
    const elem: any = new IdsButton();
    document.body.appendChild(elem);
    elem.id = 'test-button';
    elem.icon = 'settings';
    elem.iconAlign = 'end';
    elem.text = 'Settings';
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('exposes its inner button component', () => {
    expect(btn.button).toBeDefined();
    expect(btn.button instanceof HTMLElement).toBeTruthy();
  });

  it('focuses the inner button component when told to focus', () => {
    btn.focus();

    expect(btn.shadowRoot?.activeElement?.isEqualNode(btn.button));
  });

  it('can be disabled/enabled', () => {
    btn.disabled = true;

    expect(btn.hasAttribute('disabled')).toBeTruthy();
    expect(btn.disabled).toBeTruthy();
    expect(btn.button?.hasAttribute('disabled')).toBeTruthy();
    expect(btn.state.disabled).toBeTruthy();

    btn.disabled = false;

    expect(btn.hasAttribute('disabled')).toBeFalsy();
    expect(btn.disabled).toBeFalsy();
    expect(btn.button?.hasAttribute('disabled')).toBeFalsy();
    expect(btn.state.disabled).toBeFalsy();
  });

  it('can disabled padding', () => {
    btn.noPadding = true;

    expect(btn.container?.classList.contains('no-padding')).toBeTruthy();
    expect(btn.getAttribute('no-padding')).toEqual('true');

    btn.noPadding = false;

    expect(btn.container?.classList.contains('no-padding')).toBeFalsy();
    expect(btn.getAttribute('no-padding')).toBeFalsy();
  });

  it('can set rtl correctly', async () => {
    const container: any = new IdsContainer();
    btn = new IdsButton();
    btn.text = 'test';
    container.appendChild(btn);
    document.body.appendChild(container);
    expect(btn.container?.classList.contains('rtl')).toBeFalsy();
    locale.loadedLanguages.set('ar', arMessages);
    await IdsGlobal.getLocale().setLanguage('ar');
    await processAnimFrame();
    expect(btn.localeAPI.isRTL()).toEqual(true);
  });

  it('can be focusable or not', () => {
    btn.tabIndex = -1;

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(-1);
    expect(btn.button?.getAttribute('tabindex')).toEqual('-1');
    expect(btn.state.tabIndex).toEqual(-1);

    btn.tabIndex = 0;

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(0);
    expect(btn.button?.getAttribute('tabindex')).toEqual('0');
    expect(btn.state.tabIndex).toEqual(0);

    btn.setAttribute('tabindex', '-1');

    expect(btn.hasAttribute('focusable')).toBeFalsy();
    expect(btn.tabIndex).toEqual(-1);
    expect(btn.button?.getAttribute('tabindex')).toEqual('-1');
    expect(btn.state.tabIndex).toEqual(-1);

    btn.setAttribute('tabindex', '0');

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(0);
    expect(btn.button?.getAttribute('tabindex')).toEqual('0');
    expect(btn.state.tabIndex).toEqual(0);

    // Handles incorrect values
    btn.tabIndex = ('fish' as any);

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(0);
    expect(btn.button?.getAttribute('tabindex')).toEqual('0');
    expect(btn.state.tabIndex).toEqual(0);

    btn.tabIndex = -2;

    expect(btn.hasAttribute('tabindex')).toBeFalsy();
    expect(btn.tabIndex).toEqual(0);
    expect(btn.button?.getAttribute('tabindex')).toEqual('0');
    expect(btn.state.tabIndex).toEqual(0);
  });

  it('can add extra CSS classes to the button', () => {
    btn.cssClass = 'one two three';

    expect(btn.getAttribute('css-class')).toBe('one two three');
    expect(btn.cssClass.includes('two')).toBeTruthy();
    expect(btn.button?.classList.contains('one')).toBeTruthy();

    btn.cssClass = ['four', 'five', 'six'];

    expect(btn.getAttribute('css-class')).toBe('four five six');
    expect(btn.cssClass.includes('four')).toBeTruthy();
    expect(btn.button?.classList.contains('four')).toBeTruthy();

    // Setting to empty removes the attribute and the Button element classes
    btn.cssClass = '';

    expect(btn.hasAttribute('css-class')).toBeFalsy();
    expect(btn.cssClass.includes('four')).toBeFalsy();
    expect(btn.button?.classList.contains('four')).toBeFalsy();
  });

  it('can change its appearance', () => {
    btn.appearance = 'primary';

    expect(btn.getAttribute('appearance')).toBe('primary');
    expect(btn.appearance).toBe('primary');
    expect(btn.button?.classList.contains('btn-primary')).toBeTruthy();
    expect(btn.state.appearance).toBe('primary');

    btn.appearance = 'secondary';

    expect(btn.getAttribute('appearance')).toBe('secondary');
    expect(btn.appearance).toBe('secondary');
    expect(btn.button?.classList.contains('btn-secondary')).toBeTruthy();
    expect(btn.state.appearance).toBe('secondary');

    btn.appearance = 'tertiary';

    expect(btn.getAttribute('appearance')).toBe('tertiary');
    expect(btn.appearance).toBe('tertiary');
    expect(btn.button?.classList.contains('btn-tertiary')).toBeTruthy();
    expect(btn.state.appearance).toBe('tertiary');

    // Default buttons don't have additional styles
    btn.appearance = 'default';

    expect(btn.getAttribute('appearance')).toBe(null);
    expect(btn.appearance).toBe('default');
    expect(btn.button?.classList.contains('default')).toBeFalsy();
    expect(btn.state.appearance).toBe('default');
  });

  it('can change its text via attribute', () => {
    expect(btn.text).toEqual('Test Button');
    expect(btn.state.text).toEqual('Test Button');

    btn.text = 'Awesome';

    expect(btn.text).toEqual('Awesome');
    expect(btn.state.text).toEqual('Awesome');

    btn.text = '';

    expect(btn.text).toEqual('');
    expect(btn.state.text).toEqual('');
  });

  it('can add/remove its icon', async () => {
    btn.icon = 'settings';

    expect(btn.getAttribute('icon')).toBe('settings');
    expect(btn.icon).toBe('settings');
    expect(btn.querySelector<IdsIcon>('ids-icon')?.icon).toBe('settings');

    btn.icon = '';

    expect(btn.hasAttribute('icon')).toBeFalsy();
    expect(btn.icon).toBeFalsy();
    expect(btn.querySelector('ids-icon')).toBe(null);
  });

  it('can align its icon differently', () => {
    btn.icon = 'settings';
    btn.iconAlign = 'end';

    expect(btn.button?.classList.contains('align-icon-end')).toBeTruthy();

    btn.iconAlign = 'start';

    expect(btn.button?.classList.contains('align-icon-start')).toBeTruthy();

    btn.iconAlign = undefined;

    expect(btn.button?.classList.contains('align-icon-start')).toBeFalsy();
    expect(btn.button?.classList.contains('align-icon-end')).toBeFalsy();
  });

  it('can be an "icon-only" button', () => {
    btn.icon = 'settings';
    btn.text = '';

    expect(btn.getAttribute('icon')).toBe('settings');
    expect(btn.icon).toBe('settings');
    expect(btn.querySelector<IdsIcon>('ids-icon')?.icon).toBe('settings');
    expect(btn.button?.classList.contains('ids-icon-button')).toBeTruthy();
    expect(btn.button?.classList.contains('ids-button')).toBeFalsy();
  });

  it('can reliably set the "square" attribute', () => {
    btn.icon = 'settings';
    btn.square = true;

    expect(btn.hasAttribute('square')).toEqual(true);
    expect(btn.square).toEqual(true);

    btn.square = false;
    expect(btn.hasAttribute('square')).toEqual(false);
    expect(btn.square).toEqual(false);
  });

  it('can rerender', () => {
    btn.text = 'New';
    btn.icon = 'check';
    btn.disabled = true;
    btn.tabIndex = -1;
    btn.appearance = 'secondary';
    btn.cssClass = ['awesome'];
    btn.iconAlign = 'end';

    expect(btn.text).toEqual('New');
  });

  it('can set width', () => {
    // with pixels
    const pixelWidth = '200px';
    btn.width = pixelWidth;
    expect(btn.width).toEqual(pixelWidth);
    expect(btn.style.width).toEqual('');
    expect(btn.button?.style.width).toEqual(pixelWidth);

    // with percentage
    const percentWidth = '90%';
    btn.width = percentWidth;
    expect(btn.width).toEqual(percentWidth);
    expect(btn.style.width).toEqual(percentWidth);
    expect(btn.button?.style.width).toEqual('');

    // reset
    btn.width = '';
    expect(btn.button?.style.width).toEqual('');
  });

  it('can set hidden', () => {
    expect(btn.hidden).toEqual(false);
    expect(btn.getAttribute('hidden')).toBeFalsy();
    btn.hidden = true;
    expect(btn.getAttribute('hidden')).toEqual('');
    expect(btn.hidden).toEqual(true);
    btn.hidden = false;
    expect(btn.getAttribute('hidden')).toBeFalsy();
    expect(btn.hidden).toEqual(false);
  });

  it('can set noMargins', () => {
    expect(btn.noMargins).toBeFalsy();
    btn.noMargins = true;
    expect(btn.getAttribute('no-margins')).toEqual('');
    expect(btn.noMargins).toEqual(true);
    btn.noMargins = false;
    expect(btn.getAttribute('no-margins')).toBeFalsy();
    expect(btn.noMargins).toEqual(false);
  });

  it('can get the icon element', () => {
    btn.icon = 'add';
    expect(btn.iconEl?.nodeName).toEqual('IDS-ICON');
  });

  it('supports setting color variants', async () => {
    await expectEnumAttributeBehavior({
      elem: btn,
      attribute: 'color-variant',
      values: ['alternate'],
      defaultValue: null
    });
  });

  it('can set a type attribute on its inner button', () => {
    btn.type = 'submit';
    expect(btn.type).toBe('submit');
    expect(btn.getAttribute('type')).toBe('submit');
    expect(btn.container?.getAttribute('type')).toBe('submit');
  });
});
