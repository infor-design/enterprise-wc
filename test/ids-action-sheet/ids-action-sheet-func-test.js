/**
 * @jest-environment jsdom
 */
import processAnimFrame from '../helpers/process-anim-frame';
import IdsActionSheet from '../../src/components/ids-action-sheet';
import IdsContainer from '../../src/components/ids-container';

const DEFAULT_ACTIONSHEET_HTML = (
  `<ids-action-sheet btn-text="Override Text" visible="true" hidden>
    <ids-menu>
      <ids-menu-group>
        <ids-menu-item icon="mail" text-align="center">Option One</ids-menu-item>
        <ids-menu-item icon="filter" text-align="center">Option Two</ids-menu-item>
        <ids-menu-item icon="profile" text-align="center">Option Three</ids-menu-item>
      </ids-menu-group>
    </ids-menu>
  </ids-action-sheet>`
);

describe('IdsActionSheet Component', () => {
  let el;
  let container;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    });
  });

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    const elem = new IdsActionSheet();
    document.body.appendChild(elem);
    el = document.querySelector('ids-action-sheet');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    el = null;
    window.requestAnimationFrame.mockRestore();
  });

  const createElemViaTemplate = async (innerHTML) => {
    el?.remove?.();
    container = new IdsContainer();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    el = template.content.childNodes[0];
    container.appendChild(el);
    document.body.appendChild(container);

    await processAnimFrame();

    return el;
  };

  it('renders from HTML Template with no errors', async () => {
    el = await createElemViaTemplate(DEFAULT_ACTIONSHEET_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-action-sheet').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(el.outerHTML).toMatchSnapshot();
  });

  it('can set the visible attribute', () => {
    expect(el.getAttribute('visible')).toBe(null);

    el.setAttribute('visible', true);
    expect(el.getAttribute('visible')).toBe('true');

    el.visible = null;
    el.removeAttribute('visible');
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can set the btnText attribute', () => {
    expect(el.getAttribute('btnText')).toBe(null);

    el.btnText = 'Test';
    el.setAttribute('btnText', 'Test');
    expect(el.getAttribute('btnText')).toBe('Test');

    el.btnText = null;
    el.removeAttribute('btnText');
    expect(el.getAttribute('btnText')).toBe(null);
  });

  it('can be dismissed', () => {
    el.dismiss();
    el.removeAttribute('visible');
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can be dismissed on overlay click', () => {
    const event = new MouseEvent('click', {
      target: el.overlay,
      bubbles: true,
      cancelable: true,
      view: window
    });

    // dismiss
    el.overlay.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can be dismissed on cancelBtn click', () => {
    const event = new MouseEvent('click', {
      target: el.cancelBtn,
      bubbles: true,
      cancelable: true,
      view: window
    });

    // dismiss
    el.cancelBtn.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can be dismissed on overlay touchstart', () => {
    const event = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: el.overlay
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });

    // dismiss
    el.overlay.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can be dismissed on overlay touchstart', () => {
    const event = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: el.cancelBtn
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });

    // dismiss
    el.cancelBtn.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });
});
