import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-swipe-action.scss';

import { cssTransitionTimeout } from '../../utils/ids-timer-utils/ids-timer-utils';
import IdsButton from '../ids-button/ids-button';

const Base = IdsEventsMixin(
  IdsElement
);

/**
 * IDS SwipeAction Component
 * @type {IdsSwipeAction}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the contents
 * @part action-left - the left action
 * @part action-right - the right  action
 */
@customElement('ids-swipe-action')
@scss(styles)
export default class IdsSwipeAction extends Base {
  leftButton: IdsButton | null = null;

  rightButton: IdsButton | null = null;

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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#afterConnectedCallback();
  }

  /**
   * Scroll to the center container on render
   * @private
   */
  async #afterConnectedCallback() {
    this.leftButton = this.querySelector('[slot="action-left"]');
    this.rightButton = this.querySelector('[slot="action-right"]');

    if (this.swipeType === 'reveal') {
      if (this.rightButton) {
        this.rightButton.setAttribute('tabindex', '-1');
        this.rightButton.setAttribute('aria-hidden', 'true');
      }
      if (this.leftButton) {
        this.leftButton.setAttribute('tabindex', '-1');
        this.leftButton.setAttribute('aria-hidden', 'true');

        // Fix scroll position
        this.container?.style.setProperty('visibility', 'hidden');
        this.container?.style.setProperty('scroll-behavior', 'auto');
        await cssTransitionTimeout(40);
        if (this.container) this.container.scrollLeft = 85;
        await cssTransitionTimeout(1);
        this.container?.style.setProperty('scroll-behavior', 'smooth');
        this.container?.style.setProperty('visibility', '');
      }
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.SWIPE_TYPE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
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
      this.onEvent('swipe', this, (e: CustomEvent) => {
        this.querySelector<HTMLElement>(`[slot="action-${e.detail.direction === 'left' ? 'right' : 'left'}"`)?.click();
      }, { scrollContainer: this.container, passive: true });
    }

    // Close on click
    if (this.swipeType === 'reveal') {
      this.onEvent('click', this.leftButton, () => {
        if (this.container) this.container.scrollLeft = 85;
      });
      this.onEvent('click', this.rightButton, () => {
        if (this.container) this.container.scrollLeft = 85;
      });
    }
  }

  /**
   * Set the swipe interaction method between continuous and reveal (default)
   * @param {string | null} value The swipe interation type
   */
  set swipeType(value: string | null) {
    if (value === 'continuous') {
      this.setAttribute(attributes.SWIPE_TYPE, value);
      this.container?.classList.add('continuous');
      return;
    }

    this.removeAttribute(attributes.SWIPE_TYPE);
    this.container?.classList.remove('continuous');
  }

  get swipeType(): string { return this.getAttribute(attributes.SWIPE_TYPE) || 'reveal'; }
}
