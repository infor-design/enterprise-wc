import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';

import IdsModal from '../ids-modal';
import IdsIcon from '../ids-icon';

import { attributes } from '../ids-base/ids-attributes';
import { IdsStringUtils } from '../ids-base/ids-string-utils';
import IdsDOMUtils from '../ids-base/ids-dom-utils';

// @ts-ignore
import styles from './ids-message.scss';

// Types of status that can be applied to message components
const MESSAGE_STATUSES = [
  'none', 'default', 'error', 'alert', 'success', 'info'
];

// Attributes that apply to message components
const MESSAGE_ATTRIBUTES = [
  attributes.MESSAGE,
  attributes.STATUS
];

const MESSAGE_DEFAULTS = {
  message: '',
  status: MESSAGE_STATUSES[0],
};

/**
 * IDS Message Component
 * @type {IdsMessage}
 * @inherits IdsModal
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 */
@customElement('ids-message')
@scss(styles)
class IdsMessage extends IdsModal {
  constructor() {
    super();
  }

  static get attributes() {
    return [...super.attributes, ...MESSAGE_ATTRIBUTES];
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();

    // Set initial state
    Object.keys(MESSAGE_ATTRIBUTES).forEach((prop) => {
      this.state[prop] = this.getAttribute(prop) || MESSAGE_DEFAULTS[prop];
    });

    this.status = this.getAttribute(attributes.STATUS);
  }

  /**
   * @returns {string|HTMLElement} the current contents of the messsage
   */
  get message() {
    return this.querySelector('*:not([slot])').textContent;
  }

  /**
   * @param {string|HTMLElement} val the desired contents of the message element
   */
  set message(val) {
    let contentElem;
    if (val instanceof HTMLElement) {
      contentElem = val.cloneNode(true);
    } else if (typeof val === 'string') {
      contentElem = document.createElement('div');
      contentElem.insertAdjacentHTML('afterbegin', val);
    }
    this.#refreshMessage(contentElem);
  }

  /**
   * Refreshes the state of the Message's Content
   * @param {HTMLElement} contentElem the new message content element
   */
  #refreshMessage(contentElem) {
    // Remove any existing message elements
    const currentMessage = this.message;
    if (currentMessage) {
      [...currentMessage].forEach((messageEl) => {
        messageEl.remove();
      });
    }

    // Append the new one
    this.appendChild(contentElem);

    // Re-position the Popup
    this.setModalPosition();
  }

  /**
   * @returns {string} the message's current status type
   */
  get status() {
    return this.state.status;
  }

  /**
   * @param {string} val the message's new status type
   */
  set status(val) {
    let realStatusValue = MESSAGE_STATUSES[0];
    if (MESSAGE_STATUSES.includes(val)) {
      realStatusValue = val;
    }

    const currentValue = this.state.status;
    if (realStatusValue !== currentValue) {
      this.state.status = realStatusValue;

      if (typeof val === 'string' && val.length) {
        this.setAttribute(attributes.STATUS, realStatusValue);
      } else {
        this.removeAttribute(attributes.STATUS);
      }

      this.#refreshStatus(realStatusValue);
    }
  }

  /**
   * @param {string} val the value of the status icon
   * @returns {void}
   */
  #refreshStatus(val) {
    const header = this.container.querySelector('.ids-modal-header');
    if (!header) {
      return;
    }

    let icon = header.querySelector('ids-icon');
    if (val && val !== MESSAGE_STATUSES[0]) {
      if (!icon) {
        header.insertAdjacentHTML('afterbegin', `<ids-icon slot="icon" icon="${val}" class="ids-icon ids-message-status"></ids-icon>`);
        icon = header.querySelector('ids-icon');
      }
      icon.icon = val;
      this.#setIconColor(icon, val);
    } else {
      icon?.remove();
    }
  }

  /**
   * Changes the color of the Status Icon
   * @param {IdsIcon} iconEl the icon element to update
   * @param {string} [thisStatus='none'] the status string to apply as a CSS class
   * @returns {void}
   */
  #setIconColor(iconEl, thisStatus = 'none') {
    if (!(iconEl instanceof IdsIcon)) {
      return;
    }

    const iconElClassList = iconEl.classList;
    MESSAGE_STATUSES.forEach((status) => {
      if (thisStatus !== 'none' && thisStatus === status) {
        iconElClassList.add(status);
      } else {
        iconElClassList.remove(status);
      }
    });
  }

  /**
   * Add additional open events
   * @returns {void}
   */
  applyOpenEvents() {
    super.applyOpenEvents();

    // When a cancel button is clicked, hide the Message
    this.onEvent('click.cancel', this.container, (e) => {
      const modalBtn = e.target.closest('ids-modal-button');
      if (modalBtn?.cancel) {
        this.hide();
      }
    });
  }

  /**
   * Remove additional Open Events
   * @returns {void}
   */
  removeOpenEvents() {
    super.removeOpenEvents();

    this.offEvent('click.cancel');
  }
}

export default IdsModal;
