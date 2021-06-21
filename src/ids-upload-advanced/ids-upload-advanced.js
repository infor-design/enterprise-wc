import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes,
  stringUtils
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import IdsUploadAdvancedFile from './ids-upload-advanced-file';
import IdsHyperLink from '../ids-hyperlink/ids-hyperlink';
import { IdsUploadAdvancedShared as shared } from './ids-upload-advanced-shared';

import styles from './ids-upload-advanced.scss';

/**
 * IDS UploadAdvanced Component
 * @type {IdsUploadAdvanced}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the main container element
 * @part label - the label element
 * @part link - the hyperlink element
 */
@customElement('ids-upload-advanced')
@scss(styles)
class IdsUploadAdvanced extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      attributes.ACCEPT,
      attributes.DISABLED,
      attributes.ICON,
      attributes.MAX_FILE_SIZE,
      attributes.MAX_FILES,
      attributes.MAX_FILES_IN_PROCESS,
      attributes.METHOD,
      attributes.PARAM_NAME,
      attributes.SHOW_BROWSE_LINK,
      attributes.URL,
      attributes.VERSION,
      attributes.MODE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    /** @type {any} */
    this.fileInput = this.shadowRoot.querySelector('.file-input');
    /** @type {any} */
    this.droparea = this.shadowRoot.querySelector('.droparea');

    this.files = [];

    this.handleEvents();
    super.connectedCallback();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const toBool = stringUtils.stringToBool;
    const d = shared.DEFAULTS;
    const hiddenClass = (/** @type {boolean} */ opt) => (opt ? ' hidden' : '');
    const accept = this.accept ? ` accept="${this.accept}"` : '';
    const disabled = toBool(this.disabled) ? ' disabled' : '';
    const multiple = this.maxFilesInProcess > 1 ? ' multiple' : '';
    const hiddenArea = `
      <div class="hidden">
        <slot name="text-btn-cancel">${d.textBtnCancel}</slot>
        <slot name="text-btn-close-error">${d.textBtnCloseError}</slot>
        <slot name="text-btn-remove">${d.textBtnRemove}</slot>
        <slot name="text-droparea">${d.textDroparea}</slot>
        <slot name="text-droparea-with-browse">${d.textDropareaWithBrowse}</slot>
        <slot name="text-droparea-with-browse-link">${d.textDropareaWithBrowseLink}</slot>
        <slot name="text-progress-label">${d.textProgressLabel}</slot>
        <slot name="error-accept-file-type">${d.errorAcceptFileType}</slot>
        <slot name="error-max-files">${d.errorMaxFiles}</slot>
        <slot name="error-max-files-in-process">${d.errorMaxFilesInProcess}</slot>
        <slot name="error-max-file-size">${d.errorMaxFileSize}</slot>
        <slot name="error-url">${d.errorUrl}</slot>
        <slot name="error-xhr-headers">${d.errorXhrHeaders}</slot>
        <slot name="xhr-headers">${d.xhrHeaders}</slot>
      </div>`;

    const content = `
      <div class="content">
        <div class="no-browse-link${hiddenClass(this.showBrowseLinkVal)}">
          <span class="droparea-label">${this.getDropareaLabel(null)}</span>
        </div>
        <div class="has-browse-link${hiddenClass(!this.showBrowseLinkVal)}">
          <label>
            <input type="file" class="file-input"${accept}"${multiple}${disabled} />
            <span class="droparea-label" part="label">${this.getDropareaLabel(true)}</span>
          </label>
        </div>
      </div>`;

    return `
      <div class="ids-upload-advanced${disabled}">
        ${hiddenArea}
        <div class="droparea" part="container">
          <ids-icon icon="${this.icon}" class="icon"></ids-icon>
          ${content}
        </div>
        <div class="errorarea"></div>
        <div class="filesarea"></div>
      </div>`;
  }

  /**
   * Send file to server, by XMLHttpRequest
   * Must have url value
   * @private
   * @param {object} formData - Contains the form data / file data.
   * @param {object} uiElem The ui element
   * @returns {void}
   */
  sendByXHR(formData, uiElem) {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', uiElem.progressHandler.bind(uiElem), false);
    xhr.addEventListener('load', uiElem.completeHandler.bind(uiElem), false);
    xhr.addEventListener('error', uiElem.errorHandler.bind(uiElem), false);
    xhr.addEventListener('abort', uiElem.abortHandler.bind(uiElem), false);
    xhr.open(this.method, this.url);
    xhr.setRequestHeader('param-name', this.paramName);
    if (this.xhrHeaders) {
      const isValid = (/** @type {object} */ h) => (h && h.name !== '');
      this.xhrHeaders.forEach((/** @type {object} */ h) => {
        if (isValid(h)) {
          xhr.setRequestHeader(h.name, h.value);
        }
      });
    }
    xhr.send(formData);

    /* istanbul ignore next */
    uiElem?.addEventListener('abort', () => {
      xhr.abort(); // File abort
    });
  }

  /**
   * Set xhr headers value
   * @private
   * @returns {void}
   */
  setXhrHeaders() {
    const errorarea = this.shadowRoot?.querySelector('.errorarea');
    errorarea.innerHTML = '';
    /** @type {any} */
    let xhrHeaders = shared.slotVal(this.shadowRoot, 'xhr-headers');
    let isValid = true;
    try {
      xhrHeaders = JSON.parse(xhrHeaders.trim());
    } catch (e) {
      isValid = false;
    }
    if (!isValid) {
      const error = shared.slotVal(this.shadowRoot, 'error-xhr-headers');
      this.errorMessage({ error, data: xhrHeaders.toString() });
      this.xhrHeaders = null;
    } else if (!Array.isArray(xhrHeaders)
      && typeof xhrHeaders === 'object'
      && xhrHeaders.name
      && xhrHeaders.value) {
      this.xhrHeaders = [xhrHeaders];
    } else {
      this.errorMessage({ remove: true });
      this.xhrHeaders = xhrHeaders;
    }
  }

  /**
   * Dispatch event
   * @private
   * @param  {string} eventName The event name
   * @param  {object} e Actual event
   * @param  {string} id The id
   * @param  {string} file The file
   * @returns {void}
   */
  dispatchFileEvent(eventName, e, id, file) {
    this.triggerEvent(eventName, this, {
      detail: {
        id,
        file,
        elem: this,
        error: this.getErrorValue(e.detail.error),
        loaded: e.detail.loaded,
        loadedFormatted: e.detail.loadedFormatted,
        nativeEvent: e.detail.nativeEvent,
        size: e.detail.size,
        sizeFormatted: e.detail.sizeFormatted,
        status: e.detail.status,
        value: e.detail.value
      }
    });
  }

  /**
   * Get droparea label html
   * @private
   * @param {boolean?} hasBrowse if true, use with browse link
   * @returns {string} The html output
   */
  getDropareaLabel(hasBrowse) {
    const toBool = stringUtils.stringToBool;
    // const isValid = (/** @type {string} */ s) => typeof s === 'string' && s !== '';
    const text = shared.slotVal(this.shadowRoot, 'text-droparea');
    const textHasBrowse = shared.slotVal(this.shadowRoot, 'text-droparea-with-browse');
    const link = shared.slotVal(this.shadowRoot, 'text-droparea-with-browse-link');

    let browseLabelHtml = '';
    if (!toBool(hasBrowse)) {
      browseLabelHtml = `<ids-text class="inline">${text}</ids-text>`;
    } else {
      const textArray = textHasBrowse.split('{browseLink}');
      if (textArray.length === 2) {
        browseLabelHtml = `
          <ids-text class="inline">${textArray[0]}</ids-text>
          <ids-hyperlink part="link" class="inline hyperlink">${link}</ids-hyperlink>
          <ids-text class="inline">${textArray[1]}</ids-text>`;
      } else {
        browseLabelHtml = textArray[0];
      }
    }
    return browseLabelHtml;
  }

  /**
   * Get droparea label html
   * @private
   * @returns {void}
   */
  setDropareaLabel() {
    /* istanbul ignore next */
    if (!this.shadowRoot) {
      return;
    }
    const hasBrowse = this.showBrowseLinkVal;
    const className = 'hidden';
    const sel = {
      noBrowse: '.no-browse-link',
      hasBrowse: '.has-browse-link',
    };
    const elem = {
      noBrowse: this.shadowRoot.querySelector(`${sel.noBrowse} .droparea-label`),
      hasBrowse: this.shadowRoot.querySelector(`${sel.hasBrowse} .droparea-label`),
      noBrowseContainer: this.shadowRoot.querySelector(sel.noBrowse),
      hasBrowseContainer: this.shadowRoot.querySelector(sel.hasBrowse),
    };
    if (hasBrowse) {
      elem.hasBrowse.innerHTML = this.getDropareaLabel(true);
      elem.noBrowseContainer.classList.add(className);
      elem.hasBrowseContainer.classList.remove(className);
    } else {
      elem.noBrowse.innerHTML = this.getDropareaLabel(null);
      elem.noBrowseContainer.classList.remove(className);
      elem.hasBrowseContainer.classList.add(className);
    }
  }

  /**
   * Show/Hide given error message
   * @private
   * @param {object} [opt] The error message options.
   * @returns {void}
   */
  errorMessage(opt) {
    const {
      /** @type {string} */ error, // The error message
      /** @type {string} */ data, // The data to show with message if any
      /** @type {boolean} */ remove // If set true, will remove error message
    } = opt;
    const errorarea = this.shadowRoot?.querySelector('.errorarea');
    errorarea?.classList.remove('has-error');
    errorarea.innerHTML = '';
    if (!remove) {
      const disabled = this.disabled ? ` disabled="true"` : '';
      let dataHtml = '';
      if (data) {
        dataHtml = `
          <div class="error-data-container">
            <ids-text class="error-data">${data}</ids-text>
          </div>`;
      }
      const html = `
        <div class="status">
          <ids-alert class="errored" icon="error-solid"${disabled}></ids-alert>
        </div>
        <div class="error-row">
          <ids-text class="error-msg">${error}</ids-text>
          ${dataHtml}
        </div>
      `;
      errorarea?.classList.add('has-error');
      errorarea?.insertAdjacentHTML('afterbegin', html);
    }
  }

  /**
   * Get status filter files
   * @private
   * @param {string} status The status
   * @returns {Array} The filter files
   */
  statusFiles(status) {
    return this.files.filter((/** @type {any} */ file) => file.status === status);
  }

  /**
   * Set Disabled
   * NOTE: Making Disabled while In-Process uploading, will NOT stop uploading files.
   * @private
   * @returns {void}
   */
  setDisabled() {
    const rootEl = this.shadowRoot.querySelector('.ids-upload-advanced');
    const alertError = this.shadowRoot.querySelector('.errorarea .status ids-alert');
    const link = this.shadowRoot.querySelector('ids-hyperlink');

    /** @type {any} */
    const uiElemArr = [].slice.call(this.shadowRoot.querySelectorAll('ids-upload-advanced-file'));
    const attr = (/** @type {any} */ el, /** @type {any} */ val) => {
      if (val) {
        el?.setAttribute(attributes.DISABLED, val.toString());
      } else {
        el?.removeAttribute(attributes.DISABLED);
      }
    };
    const val = stringUtils.stringToBool(this.disabled);
    if (val) {
      attr(this.fileInput, val);
      attr(alertError, val);
      uiElemArr.forEach((/** @type {any} */ uiElem) => attr(uiElem, val));
      rootEl?.classList.add(attributes.DISABLED);
      link?.setAttribute(attributes.DISABLED, 'true');
    } else {
      attr(this.fileInput, null);
      attr(alertError, null);
      uiElemArr.forEach((/** @type {any} */ uiElem) => attr(uiElem, null));
      rootEl?.classList.remove(attributes.DISABLED);
      link?.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * Get error value
   * @private
   * @param {string} error The error
   * @returns {string} The error value
   */
  getErrorValue(error) {
    const isInSlot = Object.values(shared.ERRORS).indexOf(error) > -1;
    if (isInSlot) {
      return error === shared.ERRORS.errorMaxFiles
        ? this.errorMaxFilesVal : shared.slotVal(this.shadowRoot, error);
    }
    return error || '';
  }

  /**
   * Check if file type or extension is allowed to accept
   * @private
   * @param {object} file to check types
   * @returns {boolean} true if allowed to uploaded
   */
  validateAcceptFile(file) {
    const fileExt = file.name.match(/\.[^\.]*$|$/)[0]; // eslint-disable-line
    const sel = this.accept?.replace(/[, ]+/g, '|')?.replace(/\/\*/g, '/.*');
    const re = new RegExp(`^(${sel})$`, 'i');
    if (this.accept && !(re.test(file.type) || re.test(fileExt))) {
      return false;
    }
    return true;
  }

  /**
   * Check for all type of validation requird before upload
   * @private
   * @param {object} file The file to check
   * @returns {object} The result of validation isValid: true|false, error: msg if false
   */
  validation(file) {
    const inProcess = this.inProcess.length;
    const completed = inProcess + this.completed.length;
    let r = { isValid: true };

    if (typeof this.send !== 'function' && !this.url) {
      r = { isValid: false, error: shared.ERRORS.errorUrl };
    } else if (completed >= this.maxFiles) {
      r = { isValid: false, error: shared.ERRORS.errorMaxFiles };
    } else if (inProcess >= this.maxFilesInProcess) {
      r = { isValid: false, error: shared.ERRORS.errorMaxFilesInProcess };
    } else if (!this.validateAcceptFile(file)) {
      r = { isValid: false, error: shared.ERRORS.errorAcceptFileType };
    } else if (this.maxFileSize !== shared.DEFAULTS.maxFileSize
      && file.size > this.maxFileSize) {
      r = { isValid: false, error: shared.ERRORS.errorMaxFileSize };
    }
    return r;
  }

  /**
   * Read the file contents using HTML5 FormData()
   * @private
   * @param {object} files File object containing uploaded files.
   * @returns {void}
   */
  handleFileUpload(files) {
    const filesarea = this.shadowRoot?.querySelector('.filesarea');

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i];
      const validation = this.validation(file);
      const id = `file-${this.all.length}`;
      const args = { elem: this, value: 0, file, id }; // eslint-disable-line
      const html = this.fileTemplate
        .replace('{id}', id)
        .replace('{value}', '0')
        .replace('{file-name}', file.name)
        .replace('{size}', file.size);

      this.files.push(args);
      const fileNode = this.files[this.files.length - 1];
      filesarea?.insertAdjacentHTML('afterbegin', html);
      const uiElem = filesarea?.querySelector(`#${id}`);
      this.handleFileEvent(uiElem);
      if (validation.isValid) {
        // Good to upload
        fileNode.status = shared.STATUS.inProcess;
        const detail = {
          id,
          file,
          elem: this,
          size: file.size,
          sizeFormatted: shared.formatBytes(stringUtils.stringToNumber(file.size)),
          status: shared.STATUS.inProcess,
          value: '0'
        };
        this.triggerEvent('beginupload', uiElem, { detail });
        this.triggerEvent('beginupload', this, { detail });
        const formData = new FormData(); // use FormData API
        const paramName = this.paramName.replace('[]', '');
        formData.append(`${paramName}[]`, file);
        if (typeof this.send === 'function') {
          this.send(formData, uiElem);
        } else {
          this.sendByXHR(formData, uiElem);
        }
      } else {
        // Add file with error
        fileNode.status = shared.STATUS.errored;
        uiElem.error = validation.error;
      }
    }

    // Clear browse file input
    this.fileInput.value = null;
  }

  /**
   * Handle slotchange event
   * @private
   * @returns {void}
   */
  handleSlotchangeEvent() {
    const dropareaLabelSlotsName = [
      'text-droparea',
      'text-droparea-with-browse',
      'text-droparea-with-browse-link'
    ];
    dropareaLabelSlotsName.forEach((/** @type {any} */ slotName) => {
      const slot = this.shadowRoot?.querySelector(`slot[name="${slotName}"]`);
      this.onEvent('slotchange', slot, () => {
        this.setDropareaLabel();
      });
    });

    const xhrHeadersSlot = this.shadowRoot?.querySelector(`slot[name="xhr-headers"]`);
    this.onEvent('slotchange', xhrHeadersSlot, () => {
      this.setXhrHeaders();
    });
  }

  /**
   * Handle label click event
   * @private
   * @returns {void}
   */
  handleLabelClickEvent() {
    const label = this.shadowRoot?.querySelector('label');
    this.onEvent('click', label, (/** @type {any} */ e) => {
      const hasClass = (/** @type {string} */ c) => e.target?.classList?.contains(c);
      if (!(hasClass('hyperlink') || hasClass('file-input'))) {
        e.preventDefault();
      }
    });
  }

  /**
   * Handle fileInput change event
   * @private
   * @returns {void}
   */
  handleFileInputChangeEvent() {
    this.onEvent('change', this.fileInput, () => {
      this.handleFileUpload(this.fileInput.files);
    });
  }

  /**
   * Handle droparea dragenter event
   * @private
   * @returns {void}
   */
  handleDropareaDragenterEvent() {
    this.onEvent('dragenter', this.droparea, (/** @type {any} */ e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.disabled) {
        return;
      }
      this.triggerEvent('filesdragenter', this, { detail: { elem: this } });
      this.droparea.classList.add('hover');
    });
  }

  /**
   * Handle droparea dragover event
   * @private
   * @returns {void}
   */
  handleDropareaDragoverEvent() {
    this.onEvent('dragover', this.droparea, (/** @type {any} */ e) => {
      e.stopPropagation();
      e.preventDefault();
    });
  }

  /**
   * Handle droparea drop event
   * @private
   * @returns {void}
   */
  handleDropareaDropEvent() {
    this.onEvent('drop', this.droparea, (/** @type {any} */ e) => {
      e.preventDefault();
      if (this.disabled) {
        return;
      }
      this.droparea.classList.remove('hover');
      const files = e.dataTransfer.files;
      this.triggerEvent('filesdrop', this, { detail: { elem: this, files } });
      this.handleFileUpload(files);
    });
  }

  /**
   * Handle document drag-drop events
   * If the files are dropped outside the div, files will open in the browser window.
   * To avoid this prevent 'drop' event on document.
   * @private
   * @returns {void}
   */
  handleDocumentDragDropEvents() {
    const events = ['dragenter', 'dragover', 'drop'];
    events.forEach((eventName) => {
      this.onEvent(eventName, document, (/** @type {any} */ e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.type === 'dragover') {
          this.droparea.classList.remove('hover');
        }
      });
    });
  }

  /**
   * Handle file event
   * @private
   * @param {object} uiElem The ui element
   * @returns {void}
   */
  handleFileEvent(uiElem) {
    const events = ['error', 'complete', 'abort', 'closebuttonclick'];
    events.forEach((eventName) => {
      this.onEvent(eventName, uiElem, (/** @type {any} */ e) => {
        let target = {};
        for (let i = 0; i < this.files.length; i++) {
          if (uiElem.id === this.files[i].id) {
            this.files[i] = { ...this.files[i], ...e.detail };
            target = this.files[i];
          }
        }
        this.dispatchFileEvent(eventName, e, target.id, target.file);

        /* istanbul ignore next */
        if (/closebuttonclick|abort/g.test(eventName)) {
          uiElem?.remove();
        }
      });
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  handleEvents() {
    this.handleSlotchangeEvent();
    this.handleLabelClickEvent();
    this.handleFileInputChangeEvent();
    this.handleDropareaDragenterEvent();
    this.handleDropareaDragoverEvent();
    this.handleDropareaDropEvent();
    this.handleDocumentDragDropEvents();
  }

  /**
   * Get list of all added files
   * @returns {Array} list of all added files
   */
  get all() { return this.files; }

  /**
   * Get list of in process files
   * @returns {Array} list of in process files
   */
  get inProcess() {
    return this.statusFiles(shared.STATUS.inProcess);
  }

  /**
   * Get list of aborted files
   * @returns {Array} list of aborted files
   */
  get aborted() {
    return this.statusFiles(shared.STATUS.aborted);
  }

  /**
   * Get list of errored files
   * @returns {Array} list of errored files
   */
  get errored() {
    return this.statusFiles(shared.STATUS.errored);
  }

  /**
   * Get list of completed files
   * @returns {Array} list of completed files
   */
  get completed() {
    return this.statusFiles(shared.STATUS.completed);
  }

  /**
   * Get template for current slots to use in file element
   * @private
   * @returns {string} The slots template
   */
  get fileSlotsTemplate() {
    const slotNames = [
      'text-btn-cancel',
      'text-btn-close-error',
      'text-btn-remove',
      'error-accept-file-type',
      'error-max-files-in-process',
      'error-max-file-size',
      'error-url'
    ];
    let html = '';
    slotNames.forEach((/** @type {any} */ slotName) => {
      html += `<span slot="${slotName}">${shared.slotVal(this.shadowRoot, slotName)}</span>`;
    });
    html += `<span slot="error-max-files">${this.errorMaxFilesVal}</span>`;

    return html;
  }

  /**
   * Get template for file element
   * @private
   * @returns {string} The slots template
   */
  get fileTemplate() {
    return `
      <ids-upload-advanced-file id="{id}" value="{value}" file-name="{file-name}" size="{size}">
      ${this.fileSlotsTemplate}
      </ids-upload-advanced-file>
    `;
  }

  /**
   * Get error max files value
   * @private
   * @returns {string} The value of max files and error string
   */
  get errorMaxFilesVal() {
    const val = shared.slotVal(this.shadowRoot, 'error-max-files');
    return val.replace('{maxFiles}', this.maxFiles.toString());
  }

  /**
   * Get show browse link value
   * @private
   * @returns {boolean} true, if show browse link true or its null
   */
  get showBrowseLinkVal() {
    return this.showBrowseLink === null
      ? shared.DEFAULTS.showBrowseLink
      : stringUtils.stringToBool(this.showBrowseLink);
  }

  /**
   * Sets limit the file types to be uploaded
   * @param {string} value The accept value
   */
  set accept(value) {
    if (value) {
      this.setAttribute(attributes.ACCEPT, value.toString());
      this.fileInput?.setAttribute(attributes.ACCEPT, value.toString());
    } else {
      this.removeAttribute(attributes.ACCEPT);
      this.fileInput?.removeAttribute(attributes.ACCEPT);
    }
  }

  get accept() { return this.getAttribute(attributes.ACCEPT); }

  /**
   * Sets the whole element to disabled
   * @param {boolean|string} value The disabled value
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.setDisabled();
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   * Sets the icon to be use in main drop area
   * @param {string} value The icon value
   */
  set icon(value) {
    const icon = this.shadowRoot.querySelector('.icon');
    if (value) {
      this.setAttribute(attributes.ICON, value.toString());
      icon?.setAttribute(attributes.ICON, value.toString());
    } else {
      this.removeAttribute(attributes.ICON);
      icon?.setAttribute(attributes.ICON, shared.DEFAULTS.icon);
    }
  }

  get icon() {
    return this.getAttribute(attributes.ICON)
      || shared.DEFAULTS.icon;
  }

  /**
   * Sets the max file size in bytes
   * @param {number|string} value  The max-file-size value
   */
  set maxFileSize(value) {
    if (value) {
      this.setAttribute(attributes.MAX_FILE_SIZE, value.toString());
    } else {
      this.removeAttribute(attributes.MAX_FILE_SIZE);
    }
  }

  get maxFileSize() {
    return this.getAttribute(attributes.MAX_FILE_SIZE)
      || shared.DEFAULTS.maxFileSize;
  }

  /**
   * Sets the max number of files can be uploaded
   * @param {number|string} value The max-files value
   */
  set maxFiles(value) {
    if (value) {
      this.setAttribute(attributes.MAX_FILES, value.toString());
    } else {
      this.removeAttribute(attributes.MAX_FILES);
    }
  }

  get maxFiles() {
    return this.getAttribute(attributes.MAX_FILES)
      || shared.DEFAULTS.maxFiles;
  }

  /**
   * Sets the max number of files can be uploaded while in process
   * @param {number|string} value The max-files-in-process value
   */
  set maxFilesInProcess(value) {
    if (value) {
      this.setAttribute(attributes.MAX_FILES_IN_PROCESS, value.toString());
    } else {
      this.removeAttribute(attributes.MAX_FILES_IN_PROCESS);
    }
  }

  get maxFilesInProcess() {
    return this.getAttribute(attributes.MAX_FILES_IN_PROCESS)
      || shared.DEFAULTS.maxFilesInProcess;
  }

  /**
   * Sets the method to use component XMLHttpRequest method to send files
   * @param {string} value The method value
   */
  set method(value) {
    if (value) {
      this.setAttribute(attributes.METHOD, value.toString());
    } else {
      this.removeAttribute(attributes.METHOD);
    }
  }

  get method() {
    return this.getAttribute(attributes.METHOD)
      || shared.DEFAULTS.method;
  }

  /**
   * Sets the variable name to read from server
   * @param {string} value The param-name value
   */
  set paramName(value) {
    if (value) {
      this.setAttribute(attributes.PARAM_NAME, value.toString());
    } else {
      this.removeAttribute(attributes.PARAM_NAME);
    }
  }

  get paramName() {
    return this.getAttribute(attributes.PARAM_NAME)
      || shared.DEFAULTS.paramName;
  }

  /**
   * Sets a link to browse files to upload
   * @param {boolean|string} value The show-browse-link value
   */
  set showBrowseLink(value) {
    if (value) {
      this.setAttribute(attributes.SHOW_BROWSE_LINK, value.toString());
    } else {
      this.removeAttribute(attributes.SHOW_BROWSE_LINK);
    }
    this.setDropareaLabel();
  }

  get showBrowseLink() { return this.getAttribute(attributes.SHOW_BROWSE_LINK); }

  /**
   * Sets the url to use component XMLHttpRequest method to send files
   * @param {string} value The url value
   */
  set url(value) {
    if (value) {
      this.setAttribute(attributes.URL, value.toString());
    } else {
      this.removeAttribute(attributes.URL);
    }
  }

  get url() { return this.getAttribute(attributes.URL); }
}

export default IdsUploadAdvanced;
