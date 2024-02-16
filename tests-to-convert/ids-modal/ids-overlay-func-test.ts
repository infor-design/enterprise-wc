/**
 * @jest-environment jsdom
 */
import IdsOverlay from '../../src/components/ids-modal/ids-overlay';

describe('IdsModal Component', () => {
  let overlay: any;

  beforeEach(async () => {
    const elem: any = new IdsOverlay();
    document.body.appendChild(elem);
    overlay = document.querySelector('ids-overlay');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('can set opacity', () => {
    overlay.visible = true;
    overlay.opacity = 1;

    expect(overlay.state.opacity).toBe(1);

    overlay.opacity = 0;

    expect(overlay.state.opacity).toBe(0);

    overlay.opacity = -1;

    expect(overlay.state.opacity).toBe(0);

    overlay.opacity = 2;

    expect(overlay.state.opacity).toBe(1);

    overlay.opacity = 'lol';

    expect(overlay.state.opacity).toBe(1);
  });

  test('can set visibility', () => {
    overlay.visible = true;

    expect(overlay.visible).toBeTruthy();
    expect(overlay.container.classList.contains('visible')).toBeTruthy();
  });
});
