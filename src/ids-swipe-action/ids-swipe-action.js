import {
  IdsElement,
  customElement,
  scss,
  props,
  mix
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-swipe-action.scss';

/**
 * IDS SwipeAction Component
 * @type {IdsSwipeAction}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part container - the contents
 * @part action-left - the left action
 * @part action-right - the right  action
 */
@customElement('ids-swipe-action')
@scss(styles)
class IdsSwipeAction extends mix(IdsElement).with(IdsEventsMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a
   * document-connected element
   * @private
   */
  connectedCallback() {
    super.connectedCallback();
    this.#handleEvents();
  }

  /**
   * Scroll to the center container on render
   * @private
   */
  rendered() {
    const leftButton = this.querySelector('[slot="action-left"]');
    const rightButton = this.querySelector('[slot="action-right"]');
    if (leftButton && this.swipeType === 'reveal') {
      this.container.scrollLeft = 85;
    }
    if (leftButton && this.swipeType === 'reveal') {
      leftButton.setAttribute('tabindex', '-1');
      leftButton.setAttribute('aria-hidden', 'true');
      leftButton.setAttribute('no-ripple', 'true');
    }
    if (rightButton && this.swipeType === 'reveal') {
      rightButton.setAttribute('tabindex', '-1');
      rightButton.setAttribute('aria-hidden', 'true');
      rightButton.setAttribute('no-ripple', 'true');
    }
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return [
      props.MODE,
      props.SWIPE_TYPE,
      props.VERSION
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-swipe-container">
       <div class="ids-swipe-action-left"><slot name="action-left"></slot></div>
       <div class="ids-swipe-element"><slot name="contents"></slot></div>
       <div class="ids-swipe-action-right"><slot name="action-right"></slot></div>
    </div>`;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   */
  #handleEvents() {
    if (this.swipeType === 'continuous') {
      this.onEvent('swipe', this, (e) => {
        this.querySelector(`[slot="action-${e.detail.direction === 'left' ? 'right' : 'left'}"`).click();
      }, { scrollContainer: this.container });
    }
  }

  /**
   * Set the swipe interaction method between continuous and reveal (default)
   * @param {string | null} value The swipe interation type
   */
  set swipeType(value) {
    if (value === 'continuous') {
      this.setAttribute('swipe-type', value);
      this.container.classList.add('continuous');
      return;
    }

    this.removeAttribute('swipe-type');
    this.container.classList.remove('continuous');
  }

  get swipeType() { return this.getAttribute('swipe-type') || 'reveal'; }
}

export default IdsSwipeAction;
