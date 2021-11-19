/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import processAnimFrame from '../helpers/process-anim-frame';
import wait from '../helpers/wait';

import IdsModal, { IdsOverlay } from '../../src/components/ids-modal/ids-modal';
import IdsModalButton from '../../src/components/ids-modal-button/ids-modal-button';
import { IdsButton } from '../../src/components/ids-button/ids-button';

describe('IdsFocusCaptureMixin)', () => {
  let triggerBtn;
  let afterBtn;
  let modal;
  let modalBtnCancel;
  let modalBtnReset;
  let modalBtnOK;

  beforeEach(async () => {
    // Triggers the Modal, sits ahead of the Modal HTML
    triggerBtn = new IdsButton();
    triggerBtn.id = 'my-trigger-button';
    document.body.appendChild(triggerBtn);

    modal = new IdsModal();
    document.body.appendChild(modal);

    modalBtnCancel = new IdsModalButton();
    modalBtnCancel.id = 'modal-btn-cancel';
    modalBtnCancel.cancel = true;
    modalBtnCancel.textContent = 'Cancel';
    modalBtnCancel.type = 'secondary';
    modalBtnCancel.slot = 'buttons';
    modal.appendChild(modalBtnCancel);

    modalBtnReset = new IdsModalButton();
    modalBtnReset.id = 'modal-btn-reset';
    modalBtnReset.cancel = true;
    modalBtnReset.textContent = 'Reset';
    modalBtnReset.type = 'secondary';
    modalBtnReset.slot = 'buttons';
    modal.appendChild(modalBtnReset);

    modalBtnOK = new IdsModalButton();
    modalBtnOK.id = 'modal-btn-ok';
    modalBtnOK.cancel = true;
    modalBtnOK.textContent = 'OK';
    modalBtnOK.type = 'primary';
    modalBtnOK.slot = 'buttons';
    modal.appendChild(modalBtnOK);

    // Standalone Button that sits after the Modal
    afterBtn = new IdsButton();
    afterBtn.id = 'after-btn';
    document.body.appendChild(afterBtn);

    modal.target = triggerBtn;
    modal.trigger = 'click';
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    modal = null;
    triggerBtn = null;
    afterBtn = null;
    modalBtnCancel = null;
    modalBtnReset = null;
    modalBtnOK = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsModal();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-modal').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can disable/enable focus capturing', () => {
    modal.capturesFocus = false;

    expect(modal.getAttribute('captures-focus')).toBeFalsy();

    modal.capturesFocus = true;

    expect(modal.getAttribute('captures-focus')).toBeTruthy();
  });

  it('can disable/enable focus cycling', () => {
    modal.cyclesFocus = false;

    expect(modal.getAttribute('cycles-focus')).toBeFalsy();
    expect(modal.cyclesFocus).toBeFalsy();

    modal.cyclesFocus = true;

    expect(modal.getAttribute('cycles-focus')).toBeTruthy();
    expect(modal.cyclesFocus).toBeTruthy();
  });

  it('can get references to focusable elements', () => {
    const focusable = modal.focusableElements;
    expect(focusable.length).toBe(3);
    expect(focusable[0].isEqualNode(modalBtnCancel)).toBeTruthy();
    expect(modal.firstFocusableElement.isEqualNode(modalBtnCancel)).toBeTruthy();
    expect(modal.lastFocusableElement.isEqualNode(modalBtnOK)).toBeTruthy();
  });

  it('can configure CSS selectors used for focusable element types', () => {
    modal.focusableSelectors = [];
    let focusable = modal.focusableElements;
    expect(focusable.length).toBe(0);

    // Can't set junk values (coverage)
    modal.focusableSelectors = '';
    focusable = modal.focusableElements;
    expect(focusable.length).toBe(0);
  });

  it('can set focus programmatically', async () => {
    await modal.show();
    await wait(310);

    // Do nothing
    modal.setFocus();
    await processAnimFrame();
    expect(document.activeElement.isEqualNode(modalBtnCancel)).toBeTruthy();
    expect(modal.nextFocusableElement).toEqual(modalBtnReset);
    expect(modal.previousFocusableElement).toEqual(modalBtnOK);

    modal.setFocus(1);
    await processAnimFrame();
    expect(document.activeElement.isEqualNode(modalBtnReset)).toBeTruthy();
    expect(modal.nextFocusableElement).toEqual(modalBtnOK);
    expect(modal.previousFocusableElement).toEqual(modalBtnCancel);

    modal.setFocus('first');
    await processAnimFrame();
    expect(document.activeElement.isEqualNode(modalBtnCancel)).toBeTruthy();

    modal.setFocus('last');
    await processAnimFrame();
    expect(document.activeElement.isEqualNode(modalBtnOK)).toBeTruthy();
    expect(modal.nextFocusableElement).toEqual(modalBtnCancel);
    expect(modal.previousFocusableElement).toEqual(modalBtnReset);
  });

  it('can set focus with keyboard events', async () => {
    const tabToNextEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    const tabToPrevEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true });

    await modal.show();
    await wait(310);

    modal.setFocus();
    await processAnimFrame();

    expect(document.activeElement.isEqualNode(modalBtnCancel));

    document.body.dispatchEvent(tabToPrevEvent);

    // Focus should cycle back around to the OK button
    expect(document.activeElement.isEqualNode(modalBtnOK));

    document.body.dispatchEvent(tabToNextEvent);

    // Focus should cycle back around to the Cancel button
    expect(document.activeElement.isEqualNode(modalBtnCancel));

    modal.cyclesFocus = false;
    document.body.dispatchEvent(tabToPrevEvent);

    // Focus should not escape the Modal, and should not cycle
    expect(document.activeElement.isEqualNode(modalBtnCancel));

    modal.capturesFocus = false;
    document.body.dispatchEvent(tabToPrevEvent);

    // Focus should escape the modal and hit the Trigger Button (previous available elem)
    expect(document.activeElement.isEqualNode(modalBtnCancel));

    modalBtnOK.focus();
    document.body.dispatchEvent(tabToNextEvent);

    // Focus should escape the modal and hit the "After" Button (next available elem)
    expect(document.activeElement.isEqualNode(afterBtn));
  });

  it('listens to namespaced keydown events', async () => {
    await modal.show();
    await wait(310);

    modal.setFocus();
    await processAnimFrame();

    expect(document.activeElement.isEqualNode(modalBtnCancel));

    modal.triggerEvent('keydown.focus-capture', document, { key: 'Tab', bubbles: true, shiftKey: true });

    // Focus should cycle back around to the OK button
    expect(document.activeElement.isEqualNode(modalBtnOK));

    modal.triggerEvent('keydown.focus-capture', document, { key: 'Tab', bubbles: true });

    // Focus should cycle back around to the Cancel button
    expect(document.activeElement.isEqualNode(modalBtnCancel));
  });
});

describe('IdsFocusCaptureMixin (empty)', () => {
  let triggerBtn;
  let afterBtn;
  let modal;

  beforeEach(async () => {
    // Triggers the Modal, sits ahead of the Modal HTML
    triggerBtn = new IdsButton();
    triggerBtn.id = 'my-trigger-button';
    document.body.appendChild(triggerBtn);

    modal = new IdsModal();
    document.body.appendChild(modal);

    // Standalone Button that sits after the Modal
    afterBtn = new IdsButton();
    afterBtn.id = 'after-btn';
    document.body.appendChild(afterBtn);

    modal.target = triggerBtn;
    modal.trigger = 'click';
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    modal = null;
    triggerBtn = null;
    afterBtn = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsModal();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-modal').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('sets no focus', async () => {
    await modal.show();
    await wait(310);

    modal.setFocus();
    await processAnimFrame();

    expect(modal.contains(document.activeElement)).toBeFalsy();
    expect(modal.focusableElements).toEqual([]);
    expect(modal.nextFocusableElement).not.toBeDefined();
    expect(modal.previousFocusableElement).not.toBeDefined();
  });
});
