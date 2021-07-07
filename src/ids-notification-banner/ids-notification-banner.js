import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes,
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-notification-banner.scss';
import IdsText from '../ids-text/ids-text';
import IdsAlert from '../ids-alert/ids-alert';
import IdsIcon from '../ids-icon/ids-icon';
import IdsHyperlink from '../ids-hyperlink/ids-hyperlink';
import IdsButton from '../ids-button/ids-button';

/**
 * IDS Notification Banner
 * @type {IdsNotificationBanner}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @part container - the notification banner element
 * @part message - the message inside the container element
 * @part link - the link inside the container element
 * @part button - the close button inside the container element
 */
@customElement('ids-notification-banner')
@scss(styles)
class IdsNotificationBanner extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this
      .#handleEvents()
      .#handleKeys();
    super.connectedCallback();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      attributes.TYPE,
      attributes.LINK,
      attributes.LINK_TEXT
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    let alertIcon;

    if (this.type === 'success') {
      alertIcon = 'success';
    }

    if (this.type === 'alert') {
      alertIcon = 'alert';
    }

    if (this.type === 'info') {
      alertIcon = 'info';
    }

    if (this.type === 'error') {
      alertIcon = 'error';
    }

    return `
      <div class="ids-notification-banner" part="container">
        <ids-alert icon="${alertIcon}"></ids-alert>
        <div class="ids-notification-banner-message" part="message">
          <slot name="message"></slot>
        </div>

        ${ this.link !== null ? `<div part="link">
          <ids-hyperlink href="${this.link}" target="_blank">${this.linkText === null ? 'Click to view' : this.linkText}</ids-hyperlink>
        </div>` : '' }

        <div class="ids-notification-banner-button" part="button">
          <ids-button type="tertiary">
            <span class="audible">Close Button</span>
            <ids-icon slot="icon" icon="close"></ids-icon>
          </ids-button>
        </div>
      </div>
    `;
  }

  /**
   * Set the type of the Notification Banner
   * @param {string | null} value the type value
   * success, alert, info, error
   */
  set type(value) {
    if (value) {
      this.setAttribute('type', value);
      let bgColor;

      if (value === 'success') {
        bgColor = `var(--ids-color-palette-emerald-10)`;
      }

      if (value === 'alert') {
        bgColor = `var(--ids-color-palette-amber-10)`;
      }

      if (value === 'info') {
        bgColor = `var(--ids-color-palette-azure-10)`;
      }

      if (value === 'error') {
        bgColor = `var(--ids-color-palette-ruby-10)`;
      }

      this.container.style.backgroundColor = bgColor;
    }
  }

  get type() { return this.getAttribute('type'); }

  /**
   * Set the link inside the Notification Banner
   * @param {string | null} value the type value
   */
  set link(value) {
    if (value) {
      this.setAttribute('link', value);
    }
  }

  get link() { return this.getAttribute('link'); }

  /**
   * Set the custom link text of the Notification Banner
   * @param {string | null} value the type value
   */
  set linkText(value) {
    if (value) {
      this.setAttribute('link-text', value);
    }
  }

  get linkText() { return this.getAttribute('link-text'); }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    const closeBtn = this.container.querySelector('ids-button');
    this.onEvent('click', closeBtn, () => this.dismiss());
    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #handleKeys() {
    const closeBtn = this.container.querySelector('ids-button');
    this.listen('Enter', closeBtn, () => this.dismiss());
    return this;
  }

  /**
   * Remove the notification from the page
   */
  dismiss() {
    let canDismiss = true;
    const response = (veto) => {
      canDismiss = !!veto;
    };
    this.triggerEvent('beforeNotificationRemove', this, { detail: { elem: this, response } });

    if (!canDismiss) {
      return;
    }

    this.triggerEvent('notificationRemove', this, { detail: { elem: this } });
    this.remove();
    this.triggerEvent('afterNotificationRemove', this, { detail: { elem: this } });
  }
}

export default IdsNotificationBanner;
