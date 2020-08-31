/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/ids-tag/ids-tag';

describe('IdsTag Component', () => {
  let tag;

  beforeEach(async () => {
    const elem = new IdsTag();
    document.body.appendChild(elem);
    tag = document.querySelector('ids-tag');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsTag();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-tag').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(tag.outerHTML).toMatchSnapshot();
    tag.dismissible = true;
    expect(tag.outerHTML).toMatchSnapshot();

    tag.dismissible = false;
    tag.color = 'error';
    expect(tag.outerHTML).toMatchSnapshot();
  });

  it('renders success color from an attribute', () => {
    tag.setAttribute('color', 'success');
    expect(tag.getAttribute('color')).toEqual('success');
    expect(tag.color).toEqual('success');
  });

  it('renders success color from the api', () => {
    tag.color = 'success';
    expect(tag.getAttribute('color')).toEqual('success');
    expect(tag.color).toEqual('success');
  });

  it('renders error from the api', () => {
    tag.color = 'error';
    expect(tag.getAttribute('color')).toEqual('error');
    expect(tag.color).toEqual('error');
  });

  it('renders danger from the api', () => {
    tag.color = 'danger';
    expect(tag.getAttribute('color')).toEqual('danger');
    expect(tag.color).toEqual('danger');
  });

  it('renders specific hex color', () => {
    tag.color = '#800000';
    expect(tag.getAttribute('color')).toEqual('#800000');
    expect(tag.color).toEqual('#800000');
  });

  it('renders an extra border on secondary tags', () => {
    tag.color = 'secondary';
    expect(tag.getAttribute('color')).toEqual('secondary');
    expect(tag.color).toEqual('secondary');
  });

  it('removes the color attribute when reset', () => {
    tag.color = 'secondary';
    expect(tag.getAttribute('color')).toEqual('secondary');
    expect(tag.color).toEqual('secondary');

    tag.removeAttribute('color');
    expect(tag.getAttribute('color')).toEqual(null);
    expect(tag.color).toEqual(null);
  });

  it('removes the dismissible attribute when reset', () => {
    tag.dismissible = true;
    expect(tag.getAttribute('dismissible')).toEqual('true');
    expect(tag.dismissible).toEqual('true');

    tag.dismissible = false;
    expect(tag.getAttribute('dismissible')).toEqual(null);
    expect(tag.dismissible).toEqual(null);
  });

  it('dismisses on click', () => {
    tag.dismissible = true;
    tag.querySelector('ids-icon[icon="close"]').click();
    expect(document.querySelectorAll('ids-tag').length).toEqual(0);
  });

  it('fires beforetagremoved on dismiss', () => {
    tag.dismissible = true;
    tag.addEventListener('beforetagremoved', (e) => {
      e.detail.response(false);
    });
    tag.dismiss();

    expect(document.body.contains(tag)).toEqual(true);
  });

  it('fires aftertagremoved and tagremoved on dismiss', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    tag.dismissible = true;
    tag.addEventListener('tagremoved', mockCallback);
    tag.addEventListener('aftertagremoved', mockCallback);
    tag.dismiss();

    expect(mockCallback.mock.calls.length).toBe(2);
    expect(document.body.contains(tag)).toEqual(false);
  });

  it('should cancel dismiss when not dismissible', () => {
    tag.dismiss();
    expect(document.body.contains(tag)).toEqual(true);
  });

  it('should handle slot change when dismissible', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    tag.dismissible = true;
    const icon = tag.querySelector('ids-icon[icon="close"]');
    const span = document.createElement('span');
    span.innerHTML = 'test';
    tag.insertBefore(span, icon);
    tag.insertBefore(icon, span);

    tag.addEventListener('slotchange', mockCallback);
  });
});
