import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin
} from '../ids-mixins';

import { IdsToastShared as shared } from './ids-toast-shared';
import styles from './ids-toast-message.scss';

// Supporting components
import IdsIcon from '../ids-icon/ids-icon';
import IdsText from '../ids-text/ids-text';
import IdsTriggerButton from '../ids-trigger-field/ids-trigger-button';
import IdsHyperlink from '../ids-hyperlink/ids-hyperlink';
import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-mixins/ids-render-loop-mixin';
import renderLoop from '../ids-render-loop/ids-render-loop-global';

/**
 * IDS Toast Message Component
 * @type {IdsToastMessage}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 * @part toast - the toast element
 * @part title - the toast title element
 * @part message - the toast message element
 * @part close-button - the close button element
 * @part close-button-icon - the icon element for close button
 * @part progress-bar - the toast progress bar element
 */
@customElement('ids-toast-message')
@scss(styles)
class IdsToastMessage extends
  mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this
      .#setTimer()
      .#handleEvents();
    super.connectedCallback();
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.AUDIBLE,
      attributes.PROGRESS_BAR,
      attributes.TIMEOUT,
      shared.ATTRIBUTE_MESSAGE_ID
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    const d = shared.DEFAULTS;

    const closeButton = `
      <ids-trigger-button part="close-button" class="close-button">
        <ids-text slot="text" audible="true">
          <slot name="close-button-label">${d.closeButtonLabel}</slot>
        </ids-text>
        <ids-icon slot="icon" icon="close" part="close-button-icon" size="small"></ids-icon>
      </ids-trigger-button>`;

    const progress = this.progressBar ? '<div class="progress-bar" part="progress-bar"></div>' : '';

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

  /**
   * Set the toast timer
   * @private
   * @returns {object} This API object for chaining
   */
  #setTimer() {
    let progressBar = this.shadowRoot.querySelector('.progress-bar');
    const updateProgressBar = (percentage) => {
      /* istanbul ignore else */
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }
    };

    // Animation type css class
    if (!this.audible) {
      this.container?.classList.remove(attributes.AUDIBLE);
      this.container?.classList.add(shared.TOAST_MESSAGE_CLASSES.start);
    }

    /* istanbul ignore next */
    if (!this.progressBar && progressBar) {
      progressBar.parentNode?.removeChild(progressBar);
      progressBar = undefined;
    }

    const duration = this.audible ? 100 : this.timeout;
    const self = this;
    let percentage = 100;

    const timer = function timer() {
      if (self.timer) {
        self.timer.destroy(true);
      }
      self.timer = new IdsRenderLoopItem({
        id: `add-${self.messageId}`,
        duration,
        updateCallback() {
          percentage = ((duration - this.elapsedTime) / duration) * 100;
          updateProgressBar(percentage);
        },
        timeoutCallback() {
          updateProgressBar(0);
          self.removeToastMessage();
          this.destroy();
        }
      });
      renderLoop.register(self.timer);
    };
    timer();

    return this;
  }

  /**
   * Remove the toast message and animate
   * @returns {void}
   */
  removeToastMessage() {
    const removeCallback = () => {
      const toast = this.container;
      if (toast) {
        toast.setAttribute('aria-live', '');
        toast.setAttribute('aria-relevent', '');
        toast.classList.remove(shared.TOAST_MESSAGE_CLASSES.start);
        toast.classList.add(shared.TOAST_MESSAGE_CLASSES.end);
        toast.parentNode?.removeChild(toast);
        this.container = null;
        this.offEvent(`keydown.toast-${this.messageId}`, document);
        this.offEvent(`keyup.toast-${this.messageId}`, document);
        const options = {
          title: this.title,
          message: this.message,
          messageId: this.messageId,
          closeButtonLabel: this.closeButtonLabel,
          allowLink: this.allowLink,
          audible: this.audible,
          progressBar: this.progressBar,
          timeout: this.timeout,
        };
        this.triggerEvent(shared.EVENTS.removeMessage, this, {
          detail: { elem: this, messageId: this.messageId, options }
        });
      }
    };

    this.timer?.destroy();

    if (this.audible) {
      removeCallback();
    }

    const closeTimer = new IdsRenderLoopItem({
      id: `remove-${this.messageId}`,
      duration: 20,
      timeoutCallback() {
        removeCallback();
        this.destroy();
      }
    });
    renderLoop.register(closeTimer);
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #handleEvents() {
    const toast = this.container;
    const id = this.messageId;

    // Handle pause/play for toast timer
    let isPausePlay = false;
    const updateTimer = () => this.timer[isPausePlay ? 'pause' : 'resume']();
    const events = ['mousedown.toast', 'touchstart.toast', 'mouseup.toast', 'touchend.toast'];
    events.forEach((event) => {
      this.onEvent(event, toast, (e) => {
        isPausePlay = !!/mousedown|touchstart/i.test(e.type);
        updateTimer();
      });
    });

    const keyEvents = [`keydown.toast-${id}`, `keyup.toast-${id}`];
    keyEvents.forEach((event) => {
      this.onEvent(event, document, (e) => {
        const key = e.which || e.keyCode;

        // Control + Alt + P
        if (e.ctrlKey && e.altKey && key === 80) {
          isPausePlay = e.type === 'keydown';
          updateTimer();
        }
        // Escape
        if (e.type === 'keydown' && key === 27) {
          e.stopImmediatePropagation();
          e.preventDefault();
          this.removeToastMessage();
        }
      });
    });

    // Handle clicking the (x) close button
    const closeButton = this.shadowRoot.querySelector('.close-button');
    this.onEvent('click.toast', closeButton, () => this.removeToastMessage());

    return this;
  }

  /**
   * Set as invisible on the screen, but still read out lout by screen readers.
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
    return timeout !== null ? parseInt(timeout, 10) : shared.DEFAULTS.timeout;
  }

  /**
   * Set toast-id to manage each toast.
   * @param {number|string} value A toast-id use.
   */
  set messageId(value) {
    if (value) {
      this.setAttribute(shared.ATTRIBUTE_MESSAGE_ID, value.toString());
    } else {
      this.removeAttribute(shared.ATTRIBUTE_MESSAGE_ID);
    }
  }

  get messageId() { return this.getAttribute(shared.ATTRIBUTE_MESSAGE_ID); }
}

export default IdsToastMessage;
