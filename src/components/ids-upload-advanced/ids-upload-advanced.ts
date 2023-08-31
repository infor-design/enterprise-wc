import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import './ids-upload-advanced-file';
import '../ids-hyperlink/ids-hyperlink';
import IdsUploadAdvancedShared from './ids-upload-advanced-shared';

import styles from './ids-upload-advanced.scss';

// Supporting components
import '../ids-toolbar/ids-toolbar';
import '../ids-button/ids-button';

const shared = IdsUploadAdvancedShared;

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS UploadAdvanced Component
 * @type {IdsUploadAdvanced}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the main container element
 * @part label - the label element
 * @part link - the hyperlink element
 * @part filesarea - the files area element
 * @part errorarea - the error area element
 * @part error-status - the error status element
 * @part error-status-icon - the error status icon element
 * @part error-row - the error row element
 * @part btn-close-error - the close error button element
 * @part error-data-container - the error data container element
 * @part toolbararea - the toolbar area element
 * @part btn-start-all - the start all button element
 * @part btn-cancel-all - the cancel all button element
 */
@customElement('ids-upload-advanced')
@scss(styles)
export default class IdsUploadAdvanced extends Base {
  fileInput?: HTMLInputElement | null;

  droparea?: HTMLElement | null;

  files: any[] = [];

  xhrHeaders?: any[] | null;

  send?: (formData: any, uiElem: HTMLElement) => void;

  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.ACCEPT,
      attributes.AUTO_START,
      attributes.DISABLED,
      attributes.ICON,
      attributes.ICON_SIZE,
      attributes.MAX_FILE_SIZE,
      attributes.MAX_FILES,
      attributes.MAX_FILES_IN_PROCESS,
      attributes.METHOD,
      attributes.PARAM_NAME,
      attributes.SHOW_BROWSE_LINK,
      attributes.URL
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();
    this.fileInput = this.shadowRoot?.querySelector('.file-input');
    this.droparea = this.shadowRoot?.querySelector('.droparea');

    this.files = [];
    this.#attachEventHandlers();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    const toBool = stringToBool;
    const d = shared.DEFAULTS;
    const hiddenClass = (opt: boolean) => (opt ? ' hidden' : '');
    const accept = this.accept ? ` accept="${this.accept}"` : '';
    const disabled = toBool(this.disabled) ? ' disabled' : '';
    const multiple = Number(this.maxFilesInProcess) > 1 ? ' multiple' : '';
    const hiddenArea = `
      <div class="hidden">
        <slot name="text-btn-cancel">${d.textBtnCancel || this.localeAPI.translate('UploadCancel')}</slot>
        <slot name="text-btn-cancel-all">${d.textBtnCancelAll || this.localeAPI.translate('UploadCancelAll')}</slot>
        <slot name="text-btn-close-error">${d.textBtnDismissError || this.localeAPI.translate('UploadDismissError')}</slot>
        <slot name="text-btn-remove">${d.textBtnRemove || this.localeAPI.translate('UploadRemoveFile')}</slot>
        <slot name="text-btn-start-all">${d.textBtnStartUpload || this.localeAPI.translate('UploadStart')}</slot>
        <slot name="text-droparea">${d.textDroparea || this.localeAPI.translate('UploadDropArea')}</slot>
        <slot name="text-droparea-with-browse">${d.textDropareaWithBrowse || this.localeAPI.translate('TextDropAreaWithBrowseLink')}</slot>
        <slot name="text-droparea-with-browse-link">${d.textDropareaWithBrowseLink || this.localeAPI.translate('UploadLink')}</slot>
        <slot name="text-progress-label">${d.textProgressLabel || this.localeAPI.translate('UploadProgressLabel')}</slot>
        <slot name="error-accept-file-type">${d.errorAcceptFileType || this.localeAPI.translate('UploadErrorAcceptedFileType')}</slot>
        <slot name="error-max-files">${d.errorMaxFiles || this.localeAPI.translate('UploadErrorMaxFiles')}</slot>
        <slot name="error-max-files-in-process">${d.errorMaxFilesInProcess || this.localeAPI.translate('UploadErrorMaxFilesInProgress')}</slot>
        <slot name="error-max-file-size">${d.errorMaxFileSize || this.localeAPI.translate('UploadErrorMaxFileSize')}</slot>
        <slot name="error-url">${d.errorUrl || this.localeAPI.translate('UploadErrorUrl')}</slot>
        <slot name="error-xhr-headers">${d.errorXhrHeaders || this.localeAPI.translate('UploadErrorXHRHeaders')}</slot>
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
        <div class="errorarea" part="errorarea"></div>
        <div class="filesarea" part="filesarea"></div>
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
  sendByXHR(formData: any, uiElem: any): void {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', uiElem.progressHandler.bind(uiElem), false);
    xhr.addEventListener('load', uiElem.completeHandler.bind(uiElem), false);
    xhr.addEventListener('error', uiElem.errorHandler.bind(uiElem), false);
    xhr.addEventListener('abort', uiElem.abortHandler.bind(uiElem), false);
    xhr.open(this.method, this.url as string);
    xhr.setRequestHeader('param-name', this.paramName);

    if (this.xhrHeaders) {
      const isValid = (h: any) => (h && h.name !== '');
      this.xhrHeaders.forEach((h: any) => {
        if (isValid(h)) {
          xhr.setRequestHeader(h.name, h.value);
        }
      });
    }
    xhr.send(formData);

    uiElem?.addEventListener('abort', () => {
      xhr.abort(); // File abort
    });
    uiElem?.addEventListener('error', () => {
      xhr.abort(); // File abort, for arbitrary error
      this.setToolbar();
    });
  }

  /**
   * Set xhr headers value
   * @private
   * @returns {void}
   */
  setXhrHeaders(): void {
    const errorarea = this.shadowRoot?.querySelector('.errorarea');
    if (errorarea) errorarea.innerHTML = '';
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
   * @param {string} eventName The event name
   * @param {object} e Actual event
   * @param {string} id The id
   * @param {string} file The file
   * @returns {void}
   */
  dispatchFileEvent(eventName: string, e: any, id: string, file: string): void {
    this.triggerEvent(eventName, this, {
      detail: {
        id,
        file,
        elem: this,
        error: e.detail.error,
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
   * @param {boolean} hasBrowse if true, use with browse link
   * @returns {string} The html output
   */
  getDropareaLabel(hasBrowse?: boolean | null): string {
    const text = shared.slotVal(this.shadowRoot, 'text-droparea') || this.localeAPI.translate('UploadDropArea');
    const textHasBrowse = shared.slotVal(this.shadowRoot, 'text-droparea-with-browse') || this.localeAPI.translate('TextDropAreaWithBrowseLink');
    const link = shared.slotVal(this.shadowRoot, 'text-droparea-with-browse-link') || this.localeAPI.translate('UploadLink');

    let browseLabelHtml = '';
    if (!stringToBool(hasBrowse)) {
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
   * Set droparea label html
   * @private
   * @returns {void}
   */
  setDropareaLabel(): void {
    const hasBrowse = this.showBrowseLinkVal;
    const className = 'hidden';
    const sel = {
      noBrowse: '.no-browse-link',
      hasBrowse: '.has-browse-link',
    };
    const elem = {
      noBrowse: this.shadowRoot?.querySelector(`${sel.noBrowse} .droparea-label`),
      hasBrowse: this.shadowRoot?.querySelector(`${sel.hasBrowse} .droparea-label`),
      noBrowseContainer: this.shadowRoot?.querySelector(sel.noBrowse),
      hasBrowseContainer: this.shadowRoot?.querySelector(sel.hasBrowse),
    };
    if (hasBrowse) {
      if (elem.hasBrowse) elem.hasBrowse.innerHTML = this.getDropareaLabel(true);
      elem.noBrowseContainer?.classList.add(className);
      elem.hasBrowseContainer?.classList.remove(className);
    } else {
      if (elem.noBrowse) elem.noBrowse.innerHTML = this.getDropareaLabel(null);
      elem.noBrowseContainer?.classList.remove(className);
      elem.hasBrowseContainer?.classList.add(className);
    }
  }

  /**
   * Set an arbitrary error message
   * @param {any} opt The error message options.
   * @returns {void}
   */
  setError(opt: any = {}): void {
    const { message, fileNodes } = opt;
    if (message) {
      if (fileNodes) {
        const setErrorMessage = (n: any) => {
          const el: any = /ids-upload-advanced-file/gi.test(n.nodeName) ? n : n?.uiElem;
          if (el && (typeof el.status === 'undefined'
            || el.status === shared.STATUS.notStarted
            || el.status === shared.STATUS.inProcess
          )) {
            el.error = message;
          }
        };
        if (fileNodes.constructor === Array) {
          fileNodes.forEach((n: any) => setErrorMessage(n));
        } else {
          setErrorMessage(fileNodes);
        }
      } else {
        this.errorMessage({ error: message });
      }
    }
  }

  /**
   * Show/Hide given error message
   * @private
   * @param {any} opt The error message options.
   * @returns {void}
   */
  errorMessage(opt: any): void {
    const {
      error, // The error message
      data, // The data to show with message if any
      remove // If set true, will remove error message
    } = opt;
    const errorarea = this.shadowRoot?.querySelector('.errorarea');
    errorarea?.classList.remove('has-error');
    if (errorarea) errorarea.innerHTML = '';
    if (!remove) {
      const disabled = this.disabled ? ` disabled="true"` : '';
      const textCloseBtnError = shared.slotVal(this.shadowRoot, 'text-btn-close-error');
      let dataHtml = '';
      if (data) {
        dataHtml = `
          <div class="error-data-container" part="error-data-container">
            <ids-text class="error-data">${data}</ids-text>
          </div>`;
      }
      const html = `
        <div class="status" part="error-status">
          <ids-alert class="errored" icon="error" part="error-status-icon"${disabled}></ids-alert>
        </div>
        <div class="error-row" part="error-row">
          <ids-text class="error-msg">${error}</ids-text>
          ${dataHtml}
        </div>
        <div class="btn-close">
          <ids-button id="btn-close-error" part="btn-close-error">
            <span class="audible">${textCloseBtnError}</span>
            <ids-icon icon="close" size="xsmall"></ids-icon>
          </ids-button>
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
  statusFiles(status: string): Array<unknown> {
    return this.files.filter((file: any) => file.status === status);
  }

  /**
   * Set Disabled
   * NOTE: Making Disabled while In-Process uploading, will NOT stop uploading files.
   * @private
   * @returns {void}
   */
  setDisabled(): void {
    if (!this.shadowRoot) return;
    const rootEl = this.shadowRoot.querySelector('.ids-upload-advanced');
    const alertError = this.shadowRoot.querySelector('.errorarea .status ids-alert');
    const link = this.shadowRoot.querySelector('ids-hyperlink');
    const uiElemArr = [].slice.call(this.shadowRoot.querySelectorAll('ids-upload-advanced-file'));
    const attr = (el: any, val: any) => {
      if (val) {
        el?.setAttribute(attributes.DISABLED, val.toString());
      } else {
        el?.removeAttribute(attributes.DISABLED);
      }
    };
    const val = stringToBool(this.disabled);
    if (val) {
      attr(this.fileInput, val);
      attr(alertError, val);
      uiElemArr.forEach((uiElem) => attr(uiElem, val));
      rootEl?.classList.add(attributes.DISABLED);
      link?.setAttribute(attributes.DISABLED, 'true');
    } else {
      attr(this.fileInput, null);
      attr(alertError, null);
      uiElemArr.forEach((uiElem) => attr(uiElem, null));
      rootEl?.classList.remove(attributes.DISABLED);
      link?.removeAttribute(attributes.DISABLED);
    }
  }

  /**
   * Check if file type or extension is allowed to accept
   * @private
   * @param {any} file to check types
   * @returns {boolean} true if allowed to uploaded
   */
  validateAcceptFile(file: any): boolean {
    const fileExt = file.name.match(/\.[^\.]*$|$/)[0]; // eslint-disable-line
    const sel = this.accept?.replace(/[, ]+/g, '|')?.replace(/\/\*/g, '/.*');
    const re = new RegExp(`^(${sel})$`, 'i');
    if (this.accept && !(re.test(file.type) || re.test(fileExt))) {
      return false;
    }
    return true;
  }

  /**
   * Check for all type of validation required before upload
   * @private
   * @param {any} file The file to check
   * @returns {object} The result of validation isValid: true|false, error: msg if false
   */
  validation(file: any): any {
    const inProcess = this.inProcess.length;
    const completed = inProcess + this.completed.length;
    let r: any = { isValid: true };

    if (typeof this.send !== 'function' && !this.url) {
      r = { isValid: false, error: shared.ERRORS.errorUrl };
    } else if (completed >= Number(this.maxFiles)) {
      r = { isValid: false, error: shared.ERRORS.errorMaxFiles };
    } else if (inProcess >= Number(this.maxFilesInProcess)) {
      r = { isValid: false, error: shared.ERRORS.errorMaxFilesInProcess };
    } else if (!this.validateAcceptFile(file)) {
      r = { isValid: false, error: shared.ERRORS.errorAcceptFileType };
    } else if (Number(this.maxFileSize) !== shared.DEFAULTS.maxFileSize
      && file.size > this.maxFileSize) {
      r = { isValid: false, error: shared.ERRORS.errorMaxFileSize };
    }
    return r;
  }

  /**
   * Start given file node in to process
   * @private
   * @param {object} fileNode Filenode related to file element.
   * @returns {void}
   */
  startInProcess(fileNode: any): void {
    const status = fileNode?.status;
    if (typeof status === 'undefined' || status === shared.STATUS.notStarted) {
      const { id, file, uiElem } = fileNode;
      const detail = {
        id,
        file,
        elem: this,
        size: file.size,
        sizeFormatted: shared.formatBytes(stringToNumber(file.size)),
        status: shared.STATUS.inProcess,
        value: '0'
      };
      fileNode.status = shared.STATUS.inProcess;
      uiElem.status = shared.STATUS.inProcess;
      const formData = new FormData(); // use FormData API
      const paramName = this.paramName.replace('[]', '');
      formData.append(`${paramName}[]`, file);
      if (typeof this.send === 'function') {
        this.send(formData, uiElem);
      } else {
        this.sendByXHR(formData, uiElem);
      }
      this.triggerEvent('beginupload', uiElem, { detail });
      this.triggerEvent('beginupload', this, { detail });
    }
  }

  /**
   * Read the file contents using HTML5 FormData()
   * @private
   * @param {object} files File object containing uploaded files.
   * @returns {void}
   */
  handleFileUpload(files: any): void {
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
      const uiElem = filesarea?.querySelector<any>(`#${id}`);
      fileNode.uiElem = uiElem;
      this.handleFileEvent(uiElem);

      // Good to upload
      if (validation.isValid) {
        if (this.autoStart) {
          this.startInProcess(fileNode); // Automatic start
        } else {
          // Add to list only, it can start manually
          fileNode.status = shared.STATUS.notStarted;
          uiElem.status = shared.STATUS.notStarted;
          const detail = {
            id,
            file,
            elem: this,
            size: file.size,
            sizeFormatted: shared.formatBytes(stringToNumber(file.size)),
            status: shared.STATUS.inProcess,
            value: '0'
          };
          this.triggerEvent('notstartedupload', uiElem, { detail });
          this.triggerEvent('notstartedupload', this, { detail });
        }
      } else {
        // Add file with error
        fileNode.status = shared.STATUS.errored;
        uiElem.error = validation.error;
      }
    }

    this.setToolbar();

    // Clear browse file input
    if (this.fileInput) this.fileInput.value = '';
  }

  /**
   * Set toolbar
   * @private
   * @returns {void}
   */
  setToolbar(): void {
    const toolbarEl = this.shadowRoot?.querySelector('.toolbararea');
    if (this.notStarted.length > 0) {
      if (!toolbarEl) {
        const template = document.createElement('template');
        template.innerHTML = this.toolbarTemplate;

        const refEl = this.shadowRoot?.querySelector('.errorarea');
        if (refEl) this.container?.insertBefore(template.content.cloneNode(true), refEl);
      }
    } else {
      toolbarEl?.classList.add('before-remove-transition');
      this.onEvent('transitionend', toolbarEl, () => {
        toolbarEl?.remove();
      });
    }
  }

  /**
   * Handle slotchange event
   * @private
   * @returns {void}
   */
  handleSlotchangeEvent(): void {
    const dropareaLabelSlotsName = [
      'text-droparea',
      'text-droparea-with-browse',
      'text-droparea-with-browse-link'
    ];
    dropareaLabelSlotsName.forEach((slotName) => {
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
  handleLabelClickEvent(): void {
    const label = this.shadowRoot?.querySelector('label');
    this.onEvent('click', label, (e: any) => {
      const hasClass = (c: any) => e.target?.classList?.contains(c);
      if (!(hasClass('hyperlink') || hasClass('file-input'))) {
        e.preventDefault();
      }
    });
    const errorarea = this.shadowRoot?.querySelector('.errorarea');
    this.onEvent('click', errorarea, (e: any) => {
      const id = e.target?.getAttribute('id');
      if (id === 'btn-close-error') this.errorMessage({ remove: true });
    });
  }

  /**
   * Handle fileInput change event
   * @private
   * @returns {void}
   */
  handleFileInputChangeEvent(): void {
    this.onEvent('change', this.fileInput, () => {
      this.handleFileUpload(this.fileInput?.files);
    });
  }

  /**
   * Handle droparea dragenter event
   * @private
   * @returns {void}
   */
  handleDropareaDragenterEvent(): void {
    this.onEvent('dragenter', this.droparea, (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.disabled) {
        return;
      }
      this.triggerEvent('filesdragenter', this, { detail: { elem: this } });
      this.droparea?.classList.add('dragenter');
    });
  }

  /**
   * Handle droparea dragover event
   * @private
   * @returns {void}
   */
  handleDropareaDragoverEvent(): void {
    this.onEvent('dragover', this.droparea, (e: any) => {
      e.stopPropagation();
      e.preventDefault();
    });
  }

  /**
   * Handle droparea drop event
   * @private
   * @returns {void}
   */
  handleDropareaDropEvent(): void {
    this.onEvent('drop', this.droparea, (e: any) => {
      e.preventDefault();
      if (this.disabled) {
        return;
      }
      this.droparea?.classList.remove('dragenter');
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
  handleDocumentDragDropEvents(): void {
    const events = ['dragenter', 'dragover', 'drop'];
    events.forEach((eventName) => {
      this.onEvent(eventName, document, (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.type === 'dragover') {
          this.droparea?.classList.remove('dragenter');
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
  handleFileEvent(uiElem: any): void {
    const events = ['error', 'complete', 'abort', 'cancel', 'start', 'closebuttonclick', 'startbuttonclick'];
    events.forEach((eventName) => {
      this.onEvent(eventName, uiElem, (e: any) => {
        const target: any = { node: {}, idx: -1 };
        for (let i = 0; i < this.files.length; i++) {
          if (uiElem.id === this.files[i].id) {
            this.files[i] = { ...this.files[i], ...e.detail };
            target.node = this.files[i];
            target.idx = i;
          }
        }
        this.dispatchFileEvent(eventName, e, target.node.id, target.node.file);

        // Close button clicked
        if (/closebuttonclick|abort|cancel/g.test(eventName)) {
          uiElem?.abortHandler();
          uiElem?.remove();
          // Remove from files list
          if (target.node.status === shared.STATUS.notStarted) {
            this.files.splice(target.idx, 1);
          }
          this.setToolbar();
        }

        // Start button clicked
        if (/startbuttonclick|start/g.test(eventName)) {
          this.startInProcess(target.node);
          this.setToolbar();
        }

        // Error
        if (eventName === 'error') {
          this.setToolbar();
        }
      });
    });
  }

  /**
   * Handle toolbar events
   * @private
   * @returns {void}
   */
  handleToolbarEvents(): void {
    this.onEvent('selected', this.container, (e: any) => {
      const doAction = (action: string) => {
        this.notStarted.forEach((fileNode: any) => fileNode.uiElem[action]());
      };
      const id = e?.detail?.elem?.getAttribute('id');
      if (id === 'btn-start-all') doAction('start');
      if (id === 'btn-cancel-all') doAction('cancel');
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.handleSlotchangeEvent();
    this.handleLabelClickEvent();
    this.handleFileInputChangeEvent();
    this.handleDropareaDragenterEvent();
    this.handleDropareaDragoverEvent();
    this.handleDropareaDropEvent();
    this.handleDocumentDragDropEvents();
    this.handleToolbarEvents();

    this.onLocaleChange = () => {
      this.setDropareaLabel();
    };
  }

  /**
   * Get list of all added files
   * @returns {Array} list of all added files
   */
  get all(): Array<unknown> { return this.files; }

  /**
   * Get list of not started files
   * @returns {Array} list of not started files
   */
  get notStarted(): Array<unknown> {
    return this.statusFiles(shared.STATUS.notStarted);
  }

  /**
   * Get list of in process files
   * @returns {Array} list of in process files
   */
  get inProcess(): Array<unknown> {
    return this.statusFiles(shared.STATUS.inProcess);
  }

  /**
   * Get list of aborted files
   * @returns {Array} list of aborted files
   */
  get aborted(): Array<unknown> {
    return this.statusFiles(shared.STATUS.aborted);
  }

  /**
   * Get list of errored files
   * @returns {Array} list of errored files
   */
  get errored(): Array<unknown> {
    return this.statusFiles(shared.STATUS.errored);
  }

  /**
   * Get list of completed files
   * @returns {Array} list of completed files
   */
  get completed(): Array<unknown> {
    return this.statusFiles(shared.STATUS.completed);
  }

  /**
   * Get template for current slots to use in file element
   * @private
   * @returns {string} The slots template
   */
  get fileSlotsTemplate(): string {
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
    slotNames.forEach((slotName) => {
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
  get fileTemplate(): string {
    return `
      <ids-upload-advanced-file id="{id}" value="{value}" file-name="{file-name}" size="{size}">
      ${this.fileSlotsTemplate}
      </ids-upload-advanced-file>
    `;
  }

  /**
   * Get template for toolbar element
   * @private
   * @returns {string} The slots template
   */
  get toolbarTemplate(): string {
    const text = {
      start: shared.slotVal(this.shadowRoot, 'text-btn-start-all'),
      cancel: shared.slotVal(this.shadowRoot, 'text-btn-cancel-all'),
    };
    return `
      <div class="toolbararea" part="toolbararea">
        <ids-toolbar>
          <ids-toolbar-section type="buttonset" align="end">
            <ids-button id="btn-cancel-all" part="btn-cancel-all" role="button" no-padding>
              <span>${text.cancel}</span>
            </ids-button>
            <ids-button id="btn-start-all" part="btn-start-all" role="button" no-padding>
              <span>${text.start}</span>
            </ids-button>
          </ids-toolbar-section>
        </ids-toolbar>
      </div>
    `;
  }

  /**
   * Get error max files value
   * @private
   * @returns {string} The value of max files and error string
   */
  get errorMaxFilesVal(): string {
    const val = shared.slotVal(this.shadowRoot, 'error-max-files');
    return val.replace('{maxFiles}', this.maxFiles.toString());
  }

  /**
   * Get show browse link value
   * @private
   * @returns {boolean} true, if show browse link true or its null
   */
  get showBrowseLinkVal(): boolean {
    return this.showBrowseLink === null
      ? shared.DEFAULTS.showBrowseLink
      : stringToBool(this.showBrowseLink);
  }

  /**
   * Sets limit the file types to be uploaded
   * @param {string} value The accept value
   */
  set accept(value: string | null) {
    if (value) {
      this.setAttribute(attributes.ACCEPT, value.toString());
      this.fileInput?.setAttribute(attributes.ACCEPT, value.toString());
    } else {
      this.removeAttribute(attributes.ACCEPT);
      this.fileInput?.removeAttribute(attributes.ACCEPT);
    }
  }

  get accept(): string | null {
    return this.getAttribute(attributes.ACCEPT);
  }

  /**
   * Allow automatic start upload, after files have been dropped or added
   * @param {boolean|string|undefined} value The value
   */
  set autoStart(value: boolean | string | undefined) {
    if (typeof value === 'boolean' || typeof value === 'string') {
      this.setAttribute(attributes.AUTO_START, value.toString());
    } else {
      this.removeAttribute(attributes.AUTO_START);
    }
  }

  get autoStart(): boolean {
    const value = this.getAttribute(attributes.AUTO_START);
    return value !== null ? stringToBool(value) : shared.DEFAULTS.autoStart;
  }

  /**
   * Sets the whole element to disabled
   * @param {boolean|string} value The disabled value
   */
  set disabled(value: boolean | string | null) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.setDisabled();
  }

  get disabled(): string | null { return this.getAttribute(attributes.DISABLED); }

  /**
   * Sets the icon to be use in main drop area
   * @param {string | undefined} value The icon value
   */
  set icon(value: string | undefined) {
    const icon = this.shadowRoot?.querySelector('.icon');
    if (value) {
      this.setAttribute(attributes.ICON, value.toString());
      icon?.setAttribute(attributes.ICON, value.toString());
    } else {
      this.removeAttribute(attributes.ICON);
      icon?.setAttribute(attributes.ICON, shared.DEFAULTS.icon);
    }
  }

  get icon(): string {
    return this.getAttribute(attributes.ICON)
      || shared.DEFAULTS.icon;
  }

  /**
   * Sets the icon size to be use in main drop area
   * @param {string | undefined | null} value The icon size value
   */
  set iconSize(value: string | undefined | null) {
    const icon = this.shadowRoot?.querySelector('.icon');

    if (value) {
      this.setAttribute(attributes.ICON_SIZE, value.toString());
      icon?.setAttribute(attributes.SIZE, value.toString());
    } else {
      this.removeAttribute(attributes.ICON_SIZE);
      icon?.removeAttribute(attributes.SIZE);
    }
  }

  get iconSize(): string | null {
    return this.getAttribute(attributes.ICON_SIZE);
  }

  /**
   * Sets the max file size in bytes
   * @param {number|string} value  The max-file-size value
   */
  set maxFileSize(value: string | number | undefined) {
    if (value) {
      this.setAttribute(attributes.MAX_FILE_SIZE, value.toString());
    } else {
      this.removeAttribute(attributes.MAX_FILE_SIZE);
    }
  }

  get maxFileSize(): string | number {
    return this.getAttribute(attributes.MAX_FILE_SIZE) || shared.DEFAULTS.maxFileSize;
  }

  /**
   * Sets the max number of files can be uploaded
   * @param {string | number | null} value The max-files value
   */
  set maxFiles(value: string | number | null) {
    if (value) {
      this.setAttribute(attributes.MAX_FILES, value.toString());
    } else {
      this.removeAttribute(attributes.MAX_FILES);
    }
  }

  get maxFiles(): string | number {
    return this.getAttribute(attributes.MAX_FILES) || shared.DEFAULTS.maxFiles;
  }

  /**
   * Sets the max number of files can be uploaded while in process
   * @param {string | number | null} value The max-files-in-process value
   */
  set maxFilesInProcess(value: string | number | null) {
    if (value) {
      this.setAttribute(attributes.MAX_FILES_IN_PROCESS, value.toString());
    } else {
      this.removeAttribute(attributes.MAX_FILES_IN_PROCESS);
    }
  }

  get maxFilesInProcess(): string | number {
    return this.getAttribute(attributes.MAX_FILES_IN_PROCESS) || shared.DEFAULTS.maxFilesInProcess;
  }

  /**
   * Sets the method to use component XMLHttpRequest method to send files
   * @param {string | undefined} value The method value
   */
  set method(value: string | undefined) {
    if (value) {
      this.setAttribute(attributes.METHOD, value.toString());
    } else {
      this.removeAttribute(attributes.METHOD);
    }
  }

  get method(): string {
    return this.getAttribute(attributes.METHOD) || shared.DEFAULTS.method;
  }

  /**
   * Sets the variable name to read from server
   * @param {string | undefined} value The param-name value
   */
  set paramName(value: string | undefined) {
    if (value) {
      this.setAttribute(attributes.PARAM_NAME, value.toString());
    } else {
      this.removeAttribute(attributes.PARAM_NAME);
    }
  }

  get paramName(): string {
    return this.getAttribute(attributes.PARAM_NAME)
      || shared.DEFAULTS.paramName;
  }

  /**
   * Sets a link to browse files to upload
   * @param {boolean|string} value The show-browse-link value
   */
  set showBrowseLink(value: boolean | string | null) {
    if (value) {
      this.setAttribute(attributes.SHOW_BROWSE_LINK, value.toString());
    } else {
      this.removeAttribute(attributes.SHOW_BROWSE_LINK);
    }
    this.setDropareaLabel();
  }

  get showBrowseLink(): string | null {
    return this.getAttribute(attributes.SHOW_BROWSE_LINK);
  }

  /**
   * Sets the url to use component XMLHttpRequest method to send files
   * @param {string} value The url value
   */
  set url(value: string | null) {
    if (value) {
      this.setAttribute(attributes.URL, value.toString());
    } else {
      this.removeAttribute(attributes.URL);
    }
  }

  get url(): string | null {
    return this.getAttribute(attributes.URL);
  }
}
