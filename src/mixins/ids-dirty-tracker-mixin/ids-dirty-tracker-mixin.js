import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

/**
 * Track changes on inputs elements and show a dirty indicator.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsDirtyTrackerMixin = (superclass) => class extends superclass {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.handleDirtyTracker();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.DIRTY_TRACKER
    ];
  }

  isCheckbox = false;

  isEditor = false;

  isRadioGroup = false;

  /**
   * Handle dirty tracker values
   * @returns {void}
   */
  handleDirtyTracker() {
    this.isCheckbox = this.input?.getAttribute('type') === 'checkbox';
    this.isEditor = this.input?.classList.contains('source-textarea');
    this.isRadioGroup = this.input?.classList.contains('ids-radio-group');

    if (`${this.dirtyTracker}`.toLowerCase() === 'true') {
      if (this.input) {
        const val = this.valMethod(this.input);
        this.dirty = { original: val };
        this.dirtyTrackerEvents();
      }
    } else {
      this.destroyDirtyTracker();
    }
  }

  /**
   * Check if dirty tracker icon exists if not add it
   * @private
   * @returns {void}
   */
  appendDirtyTrackerIcon() {
    let icon = this.shadowRoot.querySelector('.icon-dirty');
    if (!icon) {
      icon = document.createElement('ids-icon');
      icon.setAttribute('icon', 'dirty');
      icon.setAttribute('size', 'small');
      icon.className = 'icon-dirty';
      if (this.isCheckbox) {
        this.labelEl?.appendChild(icon);
      } else if (this.isRadioGroup) {
        const refEl = this.shadowRoot.querySelector('slot');
        this.input?.insertBefore(icon, refEl);
      } else if (this.isEditor) {
        this.shadowRoot.querySelector('.editor-content')?.appendChild(icon);
      } else {
        this.fieldContainer?.prepend(icon);
      }
    }
  }

  /**
   * Remove if dirty tracker icon exists
   * @private
   * @returns {void}
   */
  removeDirtyTrackerIcon() {
    const icon = this.shadowRoot.querySelector('.icon-dirty');
    if (icon) {
      icon.remove();
    }
  }

  /**
   * Check if dirty tracker msg exists if not add it
   * @private
   * @returns {void}
   */
  appendDirtyTrackerMsg() {
    let msg = this.labelEl?.querySelector('.msg-dirty');
    if (!msg) {
      msg = document.createElement('ids-text');
      msg.setAttribute('audible', true);
      msg.className = 'msg-dirty';
      msg.innerHTML = ', Modified';
      this.labelEl?.appendChild(msg);
    }
  }

  /**
   * Remove if dirty tracker msg exists
   * @private
   * @returns {void}
   */
  removeDirtyTrackerMsg() {
    let msg = this.labelEl?.querySelector('.msg-dirty');
    if (msg) {
      msg.remove();
    }
    msg = this.shadowRoot.querySelector('ids-input')?.shadowRoot?.querySelector('.icon-dirty');
    if (msg) {
      msg.remove();
    }
  }

  /**
   * Get the value or checked attribute if checkbox or radio
   * @private
   * @param {object} el .
   * @returns {any} element value
   */
  valMethod(el) {
    let r;
    if (this.isRadioGroup) {
      r = this.checked;
    } else if (this.isCheckbox) {
      r = `${this.checked}`.toLowerCase() === 'true';
    } else if (this.isEditor) {
      r = this.value;
    } else {
      r = el.value;
    }
    return r;
  }

  /**
   * Set dirtyTracker
   * @private
   * @param {string} val The current element value
   * @returns {void}
   */
  setDirtyTracker(val) {
    if (typeof val === 'undefined') {
      this.handleDirtyTracker();
      return;
    }

    this.isDirty = this.dirty?.original !== val;
    if (this.isDirty) {
      this.appendDirtyTrackerMsg();
      this.appendDirtyTrackerIcon();
    } else {
      this.removeDirtyTrackerMsg();
      this.removeDirtyTrackerIcon();
    }
  }

  /**
   * Handle dirty tracker events
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  dirtyTrackerEvents(option = '') {
    if (this.input) {
      const eventName = 'change.dirtytrackermixin';
      if (option === 'remove') {
        const handler = this?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.offEvent(eventName, this.input);
        }
      } else {
        this.offEvent(eventName);
        this.onEvent(eventName, this.input, () => {
          const val = this.valMethod(this.input);
          this.setDirtyTracker(val);
        });
      }
    }
  }

  /**
   * Reset dirty tracker
   * @returns {void}
   */
  resetDirtyTracker() {
    if (this.dirty) {
      this.removeDirtyTrackerIcon();
      this.removeDirtyTrackerMsg();
      this.dirty = { original: this.valMethod(this.input) };
    } else {
      this.handleDirtyTracker();
    }
  }

  /**
   * Destroy dirty tracker
   * @returns {void}
   */
  destroyDirtyTracker() {
    this.dirtyTrackerEvents('remove');
    this.removeDirtyTrackerIcon();
    this.removeDirtyTrackerMsg();
    this.dirty = null;
  }

  /**
   * Set the dirty tracking feature on to indicate a changed field
   * @param {boolean|string} value If true will set `dirty-tracker` attribute
   */
  set dirtyTracker(value) {
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DIRTY_TRACKER, val.toString());
    } else {
      this.removeAttribute(attributes.DIRTY_TRACKER);
    }

    this.handleDirtyTracker();
  }

  get dirtyTracker() { return this.getAttribute(attributes.DIRTY_TRACKER); }
};

export default IdsDirtyTrackerMixin;
