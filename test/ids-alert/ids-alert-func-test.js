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

  it('renders icon setting then removes it', () => {
    el = new IdsAlert();
    document.body.appendChild(el);
    el.icon = 'new';
    expect(el.icon).toEqual('new');
    el.icon = null;
    expect(el.icon).toEqual(null);
  });
});
