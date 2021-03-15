// Supporting components
import IdsUploadAdvanced from '../../src/ids-upload-advanced/ids-upload-advanced';

/*
 * ========================================================
 * Use one to test, from below methods
 * (1) `uploadFile()` - Use demo app server to upload, will remove after one minute
 * (2) `uploadFileDummy()` - Use dummy logic to loop interval, no files sent anywhere
 * Else use component's `sendByXHR()` method, requird url attribute (url="http://localhost:4300/upload"), will remove after one minute
 * ========================================================
 */
const useSend = 1;

/**
 * Get random integer
 * @param {number} min The file
 * @param {number} max The file to check
 * @returns {number} Calcutated random integer
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Dummy send method, for demo purposes only
 * This method use dummy logic to loop interval and
 * does NOT use `formData` param and no files get to send anywhere
 * @param {object} formData Contains the file data.
 * @param {object} uiElem The ui element
 * @returns {void}
 */
// eslint-disable-next-line
function uploadFileDummy(formData, uiElem) {
  const total = 100;
  let loaded = 0;
  const e = {
    completeHandler: () => ({ loaded, total, target: { readystate: 4, status: 200 } }),
    progressHandler: () => ({ loaded, total }),
    abortHandler: () => null,
    errorHandler: () => ({
      loaded,
      total,
      target: {
        readystate: 4,
        status: 401,
        statusText: '<em>Error</em>: Some server issue!'
      }
    }),
  };
  const interval = setInterval(() => {
    const randomInt = randomInteger(1, 100);
    loaded++;
    if (loaded >= 100) {
      // Complete
      clearInterval(interval);
      uiElem.completeHandler(e.completeHandler());
    } else if (randomInt === loaded) {
      // Error
      clearInterval(interval);
      uiElem.errorHandler(e.errorHandler());
    } else {
      // In process
      uiElem.progressHandler(e.progressHandler());
    }
  }, 50);
  uiElem?.addEventListener('abort', () => {
    clearInterval(interval);
    uiElem.abortHandler(e.abortHandler());
  });
}

/**
 * Send files to Demo App server, files will remove after one minute.
 * In Chrome network tab, simulate a slow internet connection for testing
 * @param {object} formData Contains the file data.
 * @param {object} uiElem The ui element
 * @returns {void}
 */
// eslint-disable-next-line
function uploadFile(formData, uiElem) {
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

/*
 * ========================================================
 * DOM Loaded
 * ========================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  const elemUrl = document.querySelectorAll('#upload-advanced-url ids-upload-advanced');
  const elemCustomSend = document.querySelector('#upload-advanced-send');

  for (let i = 0, l = elemUrl.length; i < l; i++) {
    elemUrl[i].url = 'http://localhost:4300/upload';
  }

  /**
   * Send mehtod
   * (1) Use demo app server to upload, will remove after one minute
   * (2) Or Else, Use dummy logic to loop interval, no files sent anywhere
   * Else use component's `sendByXHR` method, requird url attribute, will remove after one minute
   */
  if (elemCustomSend) {
    if (useSend === 1) {
      elemCustomSend.send = uploadFile;
    } else if (useSend === 2) {
      elemCustomSend.send = uploadFileDummy;
    }
  }
});
