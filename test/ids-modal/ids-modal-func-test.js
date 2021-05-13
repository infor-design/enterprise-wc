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

    expect(modal.getAttribute('visible')).toEqual('true');
    expect(modal.container.classList.contains('visible')).toBeTruthy();

    modal.removeAttribute('visible');

    expect(modal.getAttribute('visible')).toBeFalsy();
    expect(modal.container.classList.contains('visible')).toBeFalsy();
  });
});
