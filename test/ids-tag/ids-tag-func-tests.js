/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/ids-tag/ids-tag';

/** Test Suite */
describe('IdsTag Tests', () => {
  let tag;
  beforeEach(async () => {
    const elem = new IdsTag();
    document.body.appendChild(elem);
    tag = document.querySelector('.ids-tag');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('renders with no errors', () => {
    expect(document.querySelectorAll('.ids-tag').length).toEqual(1);
  });

  test('renders success color from attribute', () => {
    tag.setAttribute('color', 'success');
    expect(tag.getAttribute('color')).toEqual('success');
    expect(tag.color).toEqual('success');
  });

  test('renders success color from api', () => {
    tag.color = 'success';
    expect(tag.getAttribute('color')).toEqual('success');
    expect(tag.color).toEqual('success');
  });

  test('renders extra border on secondary tags', () => {
    tag.color = 'secondary';
    expect(tag.getAttribute('color')).toEqual('secondary');
    expect(tag.color).toEqual('secondary');
  });

  test.skip('removes attribute on clearing', () => {
    tag.color = 'secondary';
    expect(tag.getAttribute('color')).toEqual('secondary');
    expect(tag.color).toEqual('secondary');

    tag.removeAttribute('color');
    expect(tag.getAttribute('color')).toEqual(null);
    expect(tag.color).toEqual(null);
  });

  test.only('fires beforetagremoved on dismiss', () => {
    tag.dismissible = true;
    tag.addEventListener('beforetagremoved', (e) => {
      e.detail.response(false);
    });
    tag.dismiss();

    expect(document.body.contains(tag)).toEqual(true);
  });

  test.only('fires aftertagremoved and tagremoved on dismiss', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    tag.dismissible = true;
    tag.addEventListener('beforetagremoved', mockCallback);
    tag.addEventListener('aftertagremoved', mockCallback);
    tag.dismiss();

    expect(mockCallback.mock.calls.length).toBe(2);
    expect(document.body.contains(tag)).toEqual(false);
  });
});
