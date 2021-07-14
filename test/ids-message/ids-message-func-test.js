/**
 * @jest-environment jsdom
 */
import IdsMessage from '../../src/ids-message';

// Supporing components
import IdsModalButton from '../../src/ids-modal';
import IdsText from '../../src/ids-text/ids-text';

const messageId = 'test-message';
const messageStatus = 'error';
const messageTitle = 'Lost Connection';
const message = `This application has experienced a system error
  due to the lack of internet access. Please restart the application in order to proceed.`;
const modalButtonHTML = `
  <ids-modal-button slot="buttons" type="secondary" id="my-message-cancel" cancel>Cancel</ids-modal-button>
  <ids-modal-button slot="buttons" type="primary" id="my-message-confirm">Confirm</ids-modal-button>`;

describe('IdsMessage Component (using properties)', () => {
  let messageEl;

  beforeEach(async () => {
    messageEl = new IdsMessage();
    messageEl.id = messageId;
    messageEl.title = messageTitle;
    messageEl.status = messageStatus;
    messageEl.message = message;

    document.body.appendChild(messageEl);

    // Insert buttons
    messageEl.insertAdjacentHTML('beforeend', modalButtonHTML);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-message').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    messageEl.remove();

    expect(document.querySelectorAll('ids-message').length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(messageEl.title).toEqual(messageTitle);
    expect(messageEl.status).toEqual(messageStatus);
    expect(messageEl.message).toEqual(message);
  });
});

describe('IdsMessage Component (using attributes)', () => {
  let messageEl;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-message id="${messageId}" status="${messageStatus}">
      <ids-text slot="title" font-size="24" type="h2" id="my-message-title">${messageTitle}</ids-text>
      <ids-text id="my-message-contents">${message}</ids-text>
      ${modalButtonHTML}
    </ids-message>`);
    messageEl = document.querySelector('ids-message');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    messageEl = null;
  });

  it('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-message').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('can be destroyed', () => {
    const errors = jest.spyOn(global.console, 'error');

    messageEl.remove();

    expect(document.querySelectorAll('ids-message').length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('has properties', () => {
    expect(messageEl.title).toEqual(messageTitle);
    expect(messageEl.status).toEqual(messageStatus);
    expect(messageEl.message).toEqual(message);
  });
});
