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

// Notification Types
const TYPES = {
  success: {
    type: 'success',
    color: 'emerald',
  },
  alert: {
    type: 'alert',
    color: 'amber'
  },
  info: {
    type: 'info',
    color: 'azure'
  },
  error: {
    type: 'error',
    color: 'ruby'
  }
};

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

    this.state = {};
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
   * Override `attributeChangedCallback` from IdsElement to wrap its normal operation in a
   * check for a true `shouldUpdate` property.
   * @param  {string} name The property name
   * @param  {string} oldValue The property old value
   * @param  {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback.apply(this, [name, oldValue, newValue]);
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      attributes.TYPE,
      attributes.LINK,
      attributes.LINK_TEXT,
      attributes.MESSAGE_TEXT,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    // Set the alert icon based on the notification type
    let alertIcon;
    if (TYPES[this.type]?.type === undefined) {
      alertIcon = TYPES.success.type;
    } else {
      alertIcon = this.type;
    }

    return `
      <div class="ids-notification-banner" part="container">
        <ids-alert icon="${alertIcon}"></ids-alert>
        <div class="ids-notification-banner-message" part="message">
          <ids-text overflow="ellipsis">${this.messageText !== null ? this.messageText : 'Enter Message Text.'}</ids-text>
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
    let bgColor;
    if (!value || TYPES[value] === undefined) {
      this.removeAttribute(attributes.TYPE);
      this.setAttribute(attributes.TYPE, TYPES.success.type);
      bgColor = `var(--ids-color-palette-${TYPES.success.color}-10)`;
      this.container.style.backgroundColor = bgColor;
    } else {
      this.setAttribute(attributes.TYPE, value);
      bgColor = `var(--ids-color-palette-${TYPES[value].color}-10)`;
      this.container.style.backgroundColor = bgColor;
    }
  }

  get type() { return this.getAttribute(attributes.TYPE); }

  /**
   * Set the link inside the Notification Banner
   * @param {string | null} value the link value
   */
  set link(value) {
    this.setAttribute(attributes.LINK, value);
  }

  get link() { return this.getAttribute(attributes.LINK); }

  /**
   * Set the custom link text of the Notification Banner
   * @param {string | null} value the link-text value
   */
  set linkText(value) {
    this.setAttribute(attributes.LINK_TEXT, value);
  }

  get linkText() { return this.getAttribute(attributes.LINK_TEXT); }

  /**
   * Set the message text of the Notification Banner
   * @param {string | null} value the link-text value
   */
  set messageText(value) {
    this.setAttribute(attributes.MESSAGE_TEXT, value);
  }

  get messageText() { return this.getAttribute(attributes.MESSAGE_TEXT); }

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
   * Shows a notification banner dynamically
   * @param {object} notification Object passed in for notification creation
   * @returns {void}
   */
  add(notification) {
    const {
      id,
      parent,
      type,
      messageText,
      link,
      linkText
    } = notification;
    const messageTextEl = this.container.querySelector('[part="message"]');
    const alertIcon = this.container.querySelector('ids-alert');

    // Set properties
    if (id) {
      this.setAttribute('id', id);
    }
    this.type = type;
    this.messageText = messageText;
    alertIcon.setAttribute('icon', this.type);
    messageTextEl.innerHTML = `<ids-text overflow="ellipsis">${this.messageText}</ids-text>`;

    // Check for link and create the necassary elements.
    if (notification.link) {
      const linkPart = document.createElement('div');
      linkPart.setAttribute('part', 'link');
      this.link = link;
      this.linkText = linkText === undefined ? 'Click to view' : linkText;
      linkPart.innerHTML = `<ids-hyperlink href="${this.link}" target="_blank">${this.linkText}</ids-hyperlink>`;
      // Insert after the message text.
      messageTextEl.parentNode.insertBefore(linkPart, messageTextEl.nextSibling);
    }

    // Check if parent container is defined to prepend
    // If not prepend to body element.
    if (parent) {
      const parentEl = document.getElementById(parent);
      parentEl.prepend(this);
    } else {
      document.body.prepend(this);
    }
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
