import IdsUploadAdvanced from '../ids-upload-advanced';

/**
 * Example to show the way to custom send method for uploading files.
 * Send files to Demo App server, files will remove soon uploaded.
 * In Chrome network tab, simulate a slow internet connection for testing
 * @param {object} formData Contains the file data.
 * @param {object} uiElem The ui element
 * @returns {void}
 */
function customSendMethodXhr(formData, uiElem) {
  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener('progress', uiElem.progressHandler.bind(uiElem), false);
  xhr.addEventListener('load', uiElem.completeHandler.bind(uiElem), false);
  xhr.addEventListener('error', uiElem.errorHandler.bind(uiElem), false);
  xhr.addEventListener('abort', uiElem.abortHandler.bind(uiElem), false);
  xhr.open('POST', 'http://localhost:4300/upload');
  xhr.send(formData);

  // File abort
  uiElem?.addEventListener('abort', () => {
    xhr.abort();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const uploadEl = document.querySelector('#elem-upload-advanced-send');
  uploadEl.send = customSendMethodXhr;
});
