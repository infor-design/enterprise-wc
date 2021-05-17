/**
 * @jest-environment jsdom
 */
import IdsModal from '../../src/ids-modal';

describe('IdsModal Component', () => {
  let modal;

  beforeEach(async () => {
    const elem = new IdsModal();
    document.body.appendChild(elem);
    modal = document.querySelector('ids-modal');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsModal();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-modal').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(modal.outerHTML).toMatchSnapshot();
    modal.show();
    expect(modal.outerHTML).toMatchSnapshot();

    modal.hide();
    expect(modal.outerHTML).toMatchSnapshot();
  });

  it('can show/hide by using attributes', () => {
    modal.setAttribute('visible', 'true');

    expect(modal.visible).toBeTruthy();

    modal.removeAttribute('visible');

    expect(modal.visible).toBeFalsy();
  });

  it('can show/hide by using props', () => {
    modal.visible = true;

    expect(modal.visible).toBeTruthy();

    modal.visible = false;

    expect(modal.visible).toBeFalsy();
  });

  it('can use `show()`/`hide()` methods', () => {
    modal.show();

    expect(modal.visible).toBeTruthy();

    modal.hide();

    expect(modal.visible).toBeFalsy();
  });

  it('can prevent being opened with the `beforeshow` event', () => {
    modal.addEventListener('beforeshow', (e) => {
      e.detail.response(false);
    });
    modal.show();

    expect(modal.visible).toBeFalsy();
  });

  it('can prevent being closed with the `beforehide` event', (done) => {
    modal.addEventListener('beforehide', (e) => {
      e.detail.response(false);
    });
    modal.show();

    setTimeout(() => {
      modal.hide();

      setTimeout(() => {
        expect(modal.visible).toBeTruthy();
        done();
      }, 70);
    }, 70);
  });
});
