import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import MESSAGE_STATUSES from './ids-message-attributes';

import IdsModal from '../ids-modal/ids-modal';

import '../ids-icon/ids-icon';

import styles from './ids-message.scss';
import type IdsIcon from '../ids-icon/ids-icon';
import type IdsOverlay from '../ids-modal/ids-overlay';

/**
 * IDS Message Component
 * @type {IdsMessage}
 * @inherits IdsModal
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 */
@customElement('ids-message')
@scss(styles)
export default class IdsMessage extends IdsModal {
  constructor() {
    super();

    if (!this.state) {
      this.state = {};
    }
    this.state.message = '';
    this.state.status = MESSAGE_STATUSES[0];
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.MESSAGE,
      attributes.OPACITY,
      attributes.STATUS,
    ];
  }

  /**
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();

    // Update status and correct
    this.status = this.getAttribute(attributes.STATUS);
    // Update opacity and correct
    this.opacity = this.getAttribute(attributes.OPACITY);

    // Sanitizes the HTML in the component
    const currentContentEl = this.querySelector('*:not([slot])');
    if (currentContentEl) {
      this.message = currentContentEl.innerHTML;
    }
  }

  /**
   * Used for ARIA Labels and other content
   * @readonly
   * @returns {string} concatenating the status and title together.
   */
  get ariaLabelContent(): string {
    const status = this.status !== 'none' ? `${this.status}: ` : '';
    return `${status}${this.messageTitle}`;
  }

  /**
   * @returns {string} the current contents of the messsage
   */
  get message(): string {
    return this.state.message;
  }

  /**
   * @param {string} val the desired contents of the message element
   */
  set message(val: string) {
    const sanitizedVal = this.xssSanitize(val);
    if (sanitizedVal !== this.state.message) {
      this.#refreshMessage(sanitizedVal);
    }
  }

  /**
   * @returns {string} the current opacity of the overlay
   */
  get opacity(): string {
    return this.state.opacity;
  }

  /**
   * @param {string} val the desired opacity of the overlay
   */
  set opacity(val: string | null) {
    if (val) {
      this.state.opacity = val;

      const overlayElem = this.shadowRoot?.querySelector<IdsOverlay>('ids-overlay');
      if (overlayElem) {
        overlayElem.opacity = val;
      }
    }
  }

  /**
   * Refreshes the state of the Message's Content
   * @param {string} content the new message content element
   */
  #refreshMessage(content: string | number): void {
    let messageEl = this.querySelector('*:not([slot])');
    if (!messageEl) {
      messageEl = document.createElement('div');
      this.appendChild(messageEl);
    } else {
      messageEl.innerHTML = '';
    }

    // Replace the message content
    messageEl.insertAdjacentHTML('afterbegin', String(content));
    this.state.message = content;
  }

  /**
   * @returns {string} the message's current status type
   */
  get status(): string {
    return this.state.status || 'default';
  }

  /**
   * @param {string} val the message's new status type
   */
  set status(val: string | null) {
    let realStatusValue = MESSAGE_STATUSES[0];
    if (val && MESSAGE_STATUSES.includes(val)) {
      realStatusValue = val;
    }

    const currentValue = this.state.status;
    if (realStatusValue !== currentValue) {
      this.state.status = realStatusValue;

      if (typeof val === 'string' && val.length && realStatusValue !== MESSAGE_STATUSES[0]) {
        this.setAttribute(attributes.STATUS, realStatusValue);
      } else {
        this.removeAttribute(attributes.STATUS);
      }

      this.#refreshStatus(realStatusValue);
      this.refreshAriaLabel();
    }
  }

  /**
   * @param {string} val the value of the status icon
   * @returns {void}
   */
  #refreshStatus(val: string): void {
    const header = this.container?.querySelector('.ids-modal-header');
    let icon = header?.querySelector<IdsIcon>('ids-icon');
    val = val === 'warning' ? 'alert' : val;
    if (val && val !== MESSAGE_STATUSES[0]) {
      if (!icon) {
        header?.insertAdjacentHTML('afterbegin', `<ids-icon slot="icon" icon="${val}" class="ids-icon ids-message-status"></ids-icon>`);
        icon = header?.querySelector('ids-icon');
      }

      if (icon) {
        icon.icon = val;
        this.#setIconColor(icon, val);
      }
    } else {
      icon?.remove();
    }
  }

  /**
   * Changes the color of the Status Icon
   * @param {Element} iconEl the icon element to update
   * @param {string} thisStatus the status string to apply as a CSS class
   * @returns {void}
   */
  #setIconColor(iconEl: Element, thisStatus: string): void {
    const iconElClassList = iconEl.classList;
    MESSAGE_STATUSES.forEach((status) => {
      thisStatus = thisStatus === 'alert' ? 'warning' : thisStatus;
      status = status === 'alert' ? 'warning' : status;
      if (thisStatus !== 'none' && thisStatus === status) {
        iconElClassList.add(status);
      } else {
        iconElClassList.remove(status);
      }
    });
  }
}
