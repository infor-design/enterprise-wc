/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import wait from '../helpers/wait';

import IdsModal, { IdsOverlay } from '../../src/components/ids-modal/ids-modal';
import IdsText from '../../src/components/ids-text/ids-text';
import { IdsModalButton } from '../../src/components/ids-modal-button/ids-modal-button';

const modalButtonHTML = `
  <ids-modal-button slot="buttons" type="secondary" id="my-message-cancel" cancel>Cancel</ids-modal-button>
  <ids-modal-button slot="buttons" type="primary" id="my-message-confirm">Confirm</ids-modal-button>`;

describe('IdsModal Component (with buttons)', () => {
  let modal;

  beforeEach(async () => {
    modal = document.createElement('ids-modal');
    modal.id = 'test-modal';
    modal.insertAdjacentHTML('afterbegin', `<ids-text>This Modal has Buttons</ids-text>`);
    modal.insertAdjacentHTML('beforeend', modalButtonHTML);

    document.body.appendChild(modal);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    modal = null;
  });

  it('has buttons', () => {
    expect(modal.buttons.length).toBe(2);
  });

  it('shows with buttons present', async () => {
    await modal.show();
    await wait(70);

    expect(modal.visible).toBeTruthy();
  });

  it('can set/change the cancel attribute', async () => {
    modal.buttons[0].cancel = true;
    expect(modal.buttons[0].getAttribute('cancel')).toBeTruthy();

    modal.buttons[0].cancel = false;
    expect(modal.buttons[0].getAttribute('cancel')).toBeFalsy();
  });

  it('responds to its normal buttons\' clicks', async () => {
    // Setup a button click handler
    modal.popup.animated = false;
    modal.onButtonClick = () => { modal.hide(); };
    const clickEvent = new MouseEvent('click', { bubbles: true });

    // Show the Modal
    await modal.show();
    await wait(310);

    // Click the first Modal button. The above handler should fire.
    modal.buttons[1].dispatchEvent(clickEvent);
    await wait(310);

    expect(modal.visible).toBeFalsy();
  });

  it('responds to its cancel buttons\' clicks', async () => {
    // Setup a button click handler
    modal.popup.animated = false;
    // modal.onButtonClick = () => { modal.hide(); };
    const clickEvent = new MouseEvent('click', { bubbles: true });

    // Show the Modal
    await modal.show();
    await wait(310);

    // Click the first Modal button. The above handler should fire.
    modal.buttons[0].dispatchEvent(clickEvent);
    await wait(310);

    expect(modal.visible).toBeFalsy();
  });
});
