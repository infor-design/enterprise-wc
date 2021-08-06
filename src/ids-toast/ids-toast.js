import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes,
  stringUtils,
  xssUtils
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin,
  IdsLocaleMixin
} from '../ids-mixins';

import { IdsToastShared as shared } from './ids-toast-shared';
import { IdsToastMessage } from './ids-toast-message';
import styles from './ids-toast.scss';

import { IdsDraggable } from '../ids-draggable';

/**
 * IDS Toast Component
 * @type {IdsToast}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @mixes IdsLocaleMixin
 * @part toast - the toast element
 */
@customElement('ids-toast')
@scss(styles)
class IdsToast extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin,
    IdsLocaleMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();

    // Respond to parent changing language
    this.offEvent('languagechange.toast');
    this.onEvent('languagechange.toast', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
    });
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ALLOW_LINK,
      attributes.AUDIBLE,
      attributes.DRAGGABLE,
      attributes.LANGUAGE,
      attributes.LOCALE,
      attributes.POSITION,
      attributes.PROGRESS_BAR,
      attributes.SAVE_POSITION,
      attributes.TIMEOUT,
      attributes.UNIQUE_ID,
      shared.ATTRIBUTE_TOAST_DESTROY_AFTER_TIMEOUT
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const d = shared.DEFAULTS;
    const hiddenArea = `
      <div class="hidden">
        <slot name="title">${d.title}</slot>
        <slot name="message">${d.message}</slot>
        <slot name="close-button-label">${d.closeButtonLabel}</slot>
      </div>`;
    return `<div class="ids-toast">${hiddenArea}</div>`;
  }

  /**
   * Map of toast massages added in container, to keep track each toast.
   * @private
   * @type {Map<HTMLElement, object>}
   */
  #toastsMap = new Map();

  /**
   * Toatl number of toast massages added in container.
   * @private
   * @type {number}
   */
  #toastsCounter = 0;

  /**
   * Clear the saved position from local storage
   * @param {string|undefined} uniqueId If undefined, will use Internal attached.
   * @returns {void}
   */
  clearPosition(uniqueId) {
    const clearIds = [];
    if (this.#canUseLocalStorage()) {
      const removeId = uniqueId || this.uniqueId;
      const savedKay = shared.id(removeId);
      const found = Object.keys(localStorage).some((key) => key === savedKay);
      if (found) {
        localStorage.removeItem(savedKay);
        clearIds.push(removeId);
      }
    }
    this.triggerEvent(shared.EVENTS.clearPosition, this, {
      detail: { elem: this, clearIds }
    });
    this.#removeFromDom();
  }

  /**
   * Clear all toast related saved position from local storage
   * @returns {void}
   */
  clearPositionAll() {
    const clearIds = [];
    if (this.#canUseLocalStorage()) {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        const temp = '{idstempclearstorage}';
        const tempId = shared.id(temp);
        // from: 'ids-toast-container-{idstempclearstorage}-usersettings-position'
        // to: '^ids-toast-container-(.+)-usersettings-position$'
        const regexFound = new RegExp(`^${tempId.replace(temp, '(.+)')}$`, 'g');
        if (regexFound.test(key)) {
          const parts = tempId.split(temp);
          // from: ['ids-toast-container-', '-usersettings-position']
          // to: '^ids-toast-container-|-usersettings-position$'
          const regexExtract = new RegExp(`^${parts.join('|')}$`, 'g');
          const removeId = key.replace(regexExtract, '');
          localStorage.removeItem(key);
          clearIds.push(removeId);
        }
      });
    }
    this.triggerEvent(shared.EVENTS.clearPosition, this, {
      detail: { elem: this, clearIds }
    });
    this.#removeFromDom();
  }

  /**
   * Get message element by given message id.
   * @param {string} messageId A message id to use.
   * @returns {HTMLElement|undefined} The message element
   */
  messageElem(messageId) {
    const attributeKey = shared.ATTRIBUTE_MESSAGE_ID;
    return this.shadowRoot.querySelector(`[${attributeKey}="${messageId}"]`);
  }

  /**
   * Show the toast message.
   * @param {object} [options] incoming options
   * @param {string} [options.title] Text that is displayed in the Toast's title.
   * @param {string} [options.message] Text that's displayed in the Toast's body.
   * @param {string} [options.messageId] The toast message id.
   * @param {string} [options.closeButtonLabel] Text that's use for close button label.
   * @param {boolean} [options.allowLink] allows user to put links in the toast message.
   * @param {boolean} [options.audible] Let toast to be invisible on the screen.
   * @param {boolean} [options.progressBar] To have a visible progress bar.
   * @param {number} [options.timeout] The amount of time, the toast should be present on-screen.
   * @returns {void}
   */
  show(options) {
    const opt = stringUtils.isObject(options) ? options : {};
    opt.messageId = this.#messageId(opt.messageId);
    const toast = this.#toast(opt);
    this.#toastsMap.set(toast, opt);
    const toastContainer = this.toastContainer();
    toastContainer?.appendChild(toast);
    this.#handleRemoveToastMessage(toast);
    this.#createDraggable(toastContainer);
    this.triggerEvent(shared.EVENTS.addMessage, this, {
      detail: { elem: toast, messageId: opt.messageId, options: opt }
    });
  }

  /**
   * Get toast container
   * @returns {object} The toast container
   */
  toastContainer() {
    let toastContainer = this.shadowRoot.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('ids-draggable');
      toastContainer.setAttribute('disabled', 'true');
      toastContainer.classList.add('toast-container', this.position);
      this.container.appendChild(toastContainer);

      // this.shadowRoot.insertBefore(toastContainer, this.shadowRoot.firstChild);
    }
    return toastContainer;
  }

  /**
   * Create title slot element
   * @private
   * @param {string} value The text value.
   * @returns {HTMLElement} The creared element.
   */
  #title(value) {
    const title = value ? value.toString() : this.#slotVal('title');
    const titleEl = document.createElement('span');
    titleEl.setAttribute('slot', 'title');
    titleEl.innerHTML = xssUtils.stripHTML(title);
    return titleEl;
  }

  /**
   * Create message slot element
   * @private
   * @param {string} value The text value.
   * @param {boolean} isAllowLink The option for allow link.
   * @returns {HTMLElement} The creared element.
   */
  #message(value, isAllowLink) {
    const message = value ? value.toString() : this.#slotVal('message');
    const messageEl = document.createElement('span');
    messageEl.setAttribute('slot', 'message');
    messageEl.innerHTML = isAllowLink
      ? xssUtils.stripTags(message, '<a><br><p><ids-hyperlink>')
      : xssUtils.stripHTML(message);
    return messageEl;
  }

  /**
   * Create close button label slot element
   * @private
   * @param {string} value The text value.
   * @returns {HTMLElement} The creared element.
   */
  #closeButtonLabel(value) {
    const closeButtonLabel = value ? value.toString() : this.#slotVal('close-button-label');
    const closeButtonLabelEl = document.createElement('span');
    closeButtonLabelEl.setAttribute('slot', 'close-button-label');
    closeButtonLabelEl.textContent = closeButtonLabel;
    return closeButtonLabelEl;
  }

  /**
   * Create toast message element
   * @private
   * @param {object} [options] incoming options
   * @param {string} [options.title] Text that is displayed in the Toast's title.
   * @param {string} [options.message] Text that's displayed in the Toast's body.
   * @param {string} [options.closeButtonLabel] Text that's use for close button label.
   * @param {string} [options.messageId] The toast message id.
   * @param {boolean} [options.allowLink] allows user to put links in the toast message.
   * @param {boolean} [options.audible] Let toast to be invisible on the screen.
   * @param {boolean} [options.progressBar] To have a visible progress bar.
   * @param {number} [options.timeout] The amount of time, the toast should be present on-screen.
   * @returns {HTMLElement} The toast element.
   */
  #toast(options) {
    const addAttribute = (elem, attr) => {
      const key = stringUtils.camelCase(attr);
      const value = { toast: this[key], opt: options[key] };
      if (typeof value.opt !== 'undefined') {
        elem.setAttribute(attr, value.opt.toString());
      }
    };
    const isAllowLink = typeof options.allowLink !== 'undefined' ? options.allowLink : this.allowLink;
    const toastEl = document.createElement('ids-toast-message');
    toastEl.setAttribute(shared.ATTRIBUTE_MESSAGE_ID, options?.messageId);

    addAttribute(toastEl, attributes.AUDIBLE);
    addAttribute(toastEl, attributes.PROGRESS_BAR);
    addAttribute(toastEl, attributes.TIMEOUT);

    toastEl.appendChild(this.#title(options?.title));
    toastEl.appendChild(this.#message(options?.message, isAllowLink));
    toastEl.appendChild(this.#closeButtonLabel(options?.closeButtonLabel));
    return toastEl;
  }

  /**
   * Create current message id to manage each message in container.
   * @param {string} value A message id to use.
   * @returns {string} The message id
   */
  #messageId(value) {
    let messageId;
    if (value) {
      let found = false;
      this.#toastsMap.forEach((val) => {
        if (value === val.messageId) {
          found = true;
        }
      });
      messageId = !found ? value : `${value}-${this.#toastsCounter++}`;
    } else {
      messageId = shared.messageId(this.uniqueId, this.#toastsCounter++);
    }
    return messageId;
  }

  /**
   * Get the value for given slot.
   * @private
   * @param {string} slotName The slot name.
   * @returns {string} The slot val.
   */
  #slotVal(slotName) {
    return shared.slotVal(this.shadowRoot, slotName);
  }

  /**
   * Remove from DOM the host element.
   * @private
   * @returns {void}
   */
  #removeFromDom() {
    const hostElem = this.shadowRoot.host;
    hostElem?.parentNode?.removeChild(hostElem);
  }

  /**
   * Handle on remove-toast-message
   * @private
   * @param {HTMLElement} toast The toast message element
   * @returns {object} The object for chaining.
   */
  #handleRemoveToastMessage(toast) {
    const toastContainer = this.toastContainer();
    this.onEvent(shared.EVENTS.removeMessage, toast, (e) => {
      const toastEl = e?.detail?.elem;
      const messageId = this.#toastsMap.get(toastEl)?.messageId;
      const targetEl = this.messageElem(messageId);

      targetEl?.parentNode?.removeChild(targetEl);
      this.#toastsMap.delete(toastEl);

      this.triggerEvent(shared.EVENTS.removeMessage, this, { detail: e?.detail });

      if (!this.#toastsMap.size) {
        this.#savePosition();
        toastContainer?.parentNode?.removeChild(toastContainer);

        // Remove from DOM
        if (this.destroyOnComplete) {
          this.#removeFromDom();
        }
      }
    });
    return this;
  }

  /**
   * Check if save toast container position, is valid.
   * @private
   * @returns {boolean} true if is valid.
   */
  #canSavePosition() {
    return this.savePosition && this.draggable && this.#canUseLocalStorage();
  }

  /**
   * Save toast container position.
   * @private
   * @returns {void}
   */
  #savePosition() {
    const toastContainer = this.shadowRoot.querySelector('.toast-container');
    const transform = toastContainer?.style?.transform;

    if (this.#canSavePosition() && transform) {
      // Save to local storage
      localStorage.setItem(shared.id(this.uniqueId), transform);
      this.triggerEvent(shared.EVENTS.savePosition, this, {
        detail: { elem: this, uniqueId: this.uniqueId, value: transform }
      });
    }
  }

  /**
   * Restore the saved transform position from local storage
   * @private
   * @returns {string} The transform position
   */
  #restorePosition() {
    return this.#canSavePosition()
      ? localStorage.getItem(shared.id(this.uniqueId)) : null;
  }

  /**
   * Returns true if local storage may be used / is available
   * @private
   * @returns {boolean} If it can be used.
   */
  #canUseLocalStorage() {
    let r = false;
    this.ls = this.ls || localStorage;
    try {
      r = this.ls?.getItem ? true : this.ls.setError.true;
    } catch (exception) {
      r = false;
    }
    return r;
  }

  /**
   * Check if given postion in the viewport
   * @private
   * @param {object} pos The postion to check
   * @returns {boolean} true if is in the viewport
   */
  #isPosInViewport(pos) {
    return (
      pos.top >= 0 && pos.left >= 0
      && pos.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      && pos.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Create draggable
   * @private
   * @param {object} container the container element
   * @returns {void}
   */
  #createDraggable(container) {
    // Reset the transform position
    const reset = () => {
      container.style.transform = 'none';
    };

    if (this.draggable) {
      // Make draggable
      const lsPosition = this.#restorePosition();
      if (lsPosition) {
        container.style.transform = lsPosition;
        const rect = container.getBoundingClientRect();
        /* istanbul ignore next */
        if (!this.#isPosInViewport(rect)) {
          reset();
        }
      }
      container.disabled = false;
    } else {
      // Remove draggable
      container.disabled = true;
      reset();
    }
  }

  /**
   * Set to put links in the toast message.
   * @param {boolean|string} value If true, allows user to put links in the toast message.
   */
  set allowLink(value) {
    if (shared.isBool(value)) {
      this.setAttribute(attributes.ALLOW_LINK, value.toString());
    } else {
      this.removeAttribute(attributes.ALLOW_LINK);
    }
  }

  get allowLink() { return shared.getBoolVal(this, attributes.ALLOW_LINK); }

  /**
   * Set as invisible on the screen, but still read out loud by screen readers.
   * @param {boolean|string} value If true, causes the toast to be invisible on the screen.
   */
  set audible(value) {
    if (shared.isBool(value)) {
      this.setAttribute(attributes.AUDIBLE, value.toString());
    } else {
      this.removeAttribute(attributes.AUDIBLE);
    }
  }

  get audible() { return shared.getBoolVal(this, attributes.AUDIBLE); }

  /**
   * Set to destroy after complete all the toasts.
   * will remove from DOM host element.
   * @param {boolean|string} value if true, will remove from dom.
   */
  set destroyOnComplete(value) {
    if (shared.isBool(value)) {
      this.setAttribute(shared.ATTRIBUTE_TOAST_DESTROY_ON_COMPLETE, value.toString());
    } else {
      this.removeAttribute(shared.ATTRIBUTE_TOAST_DESTROY_ON_COMPLETE);
    }
  }

  get destroyOnComplete() {
    return shared.getBoolVal(this, shared.ATTRIBUTE_TOAST_DESTROY_ON_COMPLETE);
  }

  /**
   * Set user to allows drag/drop the toast container.
   * @param {boolean|string} value if true, allows the drag/drop toast container.
   */
  set draggable(value) {
    if (shared.isBool(value)) {
      this.setAttribute(attributes.DRAGGABLE, value.toString());
    } else {
      this.removeAttribute(attributes.DRAGGABLE);
    }
  }

  get draggable() { return shared.getBoolVal(this, attributes.DRAGGABLE); }

  /**
   * Set position of the toast container in specific place.
   * Options: 'bottom-end', 'bottom-start', 'top-end', 'top-start'
   * @param {string} value The position value to be use, default use as `top-end`
   */
  set position(value) {
    const toastContainer = this.toastContainer();
    if (shared.POSITIONS.indexOf(value) > -1) {
      this.setAttribute(attributes.POSITION, value);
      toastContainer?.classList.remove(...shared.POSITIONS);
      toastContainer?.classList.add(value);
    } else {
      this.removeAttribute(attributes.POSITION);
      toastContainer?.classList.remove(...shared.POSITIONS);
      toastContainer?.classList.add(shared.DEFAULTS.position);
    }
  }

  get position() {
    const position = this.getAttribute(attributes.POSITION);
    return position !== null ? position : shared.DEFAULTS.position;
  }

  /**
   * Set toast to have a visible progress bar.
   * @param {boolean|string} value if true, will show progress with toast.
   */
  set progressBar(value) {
    if (shared.isBool(value)) {
      this.setAttribute(attributes.PROGRESS_BAR, value.toString());
    } else {
      this.removeAttribute(attributes.PROGRESS_BAR);
    }
  }

  get progressBar() { return shared.getBoolVal(this, attributes.PROGRESS_BAR); }

  /**
   * Set toast container to save position to local storage.
   * @param {boolean|string} value if true, will allow to save position to local storage.
   */
  set savePosition(value) {
    if (shared.isBool(value)) {
      this.setAttribute(attributes.SAVE_POSITION, value.toString());
    } else {
      this.removeAttribute(attributes.SAVE_POSITION);
    }
  }

  get savePosition() { return shared.getBoolVal(this, attributes.SAVE_POSITION); }

  /**
   * Set the amount of time, the toast should be present on-screen.
   * @param {number|string} value The amount of time in milliseconds.
   */
  set timeout(value) {
    if (value) {
      this.setAttribute(attributes.TIMEOUT, value.toString());
    } else {
      this.removeAttribute(attributes.TIMEOUT);
    }
  }

  get timeout() {
    const timeout = this.getAttribute(attributes.TIMEOUT);
    return timeout !== null ? timeout : shared.DEFAULTS.timeout;
  }

  /**
   * Set uniqueId to save to local storage, so same saved position can be use for whole app.
   * @param {number|string} value A uniqueId use to save to local storage.
   */
  set uniqueId(value) {
    if (value) {
      this.setAttribute(attributes.UNIQUE_ID, value.toString());
    } else {
      this.removeAttribute(attributes.UNIQUE_ID);
    }
  }

  get uniqueId() {
    const uniqueId = this.getAttribute(attributes.UNIQUE_ID);
    return uniqueId !== null ? uniqueId : shared.DEFAULTS.uniqueId;
  }
}

export default IdsToast;
