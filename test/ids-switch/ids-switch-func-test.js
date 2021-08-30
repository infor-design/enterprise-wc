/**
 * @jest-environment jsdom
 */
import IdsSwitch from '../../src/components/ids-switch/ids-switch';
import IdsContainer from '../../src/components/ids-container';

describe('IdsSwitch Component', () => {
  let el;
  let container;

  beforeEach(async () => {
    container = new IdsContainer();
    const elem = new IdsSwitch();
    container.appendChild(elem);
    document.body.appendChild(container);
    el = document.querySelector('ids-switch');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsSwitch();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-switch').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should renders checked', () => {
    el.checked = 'true';
    expect(el.getAttribute('checked')).toEqual('true');
    expect(el.checked).toEqual('true');
  });

  it('should renders as disabled', () => {
    expect(el.getAttribute('disabled')).toEqual(null);
    expect(el.input.hasAttribute('disabled')).toBe(false);
    let rootEl = el.shadowRoot.querySelector('.ids-switch');
    expect(rootEl.classList).not.toContain('disabled');
    el.disabled = true;
    expect(el.getAttribute('disabled')).toEqual('true');
    expect(el.input.hasAttribute('disabled')).toBe(true);
    rootEl = el.shadowRoot.querySelector('.ids-switch');
    expect(rootEl.classList).toContain('disabled');
    el.disabled = false;
    expect(el.getAttribute('disabled')).toEqual(null);
    expect(el.input.hasAttribute('disabled')).toBe(false);
    rootEl = el.shadowRoot.querySelector('.ids-switch');
    expect(rootEl.classList).not.toContain('disabled');
  });

  it('should set label text', () => {
    let label = el.labelEl.querySelector('.label-text');
    label.remove();
    el.label = 'test';

    document.body.innerHTML = '';
    const elem = new IdsSwitch();
    document.body.appendChild(elem);
    el = document.querySelector('ids-switch');
    label = el.labelEl.querySelector('.label-text');
    expect(label.textContent.trim()).toBe('');
    el.label = 'test';
    label = el.labelEl.querySelector('.label-text');
    expect(label.textContent.trim()).toBe('test');
    el.label = null;
    label = el.labelEl.querySelector('.label-text');
    expect(label.textContent.trim()).toBe('');
  });

  it('should renders value', () => {
    const value = 'test';
    expect(el.getAttribute('value')).toEqual(null);
    el.value = value;
    expect(el.getAttribute('value')).toEqual(value);
    expect(el.input.value).toEqual(value);
    el.value = null;
    expect(el.getAttribute('value')).toEqual(null);
  });

  it('should dispatch native events', () => {
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      el.addEventListener(evt, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      el.input.dispatchEvent(event);
      expect(response).toEqual('triggered');
    });
  });

  it('should remove events', () => {
    el.input = null;
    document.body.innerHTML = '';
    const elem = new IdsSwitch();
    document.body.appendChild(elem);
    el = document.querySelector('ids-switch');

    el.handleNativeEvents('remove');
    const events = ['change', 'focus', 'keydown', 'keypress', 'keyup', 'click', 'dbclick'];
    events.forEach((evt) => {
      let response = null;
      el.addEventListener(evt, () => {
        response = 'triggered';
      });
      const event = new Event(evt);
      el.input.dispatchEvent(event);
      expect(response).not.toEqual('triggered');
    });
  });

  it('should renders template', () => {
    document.body.innerHTML = '';
    el = document.createElement('ids-switch');
    el.setAttribute('disabled', true);
    el.setAttribute('checked', true);
    el.template();
    expect(el.getAttribute('disabled')).toEqual('true');
    expect(el.input.hasAttribute('disabled')).toBe(true);
    const rootEl = el.shadowRoot.querySelector('.ids-switch');
    expect(rootEl.classList).toContain('disabled');
    expect(el.getAttribute('checked')).toEqual('true');
    expect(el.checked).toEqual('true');
  });

  it('can change language from the container', async () => {
    container.language = 'de';
    setTimeout(() => {
      expect(el.getAttribute('language')).toEqual('de');
    });
  });
});
