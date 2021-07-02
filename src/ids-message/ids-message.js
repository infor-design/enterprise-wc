import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';

import IdsModal, { IdsModalButton } from '../ids-modal';

import { attributes } from '../ids-base/ids-attributes';
import { IdsStringUtils } from '../ids-base/ids-string-utils';
import IdsDOMUtils from '../ids-base/ids-dom-utils';

// @ts-ignore
import styles from './ids-message.scss';

// Types of status that can be applied to message components
const MESSAGE_STATUSES = [
  'none', 'error', 'alert', 'success', 'info'
];

// Attributes that apply to message components
const MESSAGE_ATTRIBUTES = [
  attributes.MESSAGE,
  attributes.STATUS,
  attributes.TITLE
];

const MESSAGE_DEFAULTS = {
  message: '',
  status: MESSAGE_STATUSES[0],
  title: ''
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

  connectedCallback() {
    super.connectedCallback();

    // Set initial state
    Object.keys(MESSAGE_ATTRIBUTES).forEach((prop) => {
      this.state[prop] = this.getAttribute(prop) || MESSAGE_DEFAULTS[prop];
    });

    this.popup.type = 'custom';
    this.status = this.getAttribute(attributes.STATUS);
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup part="modal" class="ids-modal ids-message" type="menu">
      <div class="ids-message-container" slot="content">
        <div class="ids-message-header">
          <slot name="title"></slot>
        </div>
        <div class="ids-message-content">
          <slot></slot>
        </div>
        <div class="ids-message-footer">
          <slot name="buttons"></slot>
        </div>
      </div>
    </ids-popup>`;
  }

  /**
   * @returns {string|HTMLElement}
   */
  get message() {

  }

  /**
   * @param {string|HTMLElement}
   */
  set message(val) {

  }

  /**
   * @readonly
   * @returns {IdsModal} internal Modal instance
   */
  get modal() {
    return this.container;
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
        this.setAttribute(attributes.STATUS, realStatusValue)
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
    const header = this.container.querySelector('.ids-message-header');
    const icon = header.querySelector('ids-icon');

    if (val) {
      if (!icon) {
        header.insertAdjacentHTML('afterbegin', `<ids-icon slot="icon" icon="${this.status}" class="ids-icon ids-message-status"></ids-icon>`);
      }
    } else {
      if (icon) {
        icon.remove();
      }
    }
  }

  /**
   * @returns {string} the content of the message's title
   */
  get title() {
    return this.state.title;
  }

  /**
   * @param {string} val the new content to be used as the message's title
   */
  set title(val) {

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
