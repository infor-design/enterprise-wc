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
function randomInteger(min: number, max: number) {
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
function uploadFileDummy(formData: any, uiElem: any) {
  const total = 100;
  let loaded = 0;
  const e = {
    completeHandler: () => ({ loaded, total, target: { readyState: 4, status: 200 } }),
    progressHandler: () => ({ loaded, total }),
    abortHandler: () => null,
    errorHandler: () => ({
      loaded,
      total,
      target: {
        readyState: 4,
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
function uploadFile(formData: any, uiElem: any) {
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
 * After DOM Loaded
 * ========================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  const elemToBeSetAttrUrl: any = document.querySelectorAll('#upload-advanced-url ids-upload-advanced');
  const elemToBeUseCustomSend: any = document.querySelector('#upload-advanced-send');

  for (let i = 0, l = elemToBeSetAttrUrl.length; i < l; i++) {
    elemToBeSetAttrUrl[i].url = 'http://localhost:4300/upload';
  }

  /**
   * Send mehtod
   * (1) Use demo app server to upload, will remove after one minute
   * (2) Or Else, Use dummy logic to loop interval, no files sent anywhere
   * Else use component's `sendByXHR` method, requird url attribute, will remove after one minute
   */
  if (elemToBeUseCustomSend) {
    if (useSend === 1) {
      elemToBeUseCustomSend.send = uploadFile;
    } else if (useSend === 2) {
      elemToBeUseCustomSend.send = uploadFileDummy;
    }
  }

  /*
   * ========================================================
   * Events that may be triggered
   * ========================================================
   */
  /* eslint-disable */

  // Element to target
  const targetElem = document.querySelector('#elem-upload-advanced-events');

  // Files enter in drag area
  targetElem?.addEventListener('filesdragenter', (e) => {
    console.info('Files enter in drag area', e);
  });

  // Files drop in to drag area
  targetElem?.addEventListener('filesdrop', (e) => {
    console.info('Files drop in to drag area', e);
  });

  // File begin upload
  targetElem?.addEventListener('beginupload', (e) => {
    console.info('File begin upload', e);
  });

  // File abort
  targetElem?.addEventListener('abort', (e) => {
    console.info('File abort', e);
  });

  // File error
  targetElem?.addEventListener('error', (e) => {
    console.info('File error', e);
  });

  // File complete
  targetElem?.addEventListener('complete', (e) => {
    console.info('File complete', e);
  });

  // Click close button
  targetElem?.addEventListener('closebuttonclick', (e) => {
    console.info('Clicked on close button', e);
  });

  /*
   * ========================================================
   * Arbitrary error message
   * ========================================================
   */
  // Set an arbitrary error message
  const errorBtn: any = document.querySelector('#upload-advanced-set-error-btn');
  const errorEl: any = document.querySelector('#upload-advanced-set-error');
  errorBtn?.addEventListener('click', () => {
    errorEl.setError({ message: 'Arbitrary error message' });
  });

  // Set an arbitrary error message (on each file)
  const errorFilesBtn: any = document.querySelector('#upload-advanced-set-error-on-files-btn');
  const errorFilesEl: any = document.querySelector('#upload-advanced-set-error-on-files');
  errorFilesBtn?.addEventListener('click', () => {
    const fileNodes: any[] = errorFilesEl.all;
    if (fileNodes.length) {
      errorFilesEl.setError({ message: 'File arbitrary error message', fileNodes });
    }
  });
});
