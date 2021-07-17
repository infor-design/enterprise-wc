/**
 * @jest-environment jsdom
 */
import IdsMessage from '../../src/ids-message';

// Supporing components
import IdsModalButton from '../../src/ids-modal-button';
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
    messageEl = document.createElement('ids-message');
    messageEl.id = messageId;
    messageEl.messageTitle = messageTitle;
    messageEl.status = messageStatus;
    messageEl.message = message;

    document.body.appendChild(messageEl);

    // Insert buttons
    messageEl.insertAdjacentHTML('beforeend', modalButtonHTML);
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
    expect(messageEl.messageTitle).toEqual(messageTitle);
    expect(messageEl.status).toEqual(messageStatus);
    expect(messageEl.message).toEqual(message);
  });

  it('can alter the message', () => {
    const newMessage = 'This is the new error message';
    messageEl.message = newMessage;

    expect(messageEl.message).toEqual(newMessage);

    messageEl.message = '';

    expect(messageEl.message).toEqual('');
  });

  it('can alter the status', () => {
    messageEl.status = 'success';

    expect(messageEl.status).toEqual('success');

    messageEl.status = 'none';

    expect(messageEl.status).toEqual('none');
  });

  it('can alter its buttons', () => {
    const buttons = messageEl.buttons;
    const button1 = buttons[0];
    button1.setAttribute('cancel', '');

    expect(button1.cancel).toBeTruthy();

    button1.removeAttribute('cancel');

    expect(button1.cancel).toBeFalsy();
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
    expect(messageEl.messageTitle).toEqual(messageTitle);
    expect(messageEl.status).toEqual(messageStatus);
    expect(messageEl.message).toEqual(message);
  });
});

describe('IdsMessage Component (empty)', () => {
  let messageEl;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-message id="${messageId}" status="${messageStatus}"></ids-message>`);
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

  it('can add a message after being invoked', () => {
    const msg = 'This is my message component. Here\'s a <a href="http://example.com">Link</a>.';
    messageEl.message = msg;

    expect(messageEl.querySelectorAll('*').length).toBeTruthy();
    expect(messageEl.message).toEqual(msg);
  });

  it('can add a title after being invoked', () => {
    const title = 'Lost Connection';
    messageEl.messageTitle = title;

    expect(messageEl.querySelectorAll('*').length).toBeTruthy();
    expect(messageEl.messageTitle).toEqual(title);
  });
});
