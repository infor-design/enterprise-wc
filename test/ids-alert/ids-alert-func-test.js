/**
 * @jest-environment jsdom
 */
import IdsAlert from '../../src/components/ids-alert/ids-alert';

describe('IdsAlert Component', () => {
  let el;
  let rootEl;

  beforeEach(async () => {
    const alert = new IdsAlert();

    alert.icon = 'success';
    document.body.appendChild(alert);
    el = document.querySelector('ids-alert');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    el.remove();
    el = new IdsAlert();
    document.body.appendChild(el);
    expect(document.querySelectorAll('ids-alert').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(el.outerHTML).toMatchSnapshot();
    el.icon = 'info';
    expect(el.outerHTML).toMatchSnapshot();
    el.icon = 'new';
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('renders icon setting', () => {
    el.icon = 'success';
    expect(el.icon).toEqual('success');
    expect(el.getAttribute('icon')).toEqual('success');
    el.icon = 'info';
    expect(el.icon).toEqual('info');
    expect(el.getAttribute('icon')).toEqual('info');
  });

  it('renders icon info then removes it', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.icon = 'info';
    expect(el.icon).toEqual('info');
    rootEl = el.shadowRoot.querySelector('ids-icon');
    expect(rootEl.icon).toBe('info');
    el.icon = null;
    expect(el.icon).toEqual(null);
  });

  it('renders icon success then removes it', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.icon = 'success';
    expect(el.icon).toEqual('success');
    rootEl = el.shadowRoot.querySelector('ids-icon');
    expect(rootEl.icon).toBe('success');
    el.icon = null;
    expect(el.icon).toEqual(null);
  });

  it('renders icon info-field then removes it', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.icon = 'info-field';
    expect(el.icon).toEqual('info-field');
    rootEl = el.shadowRoot.querySelector('ids-icon');
    expect(rootEl.icon).toBe('info-field');
    el.icon = null;
    expect(el.icon).toEqual(null);
  });

  it('should disable and enable', () => {
    el.disabled = 'true';
    el.template();
    document.body.innerHTML = '';
    const alert = new IdsAlert();
    alert.icon = 'success';
    document.body.appendChild(alert);
    el = document.querySelector('ids-alert');
    let icon = el.shadowRoot.querySelector('ids-icon');
    expect(el.getAttribute('disabled')).toEqual(null);
    expect(icon.classList).not.toContain('disabled');
    el.disabled = 'true';
    icon = el.shadowRoot.querySelector('ids-icon');
    expect(el.getAttribute('disabled')).toEqual('true');
    expect(icon.classList).toContain('disabled');
    el.disabled = 'false';
    icon = el.shadowRoot.querySelector('ids-icon');
    expect(el.getAttribute('disabled')).toEqual(null);
    expect(icon.classList).not.toContain('disabled');
  });

  it('supports setting mode', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.mode = 'dark';
    expect(el.container.getAttribute('mode')).toEqual('dark');
  });

  it('supports setting version', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.version = 'classic';
    expect(el.container.getAttribute('version')).toEqual('classic');
  });
});
