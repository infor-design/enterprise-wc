/**
 * @jest-environment jsdom
 */
import IdsUploadAdvanced from '../../src/components/ids-upload-advanced/ids-upload-advanced';

describe('IdsUploadAdvanced Component', () => {
  let el;

  beforeEach(async () => {
    const elem = new IdsUploadAdvanced();
    elem.setAttribute('url', 'https://somedomain.com/');
    document.body.appendChild(elem);
    el = document.querySelector('ids-upload-advanced');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsUploadAdvanced();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-upload-advanced').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders as limit types accept', () => {
    const files = [
      { size: 5000, type: 'audio/mp3', name: 'myfile1.mp3' },
      { size: 1000, type: 'image/jpg', name: 'myfile2.jpg' }
    ];
    expect(el.getAttribute('accept')).toEqual(null);
    expect(el.fileInput.getAttribute('accept')).toEqual(null);
    el.accept = '.jpg';
    expect(el.getAttribute('accept')).toEqual('.jpg');
    expect(el.fileInput.getAttribute('accept')).toEqual('.jpg');
    el.handleFileUpload([...files]);
    el.accept = null;
    el.handleFileUpload([...files]);
    expect(el.getAttribute('accept')).toEqual(null);
    expect(el.fileInput.getAttribute('accept')).toEqual(null);
  });

  it('should renders as disabled', () => {
    expect(el.getAttribute('disabled')).toEqual(null);
    let rootEl = el.shadowRoot.querySelector('.ids-upload-advanced');
    expect(rootEl.classList).not.toContain('disabled');
    el.disabled = true;
    expect(el.getAttribute('disabled')).toEqual('true');
    rootEl = el.shadowRoot.querySelector('.ids-upload-advanced');
    expect(rootEl.classList).toContain('disabled');
    el.disabled = false;
    expect(el.getAttribute('disabled')).toEqual(null);
    rootEl = el.shadowRoot.querySelector('.ids-upload-advanced');
    expect(rootEl.classList).not.toContain('disabled');
  });

  it('should set icon to be use in main drop area', () => {
    const defaultIcon = 'upload';
    let icon = el.shadowRoot.querySelector('.icon');
    expect(icon.getAttribute('icon')).toEqual(defaultIcon);
    expect(el.getAttribute('icon')).toEqual(null);
    el.icon = 'delete';
    icon = el.shadowRoot.querySelector('.icon');
    expect(icon.getAttribute('icon')).toEqual('delete');
    expect(el.getAttribute('icon')).toEqual('delete');
    el.icon = null;
    icon = el.shadowRoot.querySelector('.icon');
    expect(icon.getAttribute('icon')).toEqual(defaultIcon);
    expect(el.getAttribute('icon')).toEqual(null);
  });

  it('should set the max file size', () => {
    const files = [
      { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
      { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
    ];
    expect(el.getAttribute('max-file-size')).toEqual(null);
    expect(el.maxFileSize).toEqual(-1);
    el.maxFileSize = '2000';
    expect(el.getAttribute('max-file-size')).toEqual('2000');
    expect(el.maxFileSize).toEqual('2000');
    el.handleFileUpload([...files]);
    el.maxFileSize = null;
    el.handleFileUpload([...files]);
    expect(el.getAttribute('max-file-size')).toEqual(null);
    expect(el.maxFileSize).toEqual(-1);
  });

  it('should set max number of files can be uploaded', () => {
    const files = [
      { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
      { size: 1000, type: 'image/jpg', name: 'myfile2.jpg' },
      { size: 1000, type: 'image/jpg', name: 'myfile3.jpg' }
    ];
    expect(el.getAttribute('max-files')).toEqual(null);
    expect(el.maxFiles).toEqual(99999);
    el.maxFiles = '2';
    el.handleFileUpload([...files]);
    expect(el.getAttribute('max-files')).toEqual('2');
    expect(el.maxFiles).toEqual('2');
    el.maxFiles = null;
    el.handleFileUpload([...files]);
    expect(el.getAttribute('max-files')).toEqual(null);
    expect(el.maxFiles).toEqual(99999);
  });

  it('should set max files can be uploaded while in process', () => {
    const files = [
      { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
      { size: 1000, type: 'image/jpg', name: 'myfile2.jpg' },
      { size: 1000, type: 'image/jpg', name: 'myfile3.jpg' }
    ];
    expect(el.getAttribute('max-files-in-process')).toEqual(null);
    expect(el.maxFilesInProcess).toEqual(99999);
    el.maxFilesInProcess = '2';
    el.handleFileUpload([...files]);
    expect(el.getAttribute('max-files-in-process')).toEqual('2');
    expect(el.maxFilesInProcess).toEqual('2');
    el.maxFilesInProcess = null;
    expect(el.getAttribute('max-files-in-process')).toEqual(null);
    expect(el.maxFilesInProcess).toEqual(99999);
  });

  it('should set method to use xhr', () => {
    expect(el.getAttribute('method')).toEqual(null);
    expect(el.method).toEqual('POST');
    el.method = 'PUT';
    expect(el.getAttribute('method')).toEqual('PUT');
    expect(el.method).toEqual('PUT');
    el.method = null;
    expect(el.getAttribute('method')).toEqual(null);
    expect(el.method).toEqual('POST');
  });

  it('should set param name to read from server', () => {
    expect(el.getAttribute('param-name')).toEqual(null);
    expect(el.paramName).toEqual('myfile');
    el.paramName = 'test';
    expect(el.getAttribute('param-name')).toEqual('test');
    expect(el.paramName).toEqual('test');
    el.paramName = null;
    expect(el.getAttribute('param-name')).toEqual(null);
    expect(el.paramName).toEqual('myfile');
  });

  it('should set link to browse files to upload', () => {
    expect(el.getAttribute('show-browse-link')).toEqual(null);
    expect(el.showBrowseLink).toEqual(null);
    el.showBrowseLink = 'false';
    expect(el.getAttribute('show-browse-link')).toEqual('false');
    expect(el.showBrowseLink).toEqual('false');
    el.showBrowseLink = 'true';
    expect(el.getAttribute('show-browse-link')).toEqual('true');
    expect(el.showBrowseLink).toEqual('true');
    el.showBrowseLink = null;
    expect(el.getAttribute('show-browse-link')).toEqual(null);
    expect(el.showBrowseLink).toEqual(null);
  });

  it('should set url to use with xhr', () => {
    const files = [
      { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
      { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
    ];
    expect(el.getAttribute('url')).toEqual('https://somedomain.com/');
    expect(el.url).toEqual('https://somedomain.com/');
    el.url = 'http://test.com/somepath';
    expect(el.getAttribute('url')).toEqual('http://test.com/somepath');
    expect(el.url).toEqual('http://test.com/somepath');
    el.url = null;
    el.handleFileUpload([...files]);
    el.disabled = true;
    el.handleFileUpload([...files]);
    el.disabled = false;
    expect(el.getAttribute('url')).toEqual(null);
    expect(el.url).toEqual(null);
  });

  it('should get current files from api', () => {
    const files = [
      { size: 5000, type: 'audio/mp3', name: 'myfile1.mp3' },
      { size: 1000, type: 'image/jpg', name: 'myfile2.jpg' },
      { size: 1000, type: 'image/jpg', name: 'myfile3.jpg' }
    ];
    el.accept = '.jpg';
    el.handleFileUpload([...files]);
    expect(el.all.length).toEqual(3);
    expect(el.inProcess.length).toEqual(2);
    expect(el.aborted.length).toEqual(0);
    expect(el.errored.length).toEqual(1);
    expect(el.completed.length).toEqual(0);
  });

  it('should change event on file input', () => {
    const file = { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' };
    const event = new Event('change', { bubbles: true, files: [file] });
    el.fileInput.dispatchEvent(event);
    el.handleFileUpload([file]);
    const fileElems = el.shadowRoot.querySelectorAll('ids-upload-advanced-file');
    expect(fileElems.length).toEqual(1);
  });

  it('should click event on label', () => {
    const labelMockClick = jest.fn();
    const hyperlinkMockClick = jest.fn();
    const label = el.shadowRoot.querySelector('label');
    const hyperlink = el.shadowRoot.querySelector('.hyperlink');
    label.addEventListener('click', labelMockClick);
    hyperlink.addEventListener('click', hyperlinkMockClick);
    label.click();
    hyperlink.click();
    expect(labelMockClick.mock.calls.length).toBe(3);
    expect(hyperlinkMockClick.mock.calls.length).toBe(1);
  });

  it('should update slot value', () => {
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const span3 = document.createElement('span');
    span1.setAttribute('slot', 'text-droparea');
    span2.setAttribute('slot', 'text-droparea-with-browse');
    span3.setAttribute('slot', 'xhr-headers');
    span3.setAttribute('id', 'xhr-headers-id');
    span1.innerHTML = 'text-for-droparea';
    span2.innerHTML = 'Drag and Drop or test-browse-link to Upload';
    span3.innerHTML = '[{ "name": "header1", "value": "header1-value" }]';
    el.appendChild(span1);
    el.appendChild(span2);
    el.appendChild(span3);
    el.setXhrHeaders();
    expect(el.xhrHeaders).toEqual([{ name: 'header1', value: 'header1-value' }]);
    const xhrEl = document.querySelector('#xhr-headers-id');
    xhrEl.innerHTML = 'test';
    el.setXhrHeaders();
    expect(el.xhrHeaders).toEqual(null);
    xhrEl.innerHTML = '{ "name": "header1", "value": "header1-value" }';
    el.setXhrHeaders();
    expect(el.xhrHeaders).toEqual([{ name: 'header1', value: 'header1-value' }]);
  });

  it('should run custom send methos', () => {
    const files = [
      { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
      { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
    ];
    el.send = (formData, uiElem) => {}; // eslint-disable-line
    el.handleFileUpload([...files]);
    const fileElems = el.shadowRoot.querySelectorAll('ids-upload-advanced-file');
    expect(fileElems.length).toEqual(2);
  });

  it('should get error value', () => {
    el.maxFiles = '2';
    const errors = [{
      name: 'error-max-files',
      value: `<em>Error</em>: Cannot upload more than the maximum number of files (${el.maxFiles}).`
    }, {
      name: 'error-max-files-in-process',
      value: '<em>Error</em>: Exceeded maximum files allowed limit'
    }, {
      name: 'error-accept-file-type',
      value: '<em>Error</em>: File type is not allowed'
    }, {
      name: 'error-max-file-size',
      value: '<em>Error</em>: Exceeded file size limit'
    }, {
      name: 'error-url',
      value: '<em>Error</em>: Url not found!'
    }, {
      name: 'error-xhr-headers',
      value: '<em>Error</em>: XHR Headers must be a valid JSON string contains array of name/value objects.'
    }];
    el.disabled = true;
    el.errorMessage({ error: 'test' });
    el.disabled = false;
    el.errorMessage({ error: 'test', data: 'test2' });
    expect(el.getErrorValue()).toEqual('');
    errors.forEach((e) => {
      expect(el.getErrorValue(e.name)).toEqual(e.value);
    });
  });

  it('should call xhr method', () => {
    const files = [
      { size: 1000, type: 'image/jpg', name: 'myfile1.jpg' },
      { size: 5000, type: 'image/jpg', name: 'myfile2.jpg' }
    ];
    el.xhrHeaders = [{ name: 'header1', value: 'header1-value' }];
    el.handleFileUpload([...files]);
    let fileElems = el.shadowRoot.querySelectorAll('ids-upload-advanced-file');
    el.xhrHeaders = [{ name: '', value: '' }];
    expect(fileElems.length).toEqual(2);
    fileElems.forEach((elem) => (elem.shadowRoot.querySelector('.btn-close').click()));
    el.handleFileUpload([...files]);
    fileElems = el.shadowRoot.querySelectorAll('ids-upload-advanced-file');
    expect(fileElems.length).toEqual(2);
  });

  it('should drag drop', () => {
    const files = [{ size: 1000, type: 'image/jpg', name: 'myfile1.jpg' }];
    const createBubbledEvent = (type, attributes = {}) => {
      const event = new Event(type, { bubbles: true });
      Object.assign(event, attributes);
      return event;
    };
    el.disabled = true;
    el.droparea.dispatchEvent(
      createBubbledEvent('dragenter', { dataTransfer: { files } })
    );
    el.droparea.dispatchEvent(
      createBubbledEvent('drop', { dataTransfer: { files } })
    );

    el.disabled = false;
    el.droparea.dispatchEvent(
      createBubbledEvent('dragenter', { dataTransfer: { files } })
    );
    el.droparea.dispatchEvent(
      createBubbledEvent('dragover', { dataTransfer: { files } })
    );
    el.droparea.dispatchEvent(
      createBubbledEvent('drop', { dataTransfer: { files } })
    );

    document.dispatchEvent(
      createBubbledEvent('dragenter', { dataTransfer: { files } })
    );
    document.dispatchEvent(
      createBubbledEvent('dragover', { dataTransfer: { files } })
    );
    document.dispatchEvent(
      createBubbledEvent('drop', { dataTransfer: { files } })
    );
    const fileElems = el.shadowRoot.querySelectorAll('ids-upload-advanced-file');
    expect(fileElems.length).toEqual(1);
  });

  it('should renders template', () => {
    document.body.innerHTML = '';
    el = document.createElement('ids-upload-advanced');
    el.setAttribute('accept', '.jpg');
    el.setAttribute('disabled', 'true');
    el.setAttribute('max-files-in-process', '1');
    el.template();
    const rootEl = el.shadowRoot.querySelector('.ids-upload-advanced');
    expect(el.disabled).toEqual('true');
    expect(rootEl.classList).toContain('disabled');
  });
});
