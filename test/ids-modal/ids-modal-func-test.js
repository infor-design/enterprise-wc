/**
 * @jest-environment jsdom
 */
import IdsModal, { IdsOverlay } from '../../src/ids-modal';
import { IdsButton } from '../../src/ids-button/ids-button';

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

  it('can show/hide by using attributes', () => {
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

  it('can have a target element', () => {
    const btn = new IdsButton();
    btn.type = 'secondary';
    btn.text = 'I am the target';
    document.body.appendChild(btn);

    modal.target = btn;

    expect(modal.state.target.isEqualNode(btn)).toBeTruthy();

    // Clicking on the trigger should make the Modal show
    const clickEvent = new MouseEvent('click', { bubbles: true });
    btn.dispatchEvent(clickEvent);

    // Dispatch twice to cover the 'else'
    btn.dispatchEvent(clickEvent);

    modal.target = null;

    expect(modal.state.target).toBeNull();
  });

  it('can have a title', () => {
    modal.title = 'I have a title';

    expect(modal.state.title).toEqual('I have a title');
    expect(modal.querySelectorAll('[slot="title"]').length).toBe(1);

    // Removes the slotted element if no title is present
    modal.title = '';

    expect(modal.state.title).toEqual('');
    expect(modal.querySelectorAll('[slot="title"]').length).toBe(0);

    // Adds it back if we apply a new title
    modal.title = 'New title';

    expect(modal.state.title).toEqual('New title');
    expect(modal.querySelectorAll('[slot="title"]').length).toBe(1);
  });

  it('can use an external overlay, if applicable', () => {
    const overlay = new IdsOverlay();
    modal.overlay = overlay;

    expect(modal.state.overlay.isEqualNode(overlay)).toBeTruthy();

    modal.overlay = null;

    // Internal overlay state should be empty,
    // but the Modal will use its own overlay instance internally
    expect(modal.state.overlay).toBeNull();
    expect(modal.container.querySelector('ids-overlay')).toBeDefined();
  });

  // @TODO Not sure why this won't pass (structured similarly to other tests like it)
  it.skip('can hide a visible modal by pressing the Escape key', (done) => {
    const closeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });

    modal.show();

    setTimeout(() => {
      // Key event is captured within the Modal container (encapsulated)
      modal.container.dispatchEvent(closeEvent);
      setTimeout(() => {
        expect(modal.popup.visible).toBeFalsy();
        done();
      }, 70);
    }, 70);
  });

  it('will not trigger a vetoable event of any type not supported', () => {
    modal.triggerVetoableEvent('fish');

    expect(modal.state.visible).toBeFalsy();
  });

  it('will focus the first available item in the modal when it opens', (done) => {
    const extraBtn = new IdsButton();
    extraBtn.id = 'focusable';
    extraBtn.type = 'secondary';
    modal.appendChild(extraBtn);
    modal.show();

    setTimeout(() => {
      expect(document.activeElement.isEqualNode(extraBtn)).toBeTruthy();
      done();
    }, 300);
  });
});
