/**
 * @jest-environment jsdom
 */
import IdsProgressBar from '../../src/ids-progress-bar/ids-progress-bar';

describe('IdsProgressBar Component', () => {
  let el;

  beforeEach(async () => {
    const elem = new IdsProgressBar();
    document.body.appendChild(elem);
    el = document.querySelector('ids-progress-bar');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsProgressBar();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-progress-bar').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should set value', () => {
    expect(el.value).toEqual('0');
    el.value = 60;
    expect(el.value).toEqual('60');
    const bar = el.shadowRoot.querySelector('.progress-bar');
    bar.remove();
    el.updateValue();
    el.value = null;
    expect(el.value).toEqual('0');
  });

  it('should renders as disabled', () => {
    expect(el.getAttribute('disabled')).toEqual(null);
    let rootEl = el.shadowRoot.querySelector('.ids-progress-bar');
    expect(rootEl.classList).not.toContain('disabled');
    el.disabled = true;
    expect(el.getAttribute('disabled')).toEqual('true');
    rootEl = el.shadowRoot.querySelector('.ids-progress-bar');
    expect(rootEl.classList).toContain('disabled');
    el.disabled = false;
    expect(el.getAttribute('disabled')).toEqual(null);
    rootEl = el.shadowRoot.querySelector('.ids-progress-bar');
    expect(rootEl.classList).not.toContain('disabled');
  });

  it('should set label text', () => {
    let labelText = el.shadowRoot.querySelector('.progress-label ids-text');
    expect(labelText.innerHTML.trim()).toBe('');
    el.label = 'test';
    labelText = el.shadowRoot.querySelector('.progress-label ids-text');
    expect(labelText.innerHTML.trim()).toBe('test');
    el.label = null;
    labelText = el.shadowRoot.querySelector('.progress-label ids-text');
    expect(labelText.innerHTML.trim()).toBe('');
    labelText.remove();
    el.label = 'test2';
    expect(labelText.innerHTML.trim()).toBe('');
  });

  it('should set label text as audible', () => {
    let labelText = el.shadowRoot.querySelector('.progress-label ids-text');
    let rootEl = el.shadowRoot.querySelector('.ids-progress-bar');
    expect(el.getAttribute('label-audible')).toEqual(null);
    expect(labelText.getAttribute('audible')).toEqual(null);
    expect(rootEl.classList).not.toContain('label-audible');
    el.labelAudible = true;
    labelText = el.shadowRoot.querySelector('.progress-label ids-text');
    rootEl = el.shadowRoot.querySelector('.ids-progress-bar');
    expect(el.getAttribute('label-audible')).toEqual('true');
    expect(labelText.getAttribute('audible')).toEqual('true');
    expect(rootEl.classList).toContain('label-audible');
    el.labelAudible = false;
    labelText = el.shadowRoot.querySelector('.progress-label ids-text');
    rootEl = el.shadowRoot.querySelector('.ids-progress-bar');
    expect(el.getAttribute('label-audible')).toEqual(null);
    expect(labelText.getAttribute('audible')).toEqual(null);
    expect(rootEl.classList).not.toContain('label-audible');
  });

  it('should set max value', () => {
    expect(el.getAttribute('max')).toEqual(null);
    expect(el.max).toEqual('100');
    el.max = 60;
    expect(el.getAttribute('max')).toEqual('60');
    expect(el.max).toEqual('60');
    el.max = null;
    expect(el.getAttribute('max')).toEqual('100');
    expect(el.max).toEqual('100');
  });

  it('should renders template', () => {
    document.body.innerHTML = '';
    el = document.createElement('ids-progress-bar');
    el.setAttribute('disabled', 'true');
    el.setAttribute('label-audible', 'true');
    el.setAttribute('label', 'test');
    el.setAttribute('max', '50');
    el.setAttribute('value', '10');
    el.template();
    const labelText = el.shadowRoot.querySelector('.progress-label ids-text');
    const rootEl = el.shadowRoot.querySelector('.ids-progress-bar');
    expect(el.disabled).toEqual('true');
    expect(rootEl.classList).toContain('disabled');
    expect(el.labelAudible).toEqual('true');
    expect(labelText.getAttribute('audible')).toEqual('true');
    expect(rootEl.classList).toContain('label-audible');
    expect(el.label).toEqual('test');
    expect(labelText.textContent).toEqual('test');
    expect(el.max).toEqual('50');
    expect(el.value).toEqual('10');
  });
});
