import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base/ids-element';

import debounce from '../ids-base/ids-debouncer';
import { attributes } from '../ids-base/ids-attributes';

import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsRenderLoopMixin,
  IdsRenderLoopItem,
  IdsResizeMixin,
  IdsThemeMixin,
  IdsXssMixin
} from '../ids-mixins';

import zCounter from './ids-modal-z-counter';
import IdsPopup from '../ids-popup/ids-popup';
import IdsOverlay from './ids-overlay';
import IdsModalButton from './ids-modal-button';

// @ts-ignore
import styles from './ids-modal.scss';
import { IdsStringUtils } from '../ids-base/ids-string-utils';
import IdsDOMUtils from '../ids-base/ids-dom-utils';

const MODAL_ATTRIBUTES = [
  attributes.TITLE,
  attributes.VISIBLE
];

const appliedMixins = [
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsRenderLoopMixin,
  IdsResizeMixin,
  IdsThemeMixin,
  IdsXssMixin,
];

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
class IdsModal extends mix(IdsElement).with(...appliedMixins) {
  constructor() {
    super();

    if (!this.state) {
      this.state = {};
    }
    this.state.overlay = null;
    this.state.target = null;
    this.state.title = null;
    this.state.visible = false;
  }

  static get attributes() {
    return [...super.attributes, ...MODAL_ATTRIBUTES];
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
    this.setAttribute('role', 'dialog');

    // Listen for changes to the window size
    /* istanbul ignore next */
    window.addEventListener('resize', debounce(() => {
      this.setModalPosition();
    }));

    // Update Inner Modal Parts

    this.shouldUpdate = true;

    // Update Outer Modal Parts
    this.#refreshOverlay(this.overlay);
    this.#refreshVisibility(this.visible);

    // Add events to the target element
    /* istanbul ignore next */
    if (this.target) {
      this.#refreshTargetEvents();
    }

    // Run refresh once on connect
    this.rl.onNextTick(() => {
      this.setModalPosition();
    });

    this.handleEvents();
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
   * @returns {HTMLElement} the defined target element
   */
  get target() {
    return this.state.target;
  }

  /**
   * @param {HTMLElement} val a specified target element
   */
  set target(val) {
    if (val && val instanceof HTMLElement) {
      this.state.target = val;
    } else {
      this.state.target = null;
    }
    this.#refreshTargetEvents();
  }

  /**
   * @returns {string} the content of the message's title
   */
  get title() {
    const titleEl = this.querySelector('[slot="title"]');
    return titleEl?.textContent || '';
  }

  /**
   * @param {string} val the new content to be used as the message's title
   */
  set title(val) {
    const trueVal = this.xssSanitize(val);
    const currentVal = this.state.title;

    if (currentVal !== trueVal) {
      if (typeof trueVal === 'string' && trueVal.length) {
        this.state.title = trueVal;
        this.setAttribute('title', trueVal);
      } else {
        this.state.title = null;
        this.removeAttribute('title');
      }

      this.#refreshModalHeader(!!trueVal);
    }
  }

  /**
   * Refreshes the state of the Modal header, either adding its slot/contents or removing it
   * @param {boolean} hasTitle true if the title should be rendered
   * @returns {void}
   */
  #refreshModalHeader(hasTitle) {
    if (hasTitle) {
      let titleEls = [...this.querySelectorAll('[slot="title"]')];

      // Search for slotted title elements.
      // If one is found, replace the contents.  Otherwise, create one.
      if (!titleEls.length) {
        this.insertAdjacentHTML('afterbegin', `<ids-text slot="title" type="h2" font-size="24">${this.state.title}</ids-text>`);
        titleEls = [this.querySelector('[slot="title"]')];
      }

      titleEls.forEach((el, i) => {
        if (i > 0) {
          el.remove();
          return;
        }
        el.textContent = this.state.title;
      });
    }
  }

  /**
   * Refreshes the state of the Modal footer, hiding/showing it
   * @param {boolean} hasTitle true if the title should be rendered
   * @returns {void}
   */
  #refreshModalFooter() {
    const footerEl = this.container.querySelector('.ids-modal-footer');
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
    } else {
      this.shouldUpdate = false;
      this.removeAttribute(attributes.VISIBLE);
      this.shouldUpdate = true;
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
    this.applyOpenEvents();
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
    this.removeOpenEvents();
  }

  applyOpenEvents() {
    /* istanbul ignore next */
    this.listen('Escape', this, () => {
      this.hide();
    });
  }

  removeOpenEvents() {
    this.unlisten('Escape');
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

      // Animation-in needs the Modal to appear in front (z-index), so this occurs on the next tick
      this.rl.onNextTick(() => {
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
    // If the modal IS visible,
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
  handleEvents() {
    const titleSlot = this.container.querySelector('slot[name="title"]');
    const buttonSlot = this.container.querySelector('slot[name="buttons"]');

    // Stagger these one frame to prevent them from occuring
    // immediately when the component invokes
    window.requestAnimationFrame(() => {
      this.onEvent('slotchange.title', titleSlot, () => {
        const titleNodes = titleSlot.assignedNodes();
        if (titleNodes.length) {
          this.title = titleNodes[0].textContent;
        }
      });
      this.onEvent('slotchange.buttonset', buttonSlot, () => {
        this.#refreshModalFooter();
        this.setModalPosition();
      });
    });

    // If a Modal Button is clicked, fire an optional callback
    this.onEvent('click.buttons', buttonSlot, (e) => {
      if (typeof this.onButtonClick === 'function') {
        this.onButtonClick(e.target);
      }
    });
  }

  /**
   * Connects a click event to the defined target element, which will allow the modal to open
   * by click, or by a keyboard press with the Enter/Return key.
   * @returns {void}
   */
  #refreshTargetEvents() {
    this.detachEventsByName('click.target');

    if (!this.target) {
      return;
    }

    this.target.setAttribute('aria-controls', `${this.id}`);
    this.onEvent('click.target', this.target, () => {
      if (!this.visible) {
        this.show();
      }
    });
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
}

export default IdsModal;
