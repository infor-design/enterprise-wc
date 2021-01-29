/**
 * @jest-environment jsdom
 */
import IdsAlert from '../../src/ids-alert/ids-alert';

describe('IdsAlert Component', () => {
  let el;

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
  });

  it('renders icon setting', () => {
    el.icon = 'success';
    expect(el.icon).toEqual('success');
    expect(el.getAttribute('icon')).toEqual('success');
  });

  it('renders icon info then removes it', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.icon = 'info';
    expect(el.icon).toEqual('info');
    el.icon = null;
    expect(el.icon).toEqual(null);
  });

  it('renders icon success then removes it', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.icon = 'success';
    expect(el.icon).toEqual('success');
    el.icon = null;
    expect(el.icon).toEqual(null);
  });

  it('renders icon info-field then removes it', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.icon = 'info-field';
    expect(el.icon).toEqual('info-field');
    el.icon = null;
    expect(el.icon).toEqual(null);
  });
});
