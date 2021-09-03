import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../../core/ids-element';

import debounce from '../../core/ids-debouncer';
import { attributes } from '../../core/ids-attributes';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsPopupInteractionsMixin,
  IdsPopupOpenEventsMixin,
  IdsRenderLoopMixin,
  IdsRenderLoopItem,
  IdsResizeMixin,
  IdsThemeMixin,
  IdsXssMixin
} from '../../mixins';

import zCounter from './ids-modal-z-counter';
import IdsPopup from '../ids-popup';
import IdsOverlay from './ids-overlay';
import IdsModalButton from '../ids-modal-button';

import styles from './ids-modal.scss';
import { IdsStringUtils, IdsDOMUtils } from '../../utils';

// When a user clicks the Modal Buttons, this is the delay between
// the click and the "hiding" of the Modal.
const dismissTimeout = 200;

/**
 * IDS Modal Component
 * @type {IdsModal}
 * @inherits IdsElement
 * @mixes IdsRenderLoopMixin
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsResizeMixin
 * @mixes IdsThemeMixin
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 */
@customElement('ids-modal')
@scss(styles)
class IdsModal extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsPopupInteractionsMixin,
    IdsPopupOpenEventsMixin,
    IdsRenderLoopMixin,
    IdsResizeMixin,
    IdsThemeMixin,
    IdsXssMixin,
  ) {
  constructor() {
    super();

    /* istanbul ignore next */
    if (!this.state) {
      this.state = {};
    }
    this.state.overlay = null;
    this.state.messageTitle = null;
    this.state.visible = false;
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.MESSAGE_TITLE,
      attributes.VISIBLE
    ];
  }

  /**
   * Handle Setting changes of the value has changed by calling the getter
   * in the extending class.
   * @param {string} name The property name
   * @param {string} oldValue The property old value
   * @param {string} newValue The property new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shouldUpdate) {
      super.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.popup.type = 'modal';
    this.popup.animated = true;
    this.popup.animationStyle = 'scale-in';

    // Update ARIA / Sets up the label
    this.messageTitle = this.querySelector('[slot="title"]')?.textContent;
    this.setAttribute('role', 'dialog');
    this.refreshAriaLabel();

    // Listen for changes to the window size
    /* istanbul ignore next */
    window.addEventListener('resize', debounce(() => {
      this.setModalPosition();
    }));

    // Update Inner Modal Parts

    this.shouldUpdate = true;

    // Update Outer Modal Parts
    this.#refreshOverlay(this.overlay);
    this.visible = this.getAttribute('visible');

    // Run refresh once on connect
    window.requestAnimationFrame(() => {
      this.setModalPosition();
    });

    this.#attachEventHandlers();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const extraClass = this.name !== 'ids-modal' ? this.name : '';
    const extraContentClass = extraClass ? ` ${extraClass}-content` : '';
    const extraHeaderClass = extraClass ? ` ${extraClass}-header` : '';
    const extraFooterClass = extraClass ? ` ${extraClass}-footer` : '';
    const footerHidden = this.buttons.length ? '' : ' hidden';

    return `<ids-popup part="modal" class="ids-modal" type="custom">
      <div class="ids-modal-container" slot="content">
        <div class="ids-modal-header${extraHeaderClass}">
          <slot name="title"></slot>
        </div>
        <div class="ids-modal-content${extraContentClass}">
          <slot></slot>
        </div>
        <div class="ids-modal-footer${extraFooterClass}" ${footerHidden}>
          <slot name="buttons"></slot>
        </div>
      </div>
    </ids-popup>`;
  }

  /**
   * Used for ARIA Labels and other content
   * @readonly
   * @returns {string} concatenating the status and title together.
   */
  get ariaLabelContent() {
    return this.messageTitle;
  }

  /**
   * @readonly
   * @returns {NodeList} currently slotted buttons
   */
  get buttons() {
    return this.querySelectorAll('[slot="buttons"]');
  }

  /**
   * @returns {IdsOverlay|undefined} either an external overlay element, or none
   */
  get overlay() {
    return this.state.overlay || this.shadowRoot.querySelector('ids-overlay');
  }

  /**
   * @param {IdsOverlay|undefined} val an overlay element
   */
  set overlay(val) {
    if (val instanceof IdsOverlay) {
      this.state.overlay = val;
    } else {
      this.state.overlay = null;
    }
    this.#refreshOverlay(this.state.overlay);
  }

  /**
   * @readonly
   * @returns {IdsPopup} the inner Popup
   */
  get popup() {
    return this.shadowRoot.querySelector('ids-popup');
  }

  /**
   * @returns {string} the content of the message's title
   */
  get messageTitle() {
    const titleEl = this.querySelector('[slot="title"]');

    /* istanbul ignore next */
    return titleEl?.textContent || this.state.messageTitle;
  }

  /**
   * @param {string} val the new content to be used as the message's title
   */
  set messageTitle(val) {
    const trueVal = this.xssSanitize(val);
    const currentVal = this.state.messageTitle;

    if (currentVal !== trueVal) {
      if (typeof trueVal === 'string' && trueVal.length) {
        this.state.messageTitle = trueVal;
        this.setAttribute(attributes.MESSAGE_TITLE, trueVal);
      } else {
        this.state.messageTitle = '';
        this.removeAttribute(attributes.MESSAGE_TITLE);
      }

      this.#refreshModalHeader(!!trueVal);
    }
  }

  /**
   * Refreshes the state of the Modal header, either adding its slot/contents or removing it
   * @param {boolean} hasTitle true if the title should be rendered
   * @returns {void}
   */
  /* istanbul ignore next */
  #refreshModalHeader(hasTitle) {
    let titleEls = [...this.querySelectorAll('[slot="title"]')];

    if (hasTitle) {
      // Search for slotted title elements.
      // If one is found, replace the contents.  Otherwise, create one.
      /* istanbul ignore next */
      if (!titleEls.length) {
        this.insertAdjacentHTML('afterbegin', `<ids-text slot="title" type="h2" font-size="24">${this.state.messageTitle}</ids-text>`);
        titleEls = [this.querySelector('[slot="title"]')];
      }
    }

    this.refreshAriaLabel();

    titleEls.forEach((el, i) => {
      if (hasTitle) {
        /* istanbul ignore next */
        if (i > 0) {
          el.remove();
          return;
        }
        el.textContent = this.state.messageTitle;
      } else {
        el.remove();
      }
    });
  }

  /**
   * Renders or Removes a correct `aria-label` attribute on the Modal about its contents.
   * @returns {void}
   */
  refreshAriaLabel() {
    const title = this.ariaLabelContent;
    if (title) {
      this.setAttribute('aria-label', title);
      return;
    }
    this.removeAttribute('aria-label');
  }

  /**
   * Refreshes the state of the Modal footer, hiding/showing it
   * @returns {void}
   */
  #refreshModalFooter() {
    /* istanbul ignore next */
    const footerEl = this.container.querySelector('.ids-modal-footer');

    /* istanbul ignore next */
    if (this.buttons.length) {
      footerEl.removeAttribute('hidden');
    } else {
      footerEl.setAttribute('hidden', '');
    }
  }

  /**
   * @returns {boolean} true if the Modal is visible.
   */
  get visible() {
    return IdsStringUtils.stringToBool(this.getAttribute('visible'));
  }

  /**
   * @param {boolean} val true if the Modal is visible.
   */
  set visible(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    this.state.visible = trueVal;

    /* istanbul ignore else */
    if (trueVal) {
      this.shouldUpdate = false;
      this.setAttribute(attributes.VISIBLE, '');
      this.shouldUpdate = true;
      this.addOpenEvents();
    } else {
      this.shouldUpdate = false;
      this.removeAttribute(attributes.VISIBLE);
      this.shouldUpdate = true;
      this.removeOpenEvents();
    }

    this.#refreshVisibility(trueVal);
  }

  /**
   * Shows the modal
   * @returns {void}
   */
  show() {
    // Trigger a veto-able `beforeshow` event.
    if (!this.triggerVetoableEvent('beforeshow')) {
      return;
    }

    this.visible = true;
  }

  /**
   * Hides the modal
   * @returns {void}
   */
  hide() {
    // Trigger a veto-able `beforehide` event.
    if (!this.triggerVetoableEvent('beforehide')) {
      return;
    }

    this.visible = false;
  }

  /**
   * Overrides `addOpenEvents` from the OpenEvents mixin to add additional "Escape" key handling
   */
  addOpenEvents() {
    super.addOpenEvents();

    /* istanbul ignore next */
    this.listen('Escape', this, () => {
      this.hide();
    });

    // If a Modal Button is clicked, fire an optional callback
    const buttonSlot = this.container.querySelector('slot[name="buttons"]');

    /* istanbul ignore next */
    this.onEvent('click.buttons', buttonSlot, (e) => {
      this.handleButtonClick(e);
    });
  }

  /**
   * Overrides `removeOpenEvents` from the OpenEvents mixin to remove "Escape" key handling
   */
  removeOpenEvents() {
    super.removeOpenEvents();
    this.unlisten('Escape');
    this.offEvent('click.buttons');
  }

  /**
   * Refreshes the state of the overlay used behind the modal.  If a shared overlay isn't applied,
   * an internal one is generated and applied to the ShadowRoot.
   * @param {boolean} val if true, uses an external overlay
   * @returns {void}
   */
  #refreshOverlay(val) {
    let overlay;

    if (!val) {
      overlay = new IdsOverlay();
      overlay.part = 'overlay';
      this.shadowRoot.prepend(overlay);
    } else {
      overlay = this.shadowRoot.querySelector('ids-overlay');
      overlay.remove();
    }
  }

  /**
   * @param {boolean} val if true, makes the Modal visible to the user
   * @returns {void}
   */
  async #refreshVisibility(val) {
    // Insulate from the popup potentially not being rendered on the very first run:
    const popupCl = this.popup.container?.classList;

    /* istanbul ignore else */
    if (val && !popupCl?.contains('visible')) {
      this.overlay.visible = true;
      this.popup.visible = true;
      this.removeAttribute('aria-hidden');

      // Animation-in needs the Modal to appear in front (z-index), so this occurs on the next tick
      window.requestAnimationFrame(() => {
        this.overlay.container.style.zIndex = zCounter.increment();
        this.popup.container.style.zIndex = zCounter.increment();
        this.setModalPosition();
        this.#setModalFocus();
        this.triggerEvent('show', this, {
          bubbles: true,
          detail: {
            elem: this,
            value: undefined
          }
        });
      });
    } else if (!val && popupCl?.contains('visible')) {
      this.overlay.visible = false;
      this.popup.visible = false;

      // Animation-out can wait for the opacity transition to end before changing z-index.
      await IdsDOMUtils.waitForTransitionEnd(this.overlay.container, 'opacity');
      this.overlay.container.style.zIndex = '';
      this.popup.container.style.zIndex = '';
      this.setAttribute('aria-hidden', 'true');
      zCounter.decrement();
      zCounter.decrement();

      this.triggerEvent('hide', this, {
        bubbles: true,
        detail: {
          elem: this,
          value: undefined
        }
      });
      this.#setTargetFocus();
    }
  }

  /**
   * Centers the Popup's position within the viewport
   * @returns {void}
   */
  setModalPosition() {
    /* istanbul ignore next */
    if (this.popup.alignTarget !== null) {
      this.popup.alignTarget = null;
    }

    /* istanbul ignore next */
    if (this.popup.align !== 'center') {
      this.popup.align = 'center';
    }

    const isOpen = this.popup.animatedOpen;
    let width = 0;
    let height = 0;

    // If the modal isn't visible, subtract its width/height from the equation.
    /* istanbul ignore next */
    if (!isOpen) {
      width = this.popup.container?.clientWidth || 0;
      height = this.popup.container?.clientHeight || 0;
    }

    this.popup.x = (window.innerWidth - width) / 2;
    this.popup.y = (window.innerHeight - height) / 2;
  }

  /**
   * Focuses the first-possible element within the Modal
   * @returns {void}
   */
  #setModalFocus() {
    const focusableSelectors = [
      'button',
      'ids-button',
      'ids-menu-button',
      'ids-modal-button',
      'ids-toggle-button',
      '[href]',
      'input',
      'ids-input',
      'select',
      'textarea',
      'ids-textarea',
      '[tabindex]:not([tabindex="-1"]'
    ];
    const selectorStr = focusableSelectors.join(', ');

    const focusable = [...this.querySelectorAll(selectorStr)];
    if (focusable.length) {
      focusable[0].focus();
    }
  }

  /**
   * Focuses the defined target element, if applicable
   * @returns {void}
   */
  #setTargetFocus() {
    /* istanbul ignore next */
    if (this.target) {
      this.target.focus();
    }
  }

  /**
   * Sets up overall events
   */
  #attachEventHandlers() {
    const titleSlot = this.container.querySelector('slot[name="title"]');
    const buttonSlot = this.container.querySelector('slot[name="buttons"]');

    // Stagger these one frame to prevent them from occuring
    // immediately when the component invokes
    /* istanbul ignore next */
    window.requestAnimationFrame(() => {
      this.onEvent('slotchange.title', titleSlot, () => {
        const titleNodes = titleSlot.assignedNodes();
        if (titleNodes.length) {
          this.messageTitle = titleNodes[0].textContent;
        }
      });
      this.onEvent('slotchange.buttonset', buttonSlot, () => {
        this.#refreshModalFooter();
        this.setModalPosition();
      });
    });

    // Set up all the events specifically-related to the "trigger" type
    this.refreshTriggerEvents();
  }

  /**
   * Handles when Modal Button is clicked.
   * @param {*} e the original event object
   */
  handleButtonClick(e) {
    const timeoutCallback = () => {
      /* istanbul ignore next */
      if (typeof this.onButtonClick === 'function') {
        this.onButtonClick(e.target);
      }
      // If this IdsModalButton has a `cancel` prop, treat
      // it as a `cancel` button and hide.
      const modalBtn = e.target.closest('ids-modal-button');
      if (modalBtn?.cancel) {
        this.hide();
      }
    };

    // Run click handler on a staggered interval
    this.rl.register(new IdsRenderLoopItem({
      duration: dismissTimeout,
      timeoutCallback
    }));
  }

  /**
   * Triggers an event that occurs before the show/hide operations of the Modal that can "cancel"
   * @param {string} eventType the name of the event to trigger
   * @returns {boolean} true if the event works
   */
  triggerVetoableEvent(eventType) {
    const eventTypes = ['beforeshow', 'beforehide'];
    if (!eventTypes.includes(eventType)) {
      return false;
    }

    let canShow = true;
    const eventResponse = (veto) => {
      canShow = !!veto;
    };
    this.triggerEvent(eventType, this, {
      detail: {
        elem: this,
        response: eventResponse
      }
    });
    return canShow;
  }

  /**
   * Handle `onTriggerClick` from IdsPopupInteractionsMixin
   */
  /* istanbul ignore next */
  onTriggerClick() {
    this.show();
  }

  /**
   * Handle `onOutsideClick` from IdsPopupOpenEventsMixin
   * @param {MouseEvent} e the original click event
   */
  /* istanbul ignore next */
  onOutsideClick(e) {
    if (!this.isEqualNode(e.target)) {
      return;
    }
    this.hide();
  }
}

export default IdsModal;
