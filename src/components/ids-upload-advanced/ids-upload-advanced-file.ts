import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { camelCase, stringToBool, stringToNumber } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-alert/ids-alert';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-progress-bar/ids-progress-bar';
import IdsUploadAdvancedShared from './ids-upload-advanced-shared';

import styles from './ids-upload-advanced-file.scss';

const Base = IdsLocaleMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS UploadAdvancedFile Component
 * @type {IdsUploadAdvancedFile}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the main container element
 * @part file-row - the file row element
 * @part status - the status element
 * @part not-started-icon - the not started icon element
 * @part in-process-icon - the in process icon element
 * @part completed-icon - the completed icon element
 * @part errored-icon - the errored icon element
 * @part file-name - the file name element
 * @part file-progress - the file progress element
 * @part btn-close - the  close button element
 * @part btn-close-icone - the  close button icon element
 * @part progress-row - the progress row element
 * @part error-row - the error row element
 */
@customElement('ids-upload-advanced-file')
@scss(styles)
export default class IdsUploadAdvancedFile extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.ERROR,
      attributes.FILE_NAME,
      attributes.SIZE,
      attributes.STATUS,
      attributes.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const toBool = stringToBool;
    const d = IdsUploadAdvancedShared.DEFAULTS;
    const disabled = toBool(this.disabled) ? ' disabled' : '';
    const hiddenArea = `
      <div class="hidden">
        <slot name="text-btn-cancel">${d.textBtnCancel || this.localeAPI.translate('UploadCancel')}</slot>
        <slot name="text-btn-close-error">${d.textBtnDismissError || this.localeAPI.translate('UploadDismissError')}</slot>
        <slot name="text-btn-remove">${d.textBtnRemove || this.localeAPI.translate('UploadRemoveFile')}</slot>
        <slot name="text-btn-start">${d.textBtnStartUpload || this.localeAPI.translate('UploadStart')}</slot>
        <slot name="text-droparea">${d.textDroparea || this.localeAPI.translate('UploadDropArea')}</slot>
        <slot name="text-droparea-with-browse">${d.textDropareaWithBrowse || this.localeAPI.translate('TextDropAreaWithBrowseLink')}</slot>
        <slot name="text-droparea-with-browse-link">${d.textDropareaWithBrowseLink || this.localeAPI.translate('UploadLink')}</slot>
        <slot name="text-progress-label">${d.textProgressLabel || this.localeAPI.translate('UploadProgressLabel')}</slot>
        <slot name="error-accept-file-type">${d.errorAcceptFileType || this.localeAPI.translate('UploadErrorAcceptedFileType')}</slot>
        <slot name="error-max-files">${d.errorMaxFiles || this.localeAPI.translate('UploadErrorMaxFiles')}</slot>
        <slot name="error-max-files-in-process">${d.errorMaxFilesInProcess || this.localeAPI.translate('UploadErrorMaxFilesInProgress')}</slot>
        <slot name="error-max-file-size">${d.errorMaxFileSize || this.localeAPI.translate('UploadErrorMaxFileSize')}</slot>
        <slot name="error-url">${d.errorUrl || this.localeAPI.translate('UploadErrorUrl')}</slot>
      </div>`;

    return `
      <div class="ids-upload-advanced-file${disabled}">
        ${hiddenArea}
        <div class="container" part="container">
          <div class="file-row" part="file-row">
            <div class="status" part="status">
              <ids-alert class="not-started" part="not-started-icon" icon="info"></ids-alert>
              <ids-alert class="in-process" part="in-process-icon" icon="in-progress"></ids-alert>
              <ids-alert class="completed" part="completed-icon" icon="success"></ids-alert>
              <ids-alert class="errored" part="errored-icon" icon="error"></ids-alert>
            </div>
            <div class="file-name" part="file-name"><span>${this.fileName}</span></div>
            <div class="file-progress" part="file-progress"><ids-text class="size">${this.sizeFormatted}</ids-text><div class="progress-text"><span class="bar">|</span><span class="percent">0%</span></div></div>
            <ids-button class="btn-close" part="btn-close">
              <span class="audible">${this.closeButtonText}</span>
              <ids-icon icon="close" size="xsmall" part="btn-close-icon"></ids-icon>
            </ids-button>
          </div>
          <div class="progress-row" part="progress-row">
            <ids-progress-bar class="progress-bar" label="${this.progressLabelText}" label-audible="true" value="${this.value || 0}"></ids-progress-bar>
          </div>
          <div class="error-row" part="error-row">
            <ids-text class="error-msg"></ids-text>
          </div>
        </div>
      </div>`;
  }

  /**
   * Dispatch event
   * @private
   * @param {string} eventName The event name
   * @param {object} e Actual event
   * @returns {void}
   */
  dispatchChangeEvent(eventName: string, e: any = null): void {
    this.triggerEvent(eventName, this, {
      detail: {
        elem: this,
        error: this.errorHtml,
        loaded: this.loaded,
        loadedFormatted: this.loadedFormatted,
        nativeEvent: e,
        size: this.size,
        sizeFormatted: this.sizeFormatted,
        status: this.status,
        value: this.value
      }
    });
  }

  /**
   * Toggle disabled
   * @private
   * @param {boolean|string} value If true will set `disabled`
   * @returns {void}
   */
  toggleDisabled(value: boolean | string): void {
    if (!this.shadowRoot) return;

    const el = {
      root: this.shadowRoot.querySelector('.ids-upload-advanced-file'),
      progress: this.shadowRoot.querySelector('ids-progress-bar'),
      btnClose: this.shadowRoot.querySelector('.btn-close'),
      alerts: [].slice.call(this.shadowRoot.querySelectorAll('.status ids-alert')),
    };
    const val = stringToBool(value);
    if (val) {
      el.root?.classList.add(attributes.DISABLED);
      el.progress?.setAttribute(attributes.DISABLED, val.toString());
      el.btnClose?.setAttribute(attributes.DISABLED, val.toString());
      el.alerts.forEach((alert: HTMLElement) => {
        alert?.setAttribute(attributes.DISABLED, val.toString());
      });
    } else {
      el.root?.classList.remove(attributes.DISABLED);
      el.progress?.removeAttribute(attributes.DISABLED);
      el.btnClose?.removeAttribute(attributes.DISABLED);
      el.alerts.forEach((alert: HTMLElement) => {
        alert?.removeAttribute(attributes.DISABLED);
      });
    }
  }

  /**
   * Set current status
   * @private
   * @returns {void}
   */
  setStatus(): void {
    if (this.status === IdsUploadAdvancedShared.STATUS.aborted) {
      return;
    }

    const rootEl = this.shadowRoot?.querySelector('.ids-upload-advanced-file');
    const progress = this.shadowRoot?.querySelector('ids-progress-bar');
    const btnStart = this.shadowRoot?.querySelector('.btn-start');
    const closeButtonTextEl = this.shadowRoot?.querySelector('.btn-close .audible');
    let value = stringToNumber((this.value as any));
    value = value > -1 ? value : 0;
    let shouldTrigger = true;

    if (btnStart && this.status !== IdsUploadAdvancedShared.STATUS.notStarted) {
      btnStart.remove();
    }
    if (this.error) {
      const errorMsg = this.shadowRoot?.querySelector('.error-row .error-msg');
      if (errorMsg) {
        errorMsg.innerHTML = this.errorHtml;
      }
      if (this.status === IdsUploadAdvancedShared.STATUS.errored) {
        shouldTrigger = false;
        this.dispatchChangeEvent('error');
      } else {
        this.status = IdsUploadAdvancedShared.STATUS.errored;
      }
    } else if (this.status === IdsUploadAdvancedShared.STATUS.notStarted) {
      if (!btnStart) {
        const progressRow = this.shadowRoot?.querySelector('.progress-row');
        progressRow?.insertAdjacentHTML('beforeend', `
          <ids-button class="btn-start">
            <span class="audible">${this.startButtonText}</span>
            <ids-icon icon="play" size="xsmall"></ids-icon>
          </ids-button>`);
      }
    } else if (value < 100) {
      this.status = IdsUploadAdvancedShared.STATUS.inProcess;
    }

    const progressText = this.shadowRoot?.querySelector('.progress-text');
    if (progressText) {
      const percentText = progressText.querySelector('.percent');
      if (percentText) percentText.textContent = `${Math.round(value)}%`;

      if (this.status === IdsUploadAdvancedShared.STATUS.completed) {
        progressText.remove();
      }
    }

    if (closeButtonTextEl) closeButtonTextEl.innerHTML = this.closeButtonText;
    progress?.setAttribute(attributes.VALUE, value.toString());
    progress?.setAttribute(attributes.LABEL, this.progressLabelText);
    rootEl?.classList.remove(...Object.values(IdsUploadAdvancedShared.STATUS));
    rootEl?.classList.add(this.status ?? '');

    if (shouldTrigger && this.status !== IdsUploadAdvancedShared.STATUS.inProcess) {
      const events: Record<string, string> = { notStarted: 'notstarted', errored: 'error', completed: 'complete' };
      if (this.status) this.dispatchChangeEvent(events[camelCase(this.status)]);
    }
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers(): void {
    this.onEvent('click', this.container, (e: any) => {
      const classList = e?.target?.classList;
      if (classList?.contains('btn-start')) {
        this.dispatchChangeEvent('startbuttonclick', e);
      }
      if (classList?.contains('btn-close')) {
        this.dispatchChangeEvent('closebuttonclick', e);
      }
    });
  }

  /**
   * Start uploading process
   * @returns {void}
   */
  start(): void {
    if (this.status === IdsUploadAdvancedShared.STATUS.notStarted) {
      this.dispatchChangeEvent('start');
    }
  }

  /**
   * Cancel upload and remove from files list
   * @returns {void}
   */
  cancel(): void {
    if (this.status === IdsUploadAdvancedShared.STATUS.notStarted) {
      this.dispatchChangeEvent('cancel');
    }
  }

  /**
   * Abort handler
   * @param {any} e The event
   * @returns {void}
   */
  abortHandler(e = null): void {
    if (this.status === IdsUploadAdvancedShared.STATUS.inProcess) {
      this.status = IdsUploadAdvancedShared.STATUS.aborted;
      this.dispatchChangeEvent('abort', e);
    }
  }

  /**
   * Progress handler
   * @param {any} e The event
   * @returns {void}
   */
  progressHandler(e: any): void {
    this.value = (e.loaded / e.total) * 100;
  }

  /**
   * Complete handler
   * @param {any} e The event
   * @returns {void}
   */
  completeHandler(e: any): void {
    if (e.target.readyState === 4 && e.target.status === 200) {
      this.value = '100';
      this.status = IdsUploadAdvancedShared.STATUS.completed;
      this.setStatus();
    } else {
      if (this.value === '100') {
        this.value = '0';
      }
      this.errorHandler(e);
    }
  }

  /**
   * Error handler
   * @param {any} e The event
   * @returns {void}
   */
  errorHandler(e: any): void {
    let err = 'Failed to upload, server issue';
    if (typeof e === 'string' && e !== '') {
      err = e;
    } else if (typeof e === 'object') {
      err = `${e.target.status} - ${e.target.statusText}`;
    }
    this.status = IdsUploadAdvancedShared.STATUS.errored;
    this.error = err;
  }

  /**
   * Get the bytes of the file is uploaded
   * @private
   * @returns {number} The close button text
   */
  get loaded(): number {
    const percent = stringToNumber(this.value);
    const total = stringToNumber(this.size);
    return (percent * total) / 100;
  }

  /**
   * Get the bytes loaded value formatted (for example 10M)
   * @private
   * @returns {string} The close button text
   */
  get loadedFormatted(): string { return IdsUploadAdvancedShared.formatBytes(this.loaded); }

  /**
   * Get formatted size value
   * @private
   * @returns {string} The close button text
   */
  get sizeFormatted(): string {
    return IdsUploadAdvancedShared.formatBytes(stringToNumber(this.size));
  }

  /**
   * Get text for close button
   * @private
   * @returns {string} The close button text
   */
  get closeButtonText(): string {
    let text = IdsUploadAdvancedShared.slotVal(this.shadowRoot, 'text-btn-cancel');
    if (this.status === IdsUploadAdvancedShared.STATUS.errored) {
      text = IdsUploadAdvancedShared.slotVal(this.shadowRoot, 'text-btn-close-error');
    } else if (this.status === IdsUploadAdvancedShared.STATUS.completed) {
      text = IdsUploadAdvancedShared.slotVal(this.shadowRoot, 'text-btn-remove');
    }
    return text;
  }

  /**
   * Get text for start button
   * @private
   * @returns {string} The start button text
   */
  get startButtonText(): string {
    return IdsUploadAdvancedShared.slotVal(this.shadowRoot, 'text-btn-start');
  }

  /**
   * Get text for progress label
   * @private
   * @returns {string} The progress label text
   */
  get progressLabelText(): string {
    return IdsUploadAdvancedShared.slotVal(this.shadowRoot, 'text-progress-label')
      .replace('{file-name}', this.fileName)
      .replace('{loaded}', this.loadedFormatted.toString())
      .replace('{size}', this.sizeFormatted.toString())
      .replace('{percent}', this.value?.toString());
  }

  /**
   * Get error html
   * @private
   * @returns {string} The error
   */
  get errorHtml(): string {
    const isInSlot = Object.values(IdsUploadAdvancedShared.ERRORS).indexOf((this.error as any)) > -1;
    return isInSlot ? IdsUploadAdvancedShared.slotVal(this.shadowRoot, (this.error as any)) : this.error;
  }

  /**
   * Sets the whole file element to disabled
   * @param {boolean|string} value If true will set disabled attribute
   */
  set disabled(value: string | boolean | null) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
    }

    this.toggleDisabled(val);
  }

  get disabled(): string | null { return this.getAttribute(attributes.DISABLED); }

  /**
   * Sets the file state to show there was an error during the file operations
   * @param {string} value error attribute
   */
  set error(value: string | null) {
    if (value) {
      this.setAttribute(attributes.ERROR, value.toString());
    } else {
      this.removeAttribute(attributes.ERROR);
    }
    this.setStatus();
  }

  get error(): string | null {
    return this.getAttribute(attributes.ERROR);
  }

  /**
   * Sets the file name
   * @param {string | null} value file-name attribute
   */
  set fileName(value: string | null) {
    if (value) {
      this.setAttribute(attributes.FILE_NAME, value.toString());
      const el = this.shadowRoot?.querySelector<HTMLElement>('.file-name span');
      if (el) el.innerHTML = this.fileName;
    } else {
      this.removeAttribute(attributes.FILE_NAME);
    }
  }

  get fileName(): string {
    return this.getAttribute(attributes.FILE_NAME) || '';
  }

  /**
   * Sets the file size in bytes
   * @param {string|number} value size attribute
   */
  set size(value: string | number | null) {
    if (value) {
      this.setAttribute(attributes.SIZE, value.toString());
      const el = this.shadowRoot?.querySelector('.size');
      if (el) el.innerHTML = this.sizeFormatted;
    } else {
      this.removeAttribute(attributes.SIZE);
    }
  }

  get size(): string | number | null {
    return this.getAttribute(attributes.SIZE);
  }

  /**
   * Sets the file status
   * @param {string} value status attribute
   */
  set status(value: string | undefined | null) {
    if (this.status === value) return;
    if (Object.values(IdsUploadAdvancedShared.STATUS).indexOf((value as string)) > -1) {
      this.setAttribute(attributes.STATUS, String(value));
    } else {
      this.removeAttribute(attributes.STATUS);
    }
    this.setStatus();
  }

  get status(): string | null {
    return this.getAttribute(attributes.STATUS);
  }

  /**
   * Sets the progress bar value
   * @param {string|number| null} val value attribute
   */
  set value(val: string | number | null) {
    if (val) {
      if (!this.status || this.status === IdsUploadAdvancedShared.STATUS.inProcess) {
        this.setAttribute(attributes.VALUE, val.toString());
      }
    } else {
      this.removeAttribute(attributes.VALUE);
    }
    this.setStatus();
  }

  get value(): string | number | null {
    return this.getAttribute(attributes.VALUE);
  }
}
