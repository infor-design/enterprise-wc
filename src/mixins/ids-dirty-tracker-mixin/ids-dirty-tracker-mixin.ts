import { attributes } from '../../core/ids-attributes';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';
import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';
import { IdsInputInterface } from '../../components/ids-input/ids-input-attributes';
import { LocaleMixinInterface } from '../ids-locale-mixin/ids-locale-mixin';

export interface DirtyTrackerHandler {
  onDirtyTrackerChange?(enabled: boolean): void;
}

type Constraints = IdsConstructor<EventsMixinInterface & DirtyTrackerHandler & LocaleMixinInterface>;

/**
 * Track changes on inputs elements and show a dirty indicator.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsDirtyTrackerMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.handleDirtyTracker();

    window.requestAnimationFrame(() => {
      this.resetDirtyTracker();
      this.#dirtyTrackerInitialized = true;
    });
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.DIRTY_TRACKER
    ];
  }

  #dirtyTrackerInitialized = false;

  dirty: any = {
    original: ''
  };

  isDirty = false;

  isCheckbox = false;

  isEditor = false;

  isRadioGroup = false;

  dirtyContainer?: HTMLElement | SVGElement | null;

  /**
   * Handle dirty tracker values
   * @returns {void}
   */
  handleDirtyTracker() {
    const thisAsInput = this as IdsInputInterface;
    this.isCheckbox = thisAsInput.input?.getAttribute('type') === 'checkbox';
    this.isEditor = !!thisAsInput.input?.classList.contains('source-textarea');
    this.isRadioGroup = !!thisAsInput.input?.classList.contains('ids-radio-group');

    if (`${this.dirtyTracker}`.toLowerCase() === 'true') {
      if (thisAsInput.input) {
        const val = this.valMethod(thisAsInput.input);
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
    const thisAsInput = this as IdsInputInterface;
    let icon = this.shadowRoot?.querySelector('.icon-dirty');
    if (!icon) {
      icon = document.createElement('ids-icon');
      icon.setAttribute('icon', 'dirty-filled');
      icon.setAttribute('size', this.tagName === 'IDS-CHECKBOX' || this.tagName === 'IDS-RADIO-GROUP' ? 'xsmall' : 'small');
      icon.setAttribute('part', 'dirty-tracker-icon');
      icon.className = 'icon-dirty';
      if (this.localeAPI?.isRTL()) icon?.setAttribute('dir', 'rtl');
      if (this.isCheckbox) {
        thisAsInput.labelEl?.appendChild(icon);
        this.dirtyContainer = thisAsInput.labelEl;
      } else if (this.isRadioGroup) {
        const refEl = this.shadowRoot?.querySelector('slot');
        thisAsInput.input?.insertBefore(icon, refEl);
        this.dirtyContainer = thisAsInput.input;
      } else if (this.isEditor) {
        this.dirtyContainer = this.shadowRoot?.querySelector('.editor-content');
        this.dirtyContainer?.appendChild(icon);
      } else if (this.tagName === 'IDS-DROPDOWN' || this.tagName === 'IDS-MULTISELECT') {
        this.dirtyContainer = thisAsInput.input?.fieldContainer;
        this.dirtyContainer?.prepend(icon);
      } else {
        thisAsInput.fieldContainer?.prepend(icon);
        this.dirtyContainer = thisAsInput.fieldContainer;
      }
    }
  }

  /**
   * Remove if dirty tracker icon exists
   * @private
   * @returns {void}
   */
  removeDirtyTrackerIcon() {
    const icon = this.dirtyContainer?.querySelector('.icon-dirty');
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
    let msg = (this as IdsInputInterface).labelEl?.querySelector('.msg-dirty');
    if (!msg) {
      msg = document.createElement('ids-text');
      msg.setAttribute('audible', 'true');
      msg.className = 'msg-dirty';
      msg.innerHTML = ', Modified';
      (this as IdsInputInterface).labelEl?.appendChild(msg);
    }
  }

  /**
   * Remove if dirty tracker msg exists
   * @private
   * @returns {void}
   */
  removeDirtyTrackerMsg() {
    let msg = (this as IdsInputInterface).labelEl?.querySelector('.msg-dirty');
    if (msg) {
      msg.remove();
    }
    msg = (this as IdsInputInterface).input?.shadowRoot?.querySelector('.icon-dirty');
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
  valMethod(el: any) {
    const thisAsInput = this as IdsInputInterface;
    let r;
    if (this.isRadioGroup) {
      r = thisAsInput.checked;
    } else if (this.isCheckbox) {
      r = `${thisAsInput.checked}`.toLowerCase() === 'true';
    } else if (this.isEditor) {
      r = thisAsInput.value;
    } else {
      r = el?.value;
    }
    return r;
  }

  /**
   * Set dirtyTracker
   * @private
   * @param {string} val The current element value
   * @returns {void}
   */
  setDirtyTracker(val?: string) {
    if (typeof val === 'undefined') {
      this.handleDirtyTracker();
      return;
    }

    this.isDirty = this.dirty?.original !== val;
    if (this.isDirty) {
      this.appendDirtyTrackerMsg();
      this.appendDirtyTrackerIcon();
      this.#triggerDirtyEvent('dirty');
    } else {
      this.removeDirtyTrackerMsg();
      this.removeDirtyTrackerIcon();
      this.#triggerDirtyEvent('pristine');
    }
  }

  /**
   * Handle dirty tracker events
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  dirtyTrackerEvents(option = '') {
    const thisAsInput = this as IdsInputInterface;
    if ((this as IdsInputInterface).input) {
      const eventName = 'change.dirtytrackermixin';
      if (option === 'remove') {
        const handler = this?.handledEvents?.get(eventName);
        if (handler && handler.target === thisAsInput.input) {
          this.offEvent(eventName, thisAsInput.input);
        }
      } else {
        this.offEvent(eventName);
        this.onEvent(eventName, thisAsInput.input, () => {
          const val = this.valMethod(thisAsInput.input);
          this.setDirtyTracker(val);
        });
      }
    }
  }

  /** Handle Languages Changes */
  onLanguageChange = () => {
    const icon = this.dirtyContainer?.querySelector('.icon-dirty');
    if (this.localeAPI?.isRTL()) icon?.setAttribute('dir', 'rtl');
    else icon?.removeAttribute('dir');
  };

  /**
   * Reset dirty tracker
   * @returns {void}
   */
  resetDirtyTracker() {
    if (this.dirty) {
      this.removeDirtyTrackerIcon();
      this.removeDirtyTrackerMsg();
      this.dirty = { original: this.valMethod((this as IdsInputInterface).input) };
    } else {
      this.handleDirtyTracker();
    }
    this.isDirty = false;
    this.#triggerDirtyEvent('afterresetdirty');
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
   * Runs optional callback, if possible
   * @private
   * @returns {void}
   */
  #onDirtyTrackerChange() {
    if (typeof this.onDirtyTrackerChange === 'function') {
      this.onDirtyTrackerChange(this.dirtyTracker);
    }
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

    this.#onDirtyTrackerChange();
    this.handleDirtyTracker();
  }

  get dirtyTracker() { return stringToBool(this.getAttribute(attributes.DIRTY_TRACKER)); }

  #triggerDirtyEvent(name: 'dirty' | 'pristine' | 'afterresetdirty') {
    if (!this.#dirtyTrackerInitialized) return;

    this.triggerEvent(name, this, {
      detail: {
        elem: this,
        ...this.dirty,
        isDirty: this.isDirty
      }
    });
  }
};

export default IdsDirtyTrackerMixin;
