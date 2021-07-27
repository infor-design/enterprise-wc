/**
 * @jest-environment jsdom
 */
import IdsModal, { IdsOverlay } from '../../src/ids-modal';
import IdsText from '../../src/ids-text/ids-text';
import { IdsModalButton } from '../../src/ids-modal-button';

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

  it('shows with buttons present', (done) => {
    modal.show();

    setTimeout(() => {
      expect(modal.visible).toBeTruthy();
      done();
    }, 70);
  });

  it('responds to its normal buttons\' clicks', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    modal.show();

    setTimeout(() => {
      // Setup a button click handler
      modal.onButtonClick = (buttonEl) => {
        expect(buttonEl.isEqualNode(modal.buttons[1])).toBeTruthy();
        done();
      };

      // Click the first Modal button. The above handler should fire.
      modal.buttons[1].dispatchEvent(clickEvent);
    }, 70);
  });

  it('responds to its cancel buttons\' clicks', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    modal.show();

    setTimeout(() => {
      // Setup a button click handler
      modal.onButtonClick = (buttonEl) => {
        expect(buttonEl.isEqualNode(modal.buttons[0])).toBeTruthy();
        done();
      };

      // Click the first Modal button. The above handler should fire.
      modal.buttons[0].dispatchEvent(clickEvent);
    }, 70);
  });
});
