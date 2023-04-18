/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/match-media-mock';
import wait from '../helpers/wait';

import '../../src/components/ids-modal/ids-modal';
import '../../src/components/ids-text/ids-text';
import '../../src/components/ids-modal-button/ids-modal-button';

const modalButtonHTML = `
  <ids-modal-button slot="buttons" appearance="secondary" id="my-message-cancel" cancel>Cancel</ids-modal-button>
  <ids-modal-button slot="buttons" appearance="primary" id="my-message-confirm">Confirm</ids-modal-button>`;

describe('IdsModal Component (with buttons)', () => {
  let modal: any;

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

  it.skip('responds to its normal buttons\' clicks', async () => {
    // Setup a button click handler
    modal.popup.animated = false;
    modal.onButtonClick = () => { modal.hide(); };
    const clickEvent = new MouseEvent('click', { bubbles: true });

    // Show the Modal
    await modal.show();
    await wait(400);

    // Click the first Modal button. The above handler should fire.
    modal.buttons[1].dispatchEvent(clickEvent);
    await wait(400);

    expect(modal.visible).toBeFalsy();
  });

  it.skip('responds to its cancel buttons\' clicks', async () => {
    // Setup a button click handler
    modal.popup.animated = false;
    // modal.onButtonClick = () => { modal.hide(); };
    const clickEvent = new MouseEvent('click', { bubbles: true });

    // Show the Modal
    await modal.show();
    await wait(400);

    // Click the first Modal button. The above handler should fire.
    modal.buttons[0].dispatchEvent(clickEvent);
    await wait(400);

    expect(modal.visible).toBeFalsy();
  });
});
