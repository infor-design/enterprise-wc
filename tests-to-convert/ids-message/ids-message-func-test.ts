/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/match-media-mock';

import '../../src/components/ids-message/ids-message';

// Supporing components
import '../../src/components/ids-modal/ids-modal-button';
import '../../src/components/ids-text/ids-text';
import type IdsMessage from '../../src/components/ids-message/ids-message';

const messageId = 'test-message';
const messageStatus = 'error';
const messageTitle = 'Lost Connection';
const message = `This application has experienced a system error
  due to the lack of internet access. Please restart the application in order to proceed.`;
const modalButtonHTML = `
  <ids-modal-button slot="buttons" appearance="secondary" id="my-message-cancel" cancel>Cancel</ids-modal-button>
  <ids-modal-button slot="buttons" appearance="primary" id="my-message-confirm">Confirm</ids-modal-button>`;

describe.skip('IdsMessage Component (using properties)', () => {
  let messageEl: IdsMessage;

  beforeEach(async () => {
    messageEl = document.createElement('ids-message') as IdsMessage;
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
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-message').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();

    // Use Snapshots
    expect(messageEl.outerHTML).toMatchSnapshot();
    messageEl.show();
    expect(messageEl.outerHTML).toMatchSnapshot();

    messageEl.hide();
    expect(messageEl.outerHTML).toMatchSnapshot();
  });

  test('has properties', () => {
    expect(messageEl.messageTitle).toEqual(messageTitle);
    expect(messageEl.status).toEqual(messageStatus);
    expect(messageEl.message).toEqual(message);
  });

  test('can alter the message', () => {
    const newMessage = 'This is the new error message';
    messageEl.message = newMessage;

    expect(messageEl.message).toEqual(newMessage);

    messageEl.message = '';

    expect(messageEl.message).toEqual('');
  });

  test('can alter the status', () => {
    expect(messageEl.ariaLabelContent).toEqual(`${messageStatus}: ${messageTitle}`);

    messageEl.status = 'success';

    expect(messageEl.status).toEqual('success');
    expect(messageEl.ariaLabelContent).toEqual(`success: ${messageTitle}`);

    messageEl.status = 'none';

    expect(messageEl.status).toEqual('none');
    expect(messageEl.ariaLabelContent).toEqual(messageTitle);
  });

  test('can alter its buttons', () => {
    const buttons = messageEl.buttons;
    const button1 = buttons[0];
    button1.setAttribute('cancel', '');

    expect(button1.cancel).toBeTruthy();

    button1.removeAttribute('cancel');

    expect(button1.cancel).toBeFalsy();
  });
});

describe('IdsMessage Component (using attributes)', () => {
  let messageEl: any;

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

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-message').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  test('has properties', () => {
    expect(messageEl.messageTitle).toEqual(messageTitle);
    expect(messageEl.status).toEqual(messageStatus);
    expect(messageEl.message).toEqual(message);
  });
});

describe('IdsMessage Component (empty)', () => {
  let messageEl: any;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-message id="${messageId}" status="${messageStatus}"></ids-message>`);
    messageEl = document.querySelector('ids-message');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    messageEl = null;
  });

  test('should render', () => {
    const errors = jest.spyOn(global.console, 'error');

    expect(document.querySelectorAll('ids-message').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  test('can add a message after being invoked', () => {
    const msg = 'This is my message component. Here\'s a <a href="http://example.com">Link</a>.';
    messageEl.message = msg;

    expect(messageEl.querySelectorAll('*').length).toBeTruthy();
    expect(messageEl.message).toEqual(msg);
  });

  test('can add a title after being invoked', () => {
    const title = 'Lost Connection';
    messageEl.messageTitle = title;

    expect(messageEl.querySelectorAll('*').length).toBeTruthy();
    expect(messageEl.messageTitle).toEqual(title);
  });
});
