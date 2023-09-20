import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { TYPES } from './ids-notification-attributes';

import '../ids-text/ids-text';
import '../ids-alert/ids-alert';
import '../ids-icon/ids-icon';
import '../ids-hyperlink/ids-hyperlink';
import '../ids-button/ids-button';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-notification-banner.scss';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Notification Banner
 * @type {IdsNotificationBanner}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @part container - the notification banner element
 * @part message - the message inside the container element
 * @part link - the link inside the container element
 * @part button - the close button inside the container element
 */
@customElement('ids-notification-banner')
@scss(styles)
export default class IdsNotificationBanner extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
    this.#attachKeyboardListeners();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes(): Array<any> {
    return [
      attributes.MESSAGE_TEXT,
      attributes.LINK,
      attributes.LINK_TEXT,
      attributes.TYPE,
      attributes.WRAP
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    // Set the alert icon based on the notification type
    let alertIcon;
    if (TYPES[this.type ?? '']?.type === undefined) {
      alertIcon = TYPES.success.type;
    } else {
      alertIcon = this.type;
    }

    const type = (!this.type || TYPES[this.type] === undefined) ? TYPES.success.type : this.type;
    const overflow = this.wrap ? '' : 'overflow="ellipsis"';

    return `
      <div class="ids-notification-banner" part="container" type="${type}">
        <ids-alert icon="${alertIcon === 'warning' ? 'alert' : alertIcon}"></ids-alert>
        <div class="ids-notification-banner-message ${this.wrap ? 'wrap' : ''}" part="message">
          <ids-text ${overflow}>${this.messageText !== null ? this.messageText : 'Enter Message Text.'}</ids-text>
        </div>

        ${this.link !== null ? `<div part="link">
          <ids-hyperlink font-size="16" href="${this.link}" target="_blank">${this.linkText === null ? 'Click to view' : this.linkText}</ids-hyperlink>
        </div>` : ''}

        <div class="ids-notification-banner-button" part="button">
          <ids-button appearance="tertiary">
            <span class="audible">Close Button</span>
            <ids-icon icon="close" size="small"></ids-icon>
          </ids-button>
        </div>
      </div>
    `;
  }

  /**
   * Toggle text wrapping for overflowing messages.
   * Text overflow style is ellipsis by default.
   * @param {boolean | null} value wrapText value
   */
  set wrap(value: boolean | null) {
    const messageContainer = this.container?.querySelector('.ids-notification-banner-message');
    const messageText = messageContainer?.querySelector('ids-text');

    if (stringToBool(value)) {
      this.setAttribute(attributes.WRAP, '');
      messageContainer?.classList.add('wrap');
      messageText?.setAttribute(attributes.OVERFLOW, 'none');
    } else {
      this.removeAttribute(attributes.WRAP);
      messageContainer?.classList.remove('wrap');
      messageText?.setAttribute(attributes.OVERFLOW, 'ellipsis');
    }
  }

  get wrap(): boolean {
    return stringToBool(this.getAttribute(attributes.WRAP));
  }

  /**
   * Set the type of the Notification Banner
   * @param {string | null} value the type value
   * success, alert, info, error
   */
  set type(value: string | null) {
    if (!value || TYPES[value] === undefined) {
      this.removeAttribute(attributes.TYPE);
      this.setAttribute(attributes.TYPE, TYPES.success.type);
      this.container?.setAttribute(attributes.TYPE, TYPES.success.type);
    } else {
      this.setAttribute(attributes.TYPE, value);
      this.container?.setAttribute(attributes.TYPE, value);
    }
  }

  get type(): string | null { return this.getAttribute(attributes.TYPE); }

  /**
   * Set the link inside the Notification Banner
   * @param {string | null} value the link value
   */
  set link(value: string | null) {
    if (value) {
      this.setAttribute(attributes.LINK, value);
    } else {
      this.removeAttribute(attributes.LINK);
    }
  }

  get link(): string | null { return this.getAttribute(attributes.LINK); }

  /**
   * Set the custom link text of the Notification Banner
   * @param {string | null} value the link-text value
   */
  set linkText(value: string | null) {
    if (value) {
      this.setAttribute(attributes.LINK_TEXT, value);
    } else {
      this.removeAttribute(attributes.LINK_TEXT);
    }
  }

  get linkText() { return this.getAttribute(attributes.LINK_TEXT); }

  /**
   * Set the message text of the Notification Banner
   * @param {string | null} value the link-text value
   */
  set messageText(value: string | null) {
    if (value) {
      this.setAttribute(attributes.MESSAGE_TEXT, value);
    } else {
      this.removeAttribute(attributes.MESSAGE_TEXT);
    }
  }

  get messageText() { return this.getAttribute(attributes.MESSAGE_TEXT); }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers(): object {
    const closeBtn = this.container?.querySelector('ids-button');
    this.onEvent('click', closeBtn, () => this.dismiss());
    return this;
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners(): object {
    const closeBtn = this.container?.querySelector('ids-button');
    this.listen('Enter', closeBtn, () => this.dismiss());
    return this;
  }

  /**
   * Shows a notification banner dynamically
   * @param {object} notification Object passed in for notification creation
   * @returns {void}
   */
  add(notification: object | any): void {
    const {
      id,
      parent,
      type,
      messageText,
      link,
      linkText
    } = notification;
    const messageTextEl = this.container?.querySelector('[part="message"]');
    const alertIcon = this.container?.querySelector('ids-alert');
    const overflow = this.wrap ? '' : 'overflow="ellipsis"';

    // Set properties
    if (id) {
      this.setAttribute('id', id);
    }
    this.type = type;
    this.messageText = messageText;
    alertIcon?.setAttribute('icon', this.type ?? '');
    if (messageTextEl) messageTextEl.innerHTML = `<ids-text ${overflow}>${this.messageText}</ids-text>`;

    // Check for link and create the necassary elements.
    if (notification.link) {
      const linkPart = document.createElement('div');
      linkPart.setAttribute('part', 'link');
      this.link = link;
      this.linkText = linkText === undefined ? 'Click to view' : linkText;
      linkPart.innerHTML = `<ids-hyperlink href="${this.link}" target="_blank">${this.linkText}</ids-hyperlink>`;
      // Insert after the message text.
      messageTextEl?.parentNode?.insertBefore(linkPart, messageTextEl.nextSibling);
    }

    // Check if parent container is defined to prepend
    // If not prepend to body element.
    if (parent) {
      const parentEl = document.getElementById(parent);
      parentEl?.prepend(<any> this);
    } else if (document.querySelector('ids-container')) {
      document.querySelector('ids-container')?.prepend(<any> this);
    } else {
      document.body.prepend(<any> this);
    }
  }

  /**
   * Remove the notification from the page
   */
  dismiss() {
    let canDismiss = true;
    const response = (veto: any) => {
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
