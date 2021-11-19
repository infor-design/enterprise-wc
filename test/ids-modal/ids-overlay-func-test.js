/**
 * @jest-environment jsdom
 */
import { IdsOverlay } from '../../src/components/ids-modal/ids-modal';

describe('IdsModal Component', () => {
  let overlay;

  beforeEach(async () => {
    const elem = new IdsOverlay();
    document.body.appendChild(elem);
    overlay = document.querySelector('ids-overlay');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsOverlay();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-overlay').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can set opacity', () => {
    overlay.opacity = 1;

    expect(overlay.container.style.opacity).toBe('1');

    overlay.opacity = 0;

    expect(overlay.state.opacity).toBe(0);

    overlay.opacity = -1;

    expect(overlay.state.opacity).toBe(0);

    overlay.opacity = 2;

    expect(overlay.state.opacity).toBe(1);

    overlay.opacity = 'lol';

    expect(overlay.state.opacity).toBe(1);
  });

  it('can set visibility', () => {
    overlay.visible = true;

    expect(overlay.visible).toBeTruthy();
    expect(overlay.container.classList.contains('visible')).toBeTruthy();
  });
});
