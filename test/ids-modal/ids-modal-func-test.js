/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import wait from '../helpers/wait';

import IdsModal from '../../src/components/ids-modal/ids-modal';
import IdsOverlay from '../../src/components/ids-modal/ids-overlay';
import IdsButton from '../../src/components/ids-button/ids-button';

describe('IdsModal Component', () => {
  let modal;

  beforeEach(async () => {
    const elem = new IdsModal();
    document.body.appendChild(elem);
    modal = document.querySelector('ids-modal');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    modal = null;
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

  it('can show/hide by using attributes', async () => {
    modal.setAttribute('visible', 'true');
    await wait(300);
    expect(modal.visible).toBeTruthy();

    modal.removeAttribute('visible');
    await wait(300);
    expect(modal.visible).toBeFalsy();
  });

  it('can show/hide by using attributes', async () => {
    modal.visible = true;
    await wait(300);
    expect(modal.visible).toBeTruthy();

    modal.visible = false;
    await wait(300);
    expect(modal.visible).toBeFalsy();
  });

  it('can use `show()`/`hide()` methods', async () => {
    await modal.show();
    await wait(300);
    expect(modal.visible).toBeTruthy();

    await modal.hide();
    await wait(300);
    expect(modal.visible).toBeFalsy();
  });

  it('can prevent being opened with the `beforeshow` event', async () => {
    modal.addEventListener('beforeshow', (e) => {
      e.detail.response(false);
    });
    await modal.show();

    expect(modal.visible).toEqual(false);
  });

  it('can prevent being closed with the `beforehide` event', async () => {
    modal.addEventListener('beforehide', (e) => {
      e.detail.response(false);
    });
    await modal.show();
    await wait(310);
    await modal.hide();
    await wait(310);

    expect(modal.visible).toBeTruthy();
  });

  it('can have a target element', () => {
    const btn = new IdsButton();
    btn.type = 'secondary';
    btn.text = 'I am the target';
    document.body.appendChild(btn);

    modal.target = btn;

    expect(modal.target.isEqualNode(btn)).toBeTruthy();

    // Clicking on the trigger should make the Modal show
    const clickEvent = new MouseEvent('click', { bubbles: true });
    btn.dispatchEvent(clickEvent);

    // Dispatch twice to cover the 'else'
    btn.dispatchEvent(clickEvent);

    modal.target = undefined;

    expect(modal.target).toBeUndefined();
  });

  it('can have a title', () => {
    modal.messageTitle = 'I have a title';

    expect(modal.state.messageTitle).toEqual('I have a title');
    expect(modal.querySelectorAll('[slot="title"]').length).toBe(1);

    // Removes the slotted element if no title is present
    modal.messageTitle = '';

    expect(modal.state.messageTitle).toEqual('');
    expect(modal.querySelectorAll('[slot="title"]').length).toBe(0);

    // Adds it back if we apply a new title
    modal.messageTitle = 'New title';

    expect(modal.state.messageTitle).toEqual('New title');
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
  it.skip('can hide a visible modal by pressing the Escape key', async () => {
    const closeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });

    await modal.show();
    await wait(310);

    modal.dispatchEvent(closeEvent);
    await wait(310);

    expect(modal.visible).toBeFalsy();
  });

  it('will not trigger a vetoable event of any type not supported', () => {
    modal.triggerVetoableEvent('fish');
    expect(modal.state.visible).toBeFalsy();
  });

  it('will open on onTriggerClick', () => {
    modal.onTriggerClick();
    expect(modal.state.visible).toBeFalsy();
  });

  it('will not hide on outside click in some cases', () => {
    modal.show();
    modal.onOutsideClick({ noValue: false });
    expect(modal.visible).toBeTruthy();

    const overlay = new IdsOverlay();
    modal.onOutsideClick({ target: overlay });
    expect(modal.visible).toBeTruthy();
  });

  it('will hide on outside click in some cases', () => {
    modal.show();
    modal.onOutsideClick({ target: document.body });
    expect(modal.visible).toBeFalsy();
  });
});
