/**
 * @jest-environment jsdom
 */
import IdsSwitch from '../../src/components/ids-switch/ids-switch';
import IdsContainer from '../../src/components/ids-container/ids-container';
import deMessages from '../../src/components/ids-locale/data/de-messages.json';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsSwitch Component', () => {
  let el: IdsSwitch;
  let container: IdsContainer;

  beforeEach(() => {
    container = new IdsContainer();
    IdsGlobal.getLocale().loadedLanguages.set('de', deMessages);

    el = new IdsSwitch();
    container.appendChild(el);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should renders checked', () => {
    el.checked = 'true';
    expect(el.getAttribute('checked')).toEqual('true');
  });

  test('should renders as disabled', () => {
    expect(el.getAttribute('disabled')).toEqual(null);
    expect(el.input?.hasAttribute('disabled')).toBe(false);
    let rootEl = el.shadowRoot?.querySelector('.ids-switch');
    expect(rootEl?.classList).not.toContain('disabled');
    el.disabled = true;
    expect(el.getAttribute('disabled')).toEqual('true');
    expect(el.input?.hasAttribute('disabled')).toBe(true);
    rootEl = el.shadowRoot?.querySelector('.ids-switch');
    expect(rootEl?.classList).toContain('disabled');
    el.disabled = false;
    expect(el.getAttribute('disabled')).toEqual(null);
    expect(el.input?.hasAttribute('disabled')).toBe(false);
    rootEl = el.shadowRoot?.querySelector('.ids-switch');
    expect(rootEl?.classList).not.toContain('disabled');
  });

  test('should set label text', () => {
    let label = el.labelEl?.querySelector('.label-text');
    label?.remove();
    el.label = 'test';

    document.body.innerHTML = '';
    const elem: any = new IdsSwitch();
    document.body.appendChild(elem);
    el = document.querySelector('ids-switch') as IdsSwitch;
    label = el.labelEl?.querySelector('.label-text');
    expect(label?.textContent?.trim()).toBe('');
    el.label = 'test';
    label = el.labelEl?.querySelector('.label-text');
    expect(label?.textContent?.trim()).toBe('test');
    el.label = null;
    label = el.labelEl?.querySelector('.label-text');
    expect(label?.textContent?.trim()).toBe('');
  });

  test('should renders value', () => {
    const value = 'test';
    expect(el.getAttribute('value')).toEqual(null);
    el.value = value;
    expect(el.getAttribute('value')).toEqual(value);
    expect(el.input?.value).toEqual(value);
    el.value = '';
    expect(el.getAttribute('value')).toEqual('');
  });

  test('should dispatch native events', () => {
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt: string) => {
      let response = null;
      el.addEventListener(evt, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      el.input?.dispatchEvent(event);
      expect(response).toEqual('triggered');
    });
  });

  test('should remove events', () => {
    document.body.innerHTML = '';
    const elem: any = new IdsSwitch();
    document.body.appendChild(elem);
    el = document.querySelector('ids-switch') as IdsSwitch;

    el.attachNativeEvents('remove');
    const events = ['focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      el.addEventListener(evt, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      el.input?.dispatchEvent(event);
      expect(response).not.toEqual('triggered');
    });
  });

  test('should render template', async () => {
    document.body.innerHTML = '';
    el = document.createElement('ids-switch') as IdsSwitch;
    el.setAttribute('disabled', 'true');
    el.setAttribute('checked', 'true');
    document.body.appendChild(el);

    // wait for ids element to fire #updateAttributes() rAF

    expect(el.getAttribute('disabled')).toEqual('true');
    expect(el.input?.hasAttribute('disabled')).toBe(true);
    const rootEl = el.shadowRoot?.querySelector('.ids-switch');
    expect(rootEl?.classList).toContain('disabled');
    expect(el.getAttribute('checked')).toEqual('true');
    expect(el.checked).toEqual(true);
  });

  test('can change language from the container', async () => {
    await container.localeAPI.setLanguage('de');
    expect(el.getAttribute('language')).toEqual('de');
  });

  test('can focus its inner Input element', () => {
    el.focus();
    expect(document.activeElement).toEqual(el);
  });
});
