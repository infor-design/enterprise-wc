import { camelCase } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * Shared in between upload advanced.
 * @private
 * @returns {void}
 */
const IdsUploadAdvancedShared = {
  DEFAULTS: {
    autoStart: true, // allow automatic start upload, after files have been dropped or added
    paramName: 'myfile', // variable name to read from server
    icon: 'upload', // Droparea icon
    maxFileSize: -1, // max file size in bytes, -1 for unlimited
    maxFiles: 99999, // max files can be upload
    maxFilesInProcess: 99999, // max files can be upload while in process,
    method: 'POST', // Sets the method to use component XMLHttpRequest method to send files
    showBrowseLink: true, // Browse files to upload

    // Text strings
    textBtnCancel: '',
    textBtnCancelAll: '',
    textBtnDismissError: '',
    textBtnRemove: '',
    textBtnStartUpload: '',
    textDroparea: '',
    textDropareaWithBrowse: '',
    textDropareaWithBrowseLink: '',
    textProgressLabel: '',

    // Error strings
    errorMaxFiles: '',
    errorMaxFilesInProcess: '',
    errorAcceptFileType: '',
    errorMaxFileSize: '',
    errorUrl: '',
    errorXhrHeaders: '',

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
    notStarted: 'not-started',
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
  formatBytes(bytes: number, decimals = 2) {
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
  slotVal(shadowRoot: any, slotName: string) {
    const d: any = this.DEFAULTS;
    const html = (slot: any) => slot?.assignedNodes()[0]?.innerHTML;
    const slot = shadowRoot?.querySelector(`slot[name="${slotName}"]`);
    return html(slot) || d[camelCase(slotName)];
  }
};

export default IdsUploadAdvancedShared;
