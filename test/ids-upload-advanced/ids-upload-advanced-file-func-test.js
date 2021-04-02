/**
 * @jest-environment jsdom
 */
import IdsUploadAdvancedFile from '../../src/ids-upload-advanced/ids-upload-advanced-file';

describe('IdsUploadAdvancedFile Component', () => {
  let el;

  beforeEach(async () => {
    const elem = new IdsUploadAdvancedFile();
    elem.setAttribute('file-name', 'test');
    elem.setAttribute('size', '1000');
    document.body.appendChild(elem);
    el = document.querySelector('ids-upload-advanced-file');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsUploadAdvancedFile();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-upload-advanced-file').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should set abort handler', () => {
    el.value = 10;
    expect(el.status).toEqual('in-process');
    el.abortHandler();
    expect(el.status).toEqual('aborted');
    el.setStatus();
    expect(el.status).toEqual('aborted');
    el.status = 'in-process';
    el.value = 10;
    expect(el.status).toEqual('in-process');
    el.abortHandler({ loaded: 10, total: 100, abort: true });
    expect(el.status).toEqual('aborted');
  });

  it('should set progress handler', () => {
    el.value = 10;
    expect(el.value).toEqual('10');
    expect(el.status).toEqual('in-process');
    el.progressHandler({ loaded: 35, total: 100 });
    expect(el.value).toEqual('35');
    expect(el.status).toEqual('in-process');
  });

  it('should set complete handler', () => {
    const event = {
      loaded: 100,
      total: 100,
      target: {
        readyState: 4,
        status: 200
      }
    };
    el.value = 10;
    expect(el.status).toEqual('in-process');
    el.completeHandler(event);
    expect(el.status).toEqual('completed');
  });

  it('should set complete handler with error', () => {
    const event = {
      loaded: 100,
      total: 100,
      target: {
        readyState: 4,
        status: 201
      }
    };
    el.value = 10;
    expect(el.status).toEqual('in-process');
    el.completeHandler(event);
    expect(el.status).toEqual('errored');
    el.error = null;
    expect(el.status).toEqual('in-process');
    el.value = 100;
    el.completeHandler(event);
    expect(el.status).toEqual('errored');
  });

  it('should set error handler', () => {
    const event = {
      loaded: 10,
      total: 100,
      target: {
        readyState: 4,
        status: 401,
        statusText: '<em>Error</em>: Some server issue!'
      }
    };
    el.value = 10;
    expect(el.status).toEqual('in-process');
    el.errorHandler(event);
    expect(el.status).toEqual('errored');
    el.error = null;
    expect(el.status).toEqual('in-process');
    el.errorHandler('some-error-text');
    expect(el.status).toEqual('errored');
    el.error = null;
    expect(el.status).toEqual('in-process');
    el.errorHandler(false);
    expect(el.status).toEqual('errored');
    const errorMsgEl = el.shadowRoot.querySelector('.error-row .error-msg');
    el.error = null;
    expect(el.status).toEqual('in-process');
    el.value = -5;
    errorMsgEl.classList.remove('error-msg');
    expect(errorMsgEl.classList).not.toContain('error-msg');
    el.errorHandler('some-error-text');
    expect(el.status).toEqual('errored');
  });

  it('should set file name', () => {
    expect(el.fileName).toEqual('test');
    expect(el.getAttribute('file-name')).toEqual('test');
    el.fileName = null;
    expect(el.fileName).toEqual('');
    expect(el.getAttribute('file-name')).toEqual(null);
  });

  it('should set file size', () => {
    expect(el.size).toEqual('1000');
    expect(el.getAttribute('size')).toEqual('1000');
    el.size = null;
    expect(el.size).toEqual(null);
    expect(el.getAttribute('size')).toEqual(null);
  });

  it('should set progress bar value', () => {
    expect(el.value).toEqual(null);
    expect(el.getAttribute('value')).toEqual(null);
    el.value = 10;
    expect(el.value).toEqual('10');
    expect(el.getAttribute('value')).toEqual('10');
    expect(el.status).toEqual('in-process');
    el.value = 20;
    expect(el.value).toEqual('20');
    expect(el.getAttribute('value')).toEqual('20');
    expect(el.status).toEqual('in-process');
    el.error = 'some-error';
    expect(el.value).toEqual('20');
    expect(el.getAttribute('value')).toEqual('20');
    expect(el.status).toEqual('errored');
    el.value = 30;
    expect(el.value).toEqual('20');
    expect(el.getAttribute('value')).toEqual('20');
    expect(el.status).toEqual('errored');
    el.value = null;
    expect(el.value).toEqual(null);
    expect(el.getAttribute('value')).toEqual(null);
  });

  it('should renders template', () => {
    document.body.innerHTML = '';
    el = document.createElement('ids-upload-advanced-file');
    el.setAttribute('disabled', 'true');
    el.template();
    const rootEl = el.shadowRoot.querySelector('.ids-upload-advanced-file');
    expect(el.disabled).toEqual('true');
    expect(rootEl.classList).toContain('disabled');
  });
});
