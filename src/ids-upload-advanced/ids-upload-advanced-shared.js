import { stringUtils } from '../ids-base';

/**
 * Shared in between upload advanced.
 * @private
 * @returns {void}
 */
const IdsUploadAdvancedShared = {
  DEFAULTS: {
    paramName: 'myfile', // variable name to read from server
    icon: 'upload', // Droparea icon
    maxFileSize: -1, // max file size in bytes, -1 for unlimited
    maxFiles: 99999, // max files can be upload
    maxFilesInProcess: 99999, // max files can be upload while in process,
    method: 'POST', // Sets the method to use component XMLHttpRequest method to send files
    showBrowseLink: true, // Browse files to upload

    // Text strings
    textBtnCancel: 'Cancel uploading this file',
    textBtnCloseError: 'Close this error',
    textBtnRemove: 'Remove this file from UI list',
    textDroparea: 'Drag and Drop Files to Upload',
    textDropareaWithBrowse: 'Drag and Drop or {browseLink} to Upload',
    textDropareaWithBrowseLink: 'Select Files',
    textProgressLabel: '{file-name} uploaded {loaded} out of {size} ({percent}%)',

    // Error strings
    errorMaxFiles: '<em>Error</em>: Cannot upload more than the maximum number of files ({maxFiles}).',
    errorMaxFilesInProcess: '<em>Error</em>: Exceeded maximum files allowed limit',
    errorAcceptFileType: '<em>Error</em>: File type is not allowed',
    errorMaxFileSize: '<em>Error</em>: Exceeded file size limit',
    errorUrl: '<em>Error</em>: Url not found!',
    errorXhrHeaders: '<em>Error</em>: XHR Headers must be a valid JSON string contains array of name/value objects.',

    // Extra headers to use with XMLHttpRequest (JSON)
    xhrHeaders: ''
  },
  ERRORS: {
    errorMaxFiles: 'error-max-files',
    errorMaxFilesInProcess: 'error-max-files-in-process',
    errorAcceptFileType: 'error-accept-file-type',
    errorMaxFileSize: 'error-max-file-size',
    errorUrl: 'error-url',
    errorXhrHeaders: 'error-xhr-headers'
  },
  STATUS: {
    inProcess: 'in-process',
    aborted: 'aborted',
    errored: 'errored',
    completed: 'completed'
  },

  /**
   * Formats the file size to human readable.
   * @private
   * @param {number} bytes The size value in bytes.
   * @param {number} decimals The decimal point.
   * @returns {string} formated to use in ui.
   */
  formatBytes(bytes, decimals = 2) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (typeof bytes !== 'number') {
      return '';
    }
    let index;
    const multiplier = 1000;
    let val = bytes;
    for (index = 0; val > multiplier; index++) {
      val /= multiplier;
    }
    return `${parseFloat(val.toFixed(decimals))} ${units[index]}`;
  },

  /**
   * Get the value for given slot.
   * @private
   * @param {object} shadowRoot The shadow root.
   * @param {string} slotName The slot name.
   * @returns {string} The slot val.
   */
  slotVal(shadowRoot, slotName) {
    const d = this.DEFAULTS;
    const html = (slot) => slot?.assignedNodes()[0]?.innerHTML;
    const slot = shadowRoot?.querySelector(`slot[name="${slotName}"]`);
    return html(slot) || d[stringUtils.camelCase(slotName)];
  }
};

export { IdsUploadAdvancedShared };
