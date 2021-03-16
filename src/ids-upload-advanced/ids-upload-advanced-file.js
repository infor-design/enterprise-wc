import {
  IdsElement,
  customElement,
  scss,
  mix,
  props
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';

// @ts-ignore
import styles from './ids-upload-advanced-file.scss';
import IdsAlert from '../ids-alert/ids-alert';
import IdsTriggerButton from '../ids-trigger-button/ids-trigger-button';
import IdsProgress from '../ids-progress/ids-progress';
import { IdsStringUtils as stringUtils } from '../ids-base/ids-string-utils';
import { IdsUploadAdvancedShared as shared } from './ids-upload-advanced-shared';

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
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.DISABLED,
      props.ERROR,
      props.FILE_NAME,
      props.SIZE,
      props.VALUE
    ];
  }

  /**
   * Custom Element `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    this.handleEvents();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const toBool = stringUtils.stringToBool;
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
            <ids-text class="size">${this.sizeFormatted}</ids-text>
            <ids-button class="btn-close">
              <span slot="text" class="audible">${this.closeButtonText}</span>
              <ids-icon slot="icon" icon="close" size="small"></ids-icon>
            </ids-button>
          </div>
          <div class="progress-row">
            <ids-progress label="${this.progressLabelText}" label-audible="true" value="${this.value || 0}"></ids-progress>
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
      progress: this.shadowRoot.querySelector('ids-progress'),
      btnClose: this.shadowRoot.querySelector('.btn-close'),
      alerts: [].slice.call(this.shadowRoot.querySelectorAll('.status ids-alert')),
    };
    const val = stringUtils.stringToBool(value);
    if (val) {
      el.root?.classList.add(props.DISABLED);
      el.progress.setAttribute(props.DISABLED, val.toString());
      el.btnClose.setAttribute(props.DISABLED, val.toString());
      el.alerts.forEach((/** @type {any} */ alert) => {
        alert?.setAttribute(props.DISABLED, val.toString());
      });
    } else {
      el.root?.classList.remove(props.DISABLED);
      el.progress.removeAttribute(props.DISABLED);
      el.btnClose.removeAttribute(props.DISABLED);
      el.alerts.forEach((/** @type {any} */ alert) => {
        alert?.removeAttribute(props.DISABLED);
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
    const progress = this.shadowRoot.querySelector('ids-progress');
    const closeButtonTextEl = this.shadowRoot.querySelector('.btn-close .audible');
    let value = stringUtils.stringToNumber(this.value);
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

    closeButtonTextEl.innerHTML = this.closeButtonText;
    progress?.setAttribute(props.VALUE, value.toString());
    progress?.setAttribute(props.LABEL, this.progressLabelText);
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
    this.onEvent('click', btnClose, (/** @type {any} */ e) => {
      this.abortHandler();
      this.dispatchChangeEvent('closebuttonclick', e);
    });
  }

  /**
   * Handle events
   * @private
   * @returns {void}
   */
  handleEvents() {
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
   * Get the percent of the file is uploaded
   * @private
   * @returns {number} The close button text
   */
  get loaded() {
    const percent = stringUtils.stringToNumber(this.value);
    const total = stringUtils.stringToNumber(this.size);
    return (percent * total) / 100;
  }

  /**
   * Get the percent loaded value formatted (for example 10M)
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
    return shared.formatBytes(stringUtils.stringToNumber(this.size));
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
      .replace('{percent}', this.value);
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
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value) {
    const val = stringUtils.stringToBool(value);
    if (val) {
      this.setAttribute(props.DISABLED, val.toString());
    } else {
      this.removeAttribute(props.DISABLED);
    }
    this.toggleDisabled(value);
  }

  get disabled() { return this.getAttribute(props.DISABLED); }

  /**
   * Sets the `error` attribute
   * @param {string} value `error` attribute
   */
  set error(value) {
    if (value) {
      this.setAttribute(props.ERROR, value.toString());
    } else {
      this.removeAttribute(props.ERROR);
    }
    this.setStatus();
  }

  get error() {
    return this.getAttribute(props.ERROR);
  }

  /**
   * Sets the `file-name` attribute
   * @param {string} value `file-name` attribute
   */
  set fileName(value) {
    if (value) {
      this.setAttribute(props.FILE_NAME, value.toString());
      const el = this.shadowRoot.querySelector('.file-name span');
      el.innerHTML = this.fileName;
    } else {
      this.removeAttribute(props.FILE_NAME);
    }
  }

  get fileName() {
    return this.getAttribute(props.FILE_NAME) || '';
  }

  /**
   * Sets the `size` attribute
   * @param {string|number} value `size` attribute
   */
  set size(value) {
    if (value) {
      this.setAttribute(props.SIZE, value.toString());
      const el = this.shadowRoot.querySelector('.size');
      el.innerHTML = this.sizeFormatted;
    } else {
      this.removeAttribute(props.SIZE);
    }
  }

  get size() { return this.getAttribute(props.SIZE); }

  /**
   * Sets the `value` attribute
   * @param {string|?|number} val `value` attribute
   */
  set value(val) {
    if (val) {
      if (!this.status || this.status === shared.STATUS.inProcess) {
        this.setAttribute(props.VALUE, val.toString());
      }
    } else {
      this.removeAttribute(props.VALUE);
    }
    this.setStatus();
  }

  get value() {
    return this.getAttribute(props.VALUE);
  }
}

export default IdsUploadAdvancedFile;
