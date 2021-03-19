import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-upload-advanced.scss';

// Mixins
import { IdsUploadAdvancedShared as shared } from './ids-upload-advanced-shared';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import IdsUploadAdvancedFile from './ids-upload-advanced-file';

/**
 * IDS UploadAdvanced Component
 * @type {IdsUploadAdvanced}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-upload-advanced')
@scss(styles)
class IdsUploadAdvanced extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.ACCEPT,
      props.DISABLED,
      props.ICON,
      props.MAX_FILE_SIZE,
      props.MAX_FILES,
      props.MAX_FILES_IN_PROCESS,
      props.PARAM_NAME,
      props.SHOW_BROWSE_LINK,
      props.URL
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
            <span class="droparea-label">${this.getDropareaLabel(true)}</span>
          </label>
        </div>
      </div>`;

    return `
      <div class="ids-upload-advanced${disabled}">
        ${hiddenArea}
        <div class="droparea">
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
    xhr.open('POST', this.url);
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

    // File abort
    uiElem?.addEventListener('abort', () => {
      xhr.abort();
    });
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
    const isValid = (/** @type {string} */ s) => typeof s === 'string' && s !== '';
    const text = shared.slotVal(this.shadowRoot, 'text-droparea');
    const textHasBrowse = shared.slotVal(this.shadowRoot, 'text-droparea-with-browse');
    const link = shared.slotVal(this.shadowRoot, 'text-droparea-with-browse-link');

    let browseLabelHtml = '';
    if (!toBool(hasBrowse)) {
      if (isValid(text)) {
        browseLabelHtml = `<ids-text class="inline">${text}</ids-text>`;
      }
    } else if (isValid(textHasBrowse) && isValid(link)) {
      const textArray = textHasBrowse.split('{browseLink}');
      if (textArray.length === 2) {
        browseLabelHtml = `
          <ids-text class="inline">${textArray[0]}</ids-text>
          <ids-text class="inline hyperlink">${link}</ids-text>
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
   * @param {boolean?} hasBrowse if true, use with browse link
   * @returns {void}
   */
  setDropareaLabel(hasBrowse) {
    if (!this.shadowRoot) {
      return;
    }
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
   * @param {string?} [opt.error=undefined] The error message
   * @param {string?} [opt.data=undefined] The data to show with message if any
   * @param {boolean?} [opt.remove=undefined] If set true, will remove error message
   * @returns {void}
   */
  errorMessage({ error, data, remove }) {
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
   * NOTE: Making `Disabled` while `In-Process`, will NOT stop uploading files in process.
   * @private
   * @returns {void}
   */
  setDisabled() {
    const rootEl = this.shadowRoot.querySelector('.ids-upload-advanced');
    const alertError = this.shadowRoot.querySelector('.errorarea .status ids-alert');
    /** @type {any} */
    const uiElemArr = [].slice.call(this.shadowRoot.querySelectorAll('ids-upload-advanced-file'));
    const attr = (/** @type {any} */ el, /** @type {any} */ val) => {
      if (val) {
        el?.setAttribute(props.DISABLED, val.toString());
      } else {
        el?.removeAttribute(props.DISABLED);
      }
    };
    const val = stringUtils.stringToBool(this.disabled);
    if (val) {
      attr(this.fileInput, val);
      attr(alertError, val);
      uiElemArr.forEach((/** @type {any} */ uiElem) => attr(uiElem, val));
      rootEl?.classList.add(props.DISABLED);
    } else {
      attr(this.fileInput, null);
      attr(alertError, null);
      uiElemArr.forEach((/** @type {any} */ uiElem) => attr(uiElem, null));
      rootEl?.classList.remove(props.DISABLED);
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
        this.setDropareaLabel(this.showBrowseLinkVal);
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
   * Get template for current file slots
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
   * Get file template
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
    const maxFiles = this.maxFiles !== null
      ? this.maxFiles : shared.DEFAULTS.maxFiles;
    return val.replace('{maxFiles}', maxFiles.toString());
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
   * Set `accept` attribute
   * @param {string} value `accept` attribute
   */
  set accept(value) {
    if (value) {
      this.setAttribute(props.ACCEPT, value.toString());
      this.fileInput?.setAttribute(props.ACCEPT, value.toString());
    } else {
      this.removeAttribute(props.ACCEPT);
      this.fileInput?.removeAttribute(props.ACCEPT);
    }
  }

  get accept() { return this.getAttribute(props.ACCEPT); }

  /**
   * Sets to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DISABLED, val.toString());
    } else {
      this.removeAttribute(props.DISABLED);
    }
    this.setDisabled();
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Sets the `param-name` attribute
   * @param {string} value `param-name` attribute
   */
  set paramName(value) {
    if (value) {
      this.setAttribute(props.PARAM_NAME, value.toString());
    } else {
      this.removeAttribute(props.PARAM_NAME);
    }
  }

  get paramName() {
    return this.getAttribute(props.PARAM_NAME)
      || shared.DEFAULTS.paramName;
  }

  /**
   * Sets the `icon` attribute (use for droparea)
   * @param {string} value `icon` attribute
   */
  set icon(value) {
    const icon = this.shadowRoot.querySelector('.icon');
    if (value) {
      this.setAttribute(props.ICON, value.toString());
      icon?.setAttribute(props.ICON, value.toString());
    } else {
      this.removeAttribute(props.ICON);
      icon?.setAttribute(props.ICON, shared.DEFAULTS.icon);
    }
  }

  get icon() {
    return this.getAttribute(props.ICON)
      || shared.DEFAULTS.icon;
  }

  /**
   * Sets the `max-file-size` attribute
   * @param {number|string} value `max-file-size` attribute
   */
  set maxFileSize(value) {
    if (value) {
      this.setAttribute(props.MAX_FILE_SIZE, value.toString());
    } else {
      this.removeAttribute(props.MAX_FILE_SIZE);
    }
  }

  get maxFileSize() {
    return this.getAttribute(props.MAX_FILE_SIZE)
      || shared.DEFAULTS.maxFileSize;
  }

  /**
   * Sets the `max-files` attribute
   * @param {number|string} value `max-files` attribute
   */
  set maxFiles(value) {
    if (value) {
      this.setAttribute(props.MAX_FILES, value.toString());
    } else {
      this.removeAttribute(props.MAX_FILES);
    }
  }

  get maxFiles() {
    return this.getAttribute(props.MAX_FILES)
      || shared.DEFAULTS.maxFiles;
  }

  /**
   * Sets the `max-files-in-process` attribute
   * @param {number|string} value `max-files-in-process` attribute
   */
  set maxFilesInProcess(value) {
    if (value) {
      this.setAttribute(props.MAX_FILES_IN_PROCESS, value.toString());
    } else {
      this.removeAttribute(props.MAX_FILES_IN_PROCESS);
    }
  }

  get maxFilesInProcess() {
    return this.getAttribute(props.MAX_FILES_IN_PROCESS)
      || shared.DEFAULTS.maxFilesInProcess;
  }

  /**
   * Sets to show browse link
   * @param {boolean|string} value If true will set `show-browse-link` attribute
   */
  set showBrowseLink(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.SHOW_BROWSE_LINK, val.toString());
    } else {
      this.removeAttribute(props.SHOW_BROWSE_LINK);
    }
    const v = value !== null ? val : shared.DEFAULTS.showBrowseLink;
    this.setDropareaLabel(v);
  }

  get showBrowseLink() { return this.getAttribute(props.SHOW_BROWSE_LINK); }

  /**
   * Sets the `url` attribute
   * @param {string} value `url` attribute
   */
  set url(value) {
    if (value) {
      this.setAttribute(props.URL, value.toString());
    } else {
      this.removeAttribute(props.URL);
    }
  }

  get url() { return this.getAttribute(props.URL); }
}

export default IdsUploadAdvanced;
