import {
  IdsElement,
  customElement,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import styles from './ids-validation-message.scss';

const icons = {
  alert: 'alert-solid',
  error: 'error-solid',
  info: 'info-solid',
  success: 'success-solid',
};

/**
 * IDS Field Components
 */
@customElement('ids-validation-message')
@scss(styles)
class IdsValidationMessage extends IdsElement {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Custom Element `connectedCallBack` implementation
   * @private
   * @returns {void}
   */
  connectedCallBack() {
    this.refresh();
  }

  attributeChangedCallback() {
    this.refresh();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [props.TYPE, props.AUDIBLE];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const iconName = icons[this.type];
    const icon = iconName ? `<ids-icon icon="${iconName}" size="15" class="ids-icon"></ids-icon>` : '';
    return `<div class="ids-validation-message">${icon}<ids-label class="message-text"><slot></slot></ids-label></div>`;
  }

  /**
   * Set `type` attribute
   * @param {string} value The `type` attribute
   */
  set type(value) {
    if (value) {
      this.setAttribute(props.TYPE, value);
      return;
    }
    this.removeAttribute(props.TYPE);
  }

  get type() { return this.getAttribute(props.TYPE); }

  /**
   * Set `audible` attribute
   * @param {string} value The `audible` attribute
   */
  set audible(value) {
    if (value) {
      this.setAttribute(props.AUDIBLE, value);
      return;
    }
    this.removeAttribute(props.AUDIBLE);
  }

  get audible() { return this.getAttribute(props.AUDIBLE); }

  /**
   * Refresh to reset
   * @private
   * @returns {void}
   */
  refresh() {
    this.rootEl = this.shadowRoot.querySelector('.ids-validation-message');
    if (this.rootEl) {
      if (this.audible) {
        this.appendAudible();
      } else {
        this.removeAudible();
      }
      const icon = icons[this.type];
      if (icon && this.type) {
        this.appendIcon(icon);
      }
    }
  }

  /**
   * Check if an icon exists if not add it
   * @private
   * @param {string} iconName The icon name to check
   * @returns {void}
   */
  appendIcon(iconName) {
    const icon = this.rootEl?.querySelector(`[icon="${iconName}"]`);
    if (!icon) {
      this.rootEl?.insertAdjacentHTML('afterbegin', `<ids-icon icon="${iconName}" size="15" class="ids-icon"></ids-icon>`);
    }
  }

  /**
   * Check if an icon exists if not add it
   * @private
   * @param {string} iconName The icon name to check
   * @returns {void}
   */
  removeIcon(iconName) {
    const icon = this.rootEl?.querySelector(`[icon="${iconName}"]`);
    if (icon) {
      icon.remove();
    }
  }

  /**
   * Check if an icon exists if not add it
   * @private
   * @returns {void}
   */
  appendAudible() {
    const audibleEl = this.rootEl?.querySelector('ids-label[audible="true"]');
    if (!audibleEl) {
      this.rootEl?.insertAdjacentHTML('afterbegin', `<ids-label audible="true">${this.audible || ''} </ids-label>`);
    }
  }

  /**
   * Check if an icon exists if not add it
   * @private
   * @returns {void}
   */
  removeAudible() {
    const audibleEl = this.rootEl?.querySelector('ids-label[audible="true"]');
    if (audibleEl) {
      audibleEl.remove();
    }
  }
}

export default IdsValidationMessage;
