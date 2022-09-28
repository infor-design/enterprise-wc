/**
 * @jest-environment jsdom
 */
import createFromTemplate from '../helpers/create-from-template';
import IdsActionSheet from '../../src/components/ids-action-sheet/ids-action-sheet';
import testForXssVulnerabilities from '../helpers/xss-helper';

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
  let el: any;

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
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => cb());
    const elem: any = new IdsActionSheet();
    document.body.appendChild(elem);
    el = document.querySelector('ids-action-sheet');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    el = null;
    (window.requestAnimationFrame as any).mockRestore();
  });

  it('renders from HTML Template with no errors', async () => {
    el = await createFromTemplate(el, DEFAULT_ACTIONSHEET_HTML);

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

  it('can set the cancelBtnText attribute', () => {
    expect(el.getAttribute('cancelBtnText')).toBe(null);

    el.cancelBtnText = 'Test';
    el.setAttribute('cancelBtnText', 'Test');
    expect(el.getAttribute('cancelBtnText')).toBe('Test');

    el.cancelBtnText = null;
    el.removeAttribute('cancelBtnText');
    expect(el.getAttribute('cancelBtnText')).toBe(null);

    testForXssVulnerabilities(el, 'cancelBtnText', null);
  });

  it('can be dismissed', () => {
    el.dismiss();
    el.removeAttribute('visible');
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can be dismissed on overlay click', () => {
    const args: any = {
      target: el.overlay,
      bubbles: true,
      cancelable: true,
      view: window
    };
    const event = new MouseEvent('click', args);

    // dismiss
    el.overlay.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can be dismissed on cancelBtn click', () => {
    const args = {
      target: el.cancelBtn,
      bubbles: true,
      cancelable: true,
      view: window
    };
    const event = new MouseEvent('click', args);

    // dismiss
    el.cancelBtn.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can be dismissed on overlay touchstart', () => {
    const args: any = {
      identifier: '123',
      pageX: 0,
      pageY: 0,
      target: el.overlay
    };
    const event = new TouchEvent('touchstart', {
      touches: [args],
      bubbles: true,
      cancelable: true,
      view: window
    });

    // dismiss
    el.overlay.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('can be dismissed on overlay touchstart', () => {
    const args: any = {
      identifier: '123',
      pageX: 0,
      pageY: 0,
      target: el.cancelBtn
    };
    const event = new TouchEvent('touchstart', {
      touches: [args],
      bubbles: true,
      cancelable: true,
      view: window
    });

    // dismiss
    el.cancelBtn.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });

  it('will hide on desktop', () => {
    const args: any = {
      identifier: '123',
      pageX: 0,
      pageY: 0,
      target: el.cancelBtn
    };
    const event = new TouchEvent('touchstart', {
      touches: [args],
      bubbles: true,
      cancelable: true,
      view: window
    });

    // dismiss
    el.cancelBtn.dispatchEvent(event);
    expect(el.getAttribute('visible')).toBe(null);
  });
});
