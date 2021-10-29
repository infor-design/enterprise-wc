import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

// Supporting Components
import styles from './ids-upload-advanced-file.scss';
import IdsAlert from '../ids-alert';
import IdsTriggerButton from '../ids-trigger-field';
import IdsProgressBar from '../ids-progress-bar';
import { IdsUploadAdvancedShared as shared } from './ids-upload-advanced-shared';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

/**
 * IDS UploadAdvancedFile Component
 * @type {IdsUploadAdvancedFile}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-upload-advanced-file')
@scss(styles)
class IdsUploadAdvancedFile extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.DISABLED,
      attributes.ERROR,
      attributes.FILE_NAME,
      attributes.SIZE,
      attributes.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.#attachEventHandlers();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const toBool = IdsStringUtils.stringToBool;
    const d = shared.DEFAULTS;
    const disabled = toBool(this.disabled) ? ' disabled' : '';
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
      </div>`;

    return `
      <div class="ids-upload-advanced-file${disabled}">
        ${hiddenArea}
        <div class="container">
          <div class="file-row">
            <div class="status">
              <ids-alert class="in-process" icon="in-progress-solid"></ids-alert>
              <ids-alert class="completed" icon="success-solid"></ids-alert>
              <ids-alert class="errored" icon="error-solid"></ids-alert>
            </div>
            <div class="file-name"><span>${this.fileName}</span></div>
            <div class="file-progress"><ids-text class="size">${this.sizeFormatted}</ids-text><div class="progress-text"><span class="bar">|</span><span class="percent">0%</span></div></div>
            <ids-button class="btn-close">
              <span slot="text" class="audible">${this.closeButtonText}</span>
              <ids-icon slot="icon" icon="close" size="xsmall"></ids-icon>
            </ids-button>
          </div>
          <div class="progress-row">
            <ids-progress-bar label="${this.progressLabelText}" label-audible="true" value="${this.value || 0}"></ids-progress-bar>
          </div>
          <div class="error-row">
            <ids-text class="error-msg"></ids-text>
          </div>
        </div>
      </div>`;
  }

  /**
   * Dispatch event
   * @private
   * @param  {string} eventName The event name
   * @param  {object} e Actual event
   * @returns {void}
   */
  dispatchChangeEvent(eventName, e = null) {
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
  toggleDisabled(value) {
    const el = {
      root: this.shadowRoot.querySelector('.ids-upload-advanced-file'),
      progress: this.shadowRoot.querySelector('ids-progress-bar'),
      btnClose: this.shadowRoot.querySelector('.btn-close'),
      alerts: [].slice.call(this.shadowRoot.querySelectorAll('.status ids-alert')),
    };
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      el.root?.classList.add(attributes.DISABLED);
      el.progress.setAttribute(attributes.DISABLED, val.toString());
      el.btnClose.setAttribute(attributes.DISABLED, val.toString());
      el.alerts.forEach((alert) => {
        alert?.setAttribute(attributes.DISABLED, val.toString());
      });
    } else {
      el.root?.classList.remove(attributes.DISABLED);
      el.progress.removeAttribute(attributes.DISABLED);
      el.btnClose.removeAttribute(attributes.DISABLED);
      el.alerts.forEach((alert) => {
        alert?.removeAttribute(attributes.DISABLED);
      });
    }
  }

  /**
   * Set current status
   * @private
   * @returns {void}
   */
  setStatus() {
    if (this.status === shared.STATUS.aborted) {
      return;
    }
    const rootEl = this.shadowRoot.querySelector('.ids-upload-advanced-file');
    const progress = this.shadowRoot.querySelector('ids-progress-bar');
    const closeButtonTextEl = this.shadowRoot.querySelector('.btn-close .audible');
    let value = IdsStringUtils.stringToNumber(this.value);
    value = value > -1 ? value : 0;
    let shouldTrigger = true;

    if (this.error) {
      const errorMsg = this.shadowRoot.querySelector('.error-row .error-msg');
      if (errorMsg) {
        errorMsg.innerHTML = this.errorHtml;
      }
      if (this.status === shared.STATUS.errored) {
        shouldTrigger = false;
      } else {
        this.status = shared.STATUS.errored;
      }
    } else if (value < 100) {
      this.status = shared.STATUS.inProcess;
    }

    const progressText = this.shadowRoot.querySelector('.progress-text');
    if (progressText) {
      const percentText = progressText.querySelector('.percent');
      percentText.textContent = `${Math.round(value)}%`;

      if (this.status === shared.STATUS.completed) {
        progressText.remove();
      }
    }

    closeButtonTextEl.innerHTML = this.closeButtonText;
    progress?.setAttribute(attributes.VALUE, value.toString());
    progress?.setAttribute(attributes.LABEL, this.progressLabelText);
    rootEl?.classList.remove(...Object.values(shared.STATUS));
    rootEl?.classList.add(this.status);

    if (shouldTrigger && this.status !== shared.STATUS.inProcess) {
      const events = { errored: 'error', completed: 'complete' };
      this.dispatchChangeEvent(events[this.status]);
    }
  }

  /**
   * Handle close button click event
   * @private
   * @returns {void}
   */
  handleBtnCloseClickEvent() {
    const btnClose = this.shadowRoot?.querySelector('.btn-close');
    this.onEvent('click', btnClose, (e) => {
      this.abortHandler();
      this.dispatchChangeEvent('closebuttonclick', e);
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.handleBtnCloseClickEvent();
  }

  /**
   * Abort handler
   * @param  {any} e The event
   * @returns {void}
   */
  abortHandler(e = null) {
    if (this.status === shared.STATUS.inProcess) {
      this.status = shared.STATUS.aborted;
      this.dispatchChangeEvent('abort', e);
    }
  }

  /**
   * Progress handler
   * @param  {any} e The event
   * @returns {void}
   */
  progressHandler(e) {
    this.value = (e.loaded / e.total) * 100;
  }

  /**
   * Complete handler
   * @param  {any} e The event
   * @returns {void}
   */
  completeHandler(e) {
    if (e.target.readyState === 4 && e.target.status === 200) {
      this.value = '100';
      this.status = shared.STATUS.completed;
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
   * @param  {any} e The event
   * @returns {void}
   */
  errorHandler(e) {
    let err = 'Failed to upload, server issue';
    if (typeof e === 'string' && e !== '') {
      err = e;
    } else if (typeof e === 'object') {
      err = `${e.target.status} - ${e.target.statusText}`;
    }
    this.status = shared.STATUS.error;
    this.error = err;
  }

  /**
   * Get the bytes of the file is uploaded
   * @private
   * @returns {number} The close button text
   */
  get loaded() {
    const percent = IdsStringUtils.stringToNumber(this.value);
    const total = IdsStringUtils.stringToNumber(this.size);
    return (percent * total) / 100;
  }

  /**
   * Get the bytes loaded value formatted (for example 10M)
   * @private
   * @returns {string} The close button text
   */
  get loadedFormatted() { return shared.formatBytes(this.loaded); }

  /**
   * Get formatted size value
   * @private
   * @returns {string} The close button text
   */
  get sizeFormatted() {
    return shared.formatBytes(IdsStringUtils.stringToNumber(this.size));
  }

  /**
   * Get text for close button
   * @private
   * @returns {string} The close button text
   */
  get closeButtonText() {
    let text = shared.slotVal(this.shadowRoot, 'text-btn-cancel');
    if (this.status === shared.STATUS.errored) {
      text = shared.slotVal(this.shadowRoot, 'text-btn-close-error');
    } else if (this.status === shared.STATUS.completed) {
      text = shared.slotVal(this.shadowRoot, 'text-btn-remove');
    }
    return text;
  }

  /**
   * Get text for progress label
   * @private
   * @returns {string} The progress label text
   */
  get progressLabelText() {
    return shared.slotVal(this.shadowRoot, 'text-progress-label')
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
  get errorHtml() {
    const isInSlot = Object.values(shared.ERRORS).indexOf(this.error) > -1;
    return isInSlot ? shared.slotVal(this.shadowRoot, this.error) : this.error;
  }

  /**
   * Sets the whole file element to disabled
   * @param {boolean|string} value If true will set disabled attribute
   */
  set disabled(value) {
    const val = IdsStringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
    } else {
      this.removeAttribute(attributes.DISABLED);
    }
    this.toggleDisabled(value);
  }

  get disabled() { return this.getAttribute(attributes.DISABLED); }

  /**
   * Sets the file state to show there was an error during the file operations
   * @param {string} value error attribute
   */
  set error(value) {
    if (value) {
      this.setAttribute(attributes.ERROR, value.toString());
    } else {
      this.removeAttribute(attributes.ERROR);
    }
    this.setStatus();
  }

  get error() {
    return this.getAttribute(attributes.ERROR);
  }

  /**
   * Sets the file name
   * @param {string} value file-name attribute
   */
  set fileName(value) {
    if (value) {
      this.setAttribute(attributes.FILE_NAME, value.toString());
      const el = this.shadowRoot.querySelector('.file-name span');
      el.innerHTML = this.fileName;
    } else {
      this.removeAttribute(attributes.FILE_NAME);
    }
  }

  get fileName() {
    return this.getAttribute(attributes.FILE_NAME) || '';
  }

  /**
   * Sets the file size in bytes
   * @param {string|number} value size attribute
   */
  set size(value) {
    if (value) {
      this.setAttribute(attributes.SIZE, value.toString());
      const el = this.shadowRoot.querySelector('.size');
      el.innerHTML = this.sizeFormatted;
    } else {
      this.removeAttribute(attributes.SIZE);
    }
  }

  get size() { return this.getAttribute(attributes.SIZE); }

  /**
   * Sets the progress bar value
   * @param {string|number} val value attribute
   */
  set value(val) {
    if (val) {
      if (!this.status || this.status === shared.STATUS.inProcess) {
        this.setAttribute(attributes.VALUE, val.toString());
      }
    } else {
      this.removeAttribute(attributes.VALUE);
    }
    this.setStatus();
  }

  get value() {
    return this.getAttribute(attributes.VALUE);
  }
}

export default IdsUploadAdvancedFile;
