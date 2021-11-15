import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import styles from './ids-swipe-action.scss';
import Base from './ids-swipe-action-base';

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
export default class IdsSwipeAction extends Base {
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

    this.leftButton = this.querySelector('[slot="action-left"]');
    this.rightButton = this.querySelector('[slot="action-right"]');
    this.#attachEventHandlers();
  }

  /**
   * Scroll to the center container on render
   * @private
   */
  rendered() {
    this.leftButton = this.querySelector('[slot="action-left"]');
    this.rightButton = this.querySelector('[slot="action-right"]');
    if (this.leftButton && this.swipeType === 'reveal') {
      this.leftButton.setAttribute('tabindex', '-1');
      this.leftButton.setAttribute('aria-hidden', 'true');
      this.leftButton.setAttribute('no-ripple', 'true');
    }
    if (this.rightButton && this.swipeType === 'reveal') {
      this.rightButton.setAttribute('tabindex', '-1');
      this.rightButton.setAttribute('aria-hidden', 'true');
      this.rightButton.setAttribute('no-ripple', 'true');
    }

    if (this.leftButton && this.swipeType === 'reveal') {
      this.container.scrollLeft = 85;
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.MODE,
      attributes.SWIPE_TYPE,
      attributes.VERSION
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
  #attachEventHandlers() {
    if (this.swipeType === 'continuous') {
      this.onEvent('swipe', this, (e) => {
        this.querySelector(`[slot="action-${e.detail.direction === 'left' ? 'right' : 'left'}"`).click();
      }, { scrollContainer: this.container });
    }

    // Close on click
    if (this.swipeType === 'reveal') {
      this.onEvent('click', this.leftButton, () => {
        this.container.scrollLeft = 85;
      });
      this.onEvent('click', this.rightButton, () => {
        this.container.scrollLeft = 85;
      });
    }
  }

  /**
   * Set the swipe interaction method between continuous and reveal (default)
   * @param {string | null} value The swipe interation type
   */
  set swipeType(value) {
    if (value === 'continuous') {
      this.setAttribute(attributes.SWIPE_TYPE, value);
      this.container.classList.add('continuous');
      return;
    }

    this.removeAttribute(attributes.SWIPE_TYPE);
    this.container.classList.remove('continuous');
  }

  get swipeType() { return this.getAttribute(attributes.SWIPE_TYPE) || 'reveal'; }
}
