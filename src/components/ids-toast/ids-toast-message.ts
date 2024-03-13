import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { waitForAnimationEnd } from '../../utils/ids-dom-utils/ids-dom-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';

import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import '../ids-trigger-field/ids-trigger-button';
import '../ids-hyperlink/ids-hyperlink';

import {
  ATTRIBUTE_MESSAGE_ID,
  DEFAULTS,
  TOAST_MESSAGE_CLASSES,
  AUDIBLE_TIMEOUT,
  EVENTS,
  isBool,
  getBoolVal,
} from './ids-toast-shared';

import styles from './ids-toast-message.scss';

const Base = IdsKeyboardMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Toast Message Component
 * @type {IdsToastMessage}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @part toast - the toast element
 * @part title - the toast title element
 * @part message - the toast message element
 * @part close-button - the close button element
 * @part close-button-icon - the icon element for close button
 * @part progress-bar - the toast progress bar element
 */
@customElement('ids-toast-message')
@scss(styles)
export default class IdsToastMessage extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.#configureTimeout();
    this.#attachEventHandlers();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.AUDIBLE,
      attributes.PROGRESS_BAR,
      attributes.TIMEOUT,
      ATTRIBUTE_MESSAGE_ID
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const d = DEFAULTS;
    const hiddenProgressBarClass = this.audible ? ' hidden' : '';

    const closeButton = `
      <ids-trigger-button part="close-button" class="close-button">
        <ids-text audible="true">
          <slot name="close-button-label">${d.closeButtonLabel}</slot>
        </ids-text>
        <ids-icon icon="close" part="close-button-icon" size="small"></ids-icon>
      </ids-trigger-button>`;

    const progress = `<div class="progress-bar${hiddenProgressBarClass}" part="progress-bar"></div>`;

    return `
      <div class="ids-toast-message ${attributes.AUDIBLE}" part="toast">
        <div class="main-container">
          <span class="content-container" aria-relevant="additions text" aria-live="polite">
            <span class="title" part="title"><slot name="title">${d.title}</slot></span>
            <span class="message" part="message"><slot name="message">${d.message}</slot></span>
          </span>
          <span class="close-button-container">${closeButton}</span>
        </div>
        ${progress}
      </div>`;
  }

  get progressBarEl() {
    return this.shadowRoot?.querySelector<HTMLElement>('.progress-bar');
  }

  /**
   * Set the toast timer
   * @private
   * @returns {void}
   */
  #configureTimeout(): void {
    const progressBarEl = this.progressBarEl;

    // Animation type css class
    if (!this.audible) {
      this.container?.classList.remove(attributes.AUDIBLE);
      this.container?.classList.add(TOAST_MESSAGE_CLASSES.start);
    }

    if (progressBarEl) {
      if (!this.progressBar) {
        progressBarEl.classList.add('hidden');
      }

      // Set duration length and run animation
      const duration = this.audible ? AUDIBLE_TIMEOUT : this.timeout;
      progressBarEl.style?.setProperty('--toast-message-duration', `${duration}ms`);
      progressBarEl.classList.add('running');
    }
  }

  /**
   * Remove the toast message and animate
   * @returns {Promise<void>} resolved when toast removal is complete
   */
  async removeToastMessage(): Promise<void> {
    const toast = this.container;
    if (toast) {
      // Animate "out" when visible
      if (!this.audible) {
        toast.classList.remove(TOAST_MESSAGE_CLASSES.start);
        toast.classList.add(TOAST_MESSAGE_CLASSES.end);
        if (this.container) await waitForAnimationEnd(this.container, 'animScaleOut');
      }

      // Removes this toast message from the DOM
      this.parentNode?.removeChild(this);
      this.triggerEvent(EVENTS.removeMessage, this, {
        detail: {
          elem: this,
          messageId: this.messageId,
          options: {
            title: this.title,
            message: (this as any).message,
            messageId: this.messageId,
            closeButtonLabel: (this as any).closeButtonLabel,
            allowLink: (this as any).allowLink,
            audible: this.audible,
            progressBar: this.progressBar,
            timeout: this.timeout,
          }
        }
      });
    }
  }

  /**
   * Controls playback status of the Toast Message's progress bar
   * @param {boolean} isPaused true if playback on the toast message timeout has been paused.
   */
  #updatePlaybackStatus(isPaused: boolean): void {
    if (this.progressBarEl) this.progressBarEl.classList[isPaused ? 'add' : 'remove']('paused');
  }

  /**
   * Establish Internal Event Handlers
   * @private
   */
  #attachEventHandlers(): void {
    const toast = this.container;
    const id = this.messageId;

    // When progress bar animation is done, the toast completes
    this.onEvent('animationend', this.progressBarEl, async () => {
      await this.removeToastMessage();
    });

    // Handle pause/play updates for toast timeout
    let isPaused = false;
    const events = ['mousedown.toast', 'touchstart.toast', 'mouseup.toast', 'touchend.toast'];
    events.forEach((event) => {
      this.onEvent(event, toast, (e: MouseEvent) => {
        isPaused = !!/mousedown|touchstart/i.test(e.type);
        this.#updatePlaybackStatus(isPaused);
      }, { passive: true });
    });

    const keyEvents = [`keydown.toast-${id}`, `keyup.toast-${id}`];
    keyEvents.forEach((event) => {
      this.onEvent(event, document, async (e: KeyboardEvent) => {
        const key = e.which || e.keyCode;

        // Control + Alt + P
        if (e.ctrlKey && e.altKey && key === 80) {
          isPaused = e.type === 'keydown';
          this.#updatePlaybackStatus(isPaused);
        }
        // Escape
        if (e.type === 'keydown' && key === 27) {
          e.stopImmediatePropagation();
          e.preventDefault();
          await this.removeToastMessage();
        }
      });
    });

    // Handle clicking the (x) close button
    const closeButton = this.shadowRoot?.querySelector('.close-button');
    this.onEvent('click.toast', closeButton, () => this.removeToastMessage());
  }

  /**
   * Set as invisible on the screen, but still read out lout by screen readers.
   * @param {boolean|string} value If true, causes the toast to be invisible on the screen.
   */
  set audible(value: boolean | string) {
    if (isBool(value)) {
      this.setAttribute(attributes.AUDIBLE, value.toString());
    } else {
      this.removeAttribute(attributes.AUDIBLE);
    }
  }

  get audible(): boolean | string { return getBoolVal(this, attributes.AUDIBLE); }

  /**
   * Set toast to have a visible progress bar.
   * @param {boolean|string} value if true, will show progress with toast.
   */
  set progressBar(value: boolean | string) {
    if (isBool(value)) {
      this.setAttribute(attributes.PROGRESS_BAR, value.toString());
    } else {
      this.removeAttribute(attributes.PROGRESS_BAR);
    }
  }

  get progressBar(): boolean | string { return getBoolVal(this, attributes.PROGRESS_BAR); }

  /**
   * Set the amount of time, the toast should be present on-screen.
   * @param {number|string} value The amount of time in milliseconds.
   */
  set timeout(value: number | string) {
    if (value) {
      this.setAttribute(attributes.TIMEOUT, value.toString());
    } else {
      this.removeAttribute(attributes.TIMEOUT);
    }
  }

  get timeout(): number | string {
    const timeout = parseInt(this.getAttribute(attributes.TIMEOUT) ?? '', 10);
    return !isNaN(timeout) ? timeout : DEFAULTS.timeout; // eslint-disable-line
  }

  /**
   * Set toast-id to manage each toast.
   * @param {number|string} value A toast-id use.
   */
  set messageId(value: number | string | null) {
    if (value) {
      this.setAttribute(ATTRIBUTE_MESSAGE_ID, value.toString());
    } else {
      this.removeAttribute(ATTRIBUTE_MESSAGE_ID);
    }
  }

  get messageId(): string | null {
    return this.getAttribute(ATTRIBUTE_MESSAGE_ID);
  }
}
