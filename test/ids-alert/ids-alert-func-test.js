/**
 * @jest-environment jsdom
 */
import IdsAlert from '../../src/ids-alert/ids-alert';

describe('IdsAlert Component', () => {
  let el;

  beforeEach(async () => {
    const alert = new IdsAlert();

    alert.type = 'success';
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
    el.type = 'info';
    el.icon = 'info';
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('renders type setting', () => {
    el.type = 'success';
    expect(el.type).toEqual('success');
    expect(el.getAttribute('type')).toEqual('success');
  });
});
