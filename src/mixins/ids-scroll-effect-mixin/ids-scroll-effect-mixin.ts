import { IdsConstructor } from '../../core/ids-element';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin';

type Constraints = IdsConstructor<EventsMixinInterface>;

/**
 * Adds a scroll effect to a given scrollable area
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsScrollEffectMixin = <T extends Constraints>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  /**
   * @property {HTMLElement | null} scrollArea indicates the scroll element with (overflow: scroll)
   */
  scrollArea: HTMLElement | null | undefined = undefined;

  connectedCallback() {
    super.connectedCallback?.();
    this.attachScrollEvents();
  }

  /**
   * Set up event listeners
   * @returns {void}
   */
  attachScrollEvents() {
    if (!this.scrollArea) return;
    this.removeScrollEvents();

    this.onEvent('scroll.effects-mixin', this.scrollArea, (e) => {
      const target = e.target;
      if (target.scrollTop > 0) {
        this.scrollArea?.classList.add('is-scrolling');
      } else {
        this.scrollArea?.classList.remove('is-scrolling');
      }
    });
  }

  /**
   * Remove the scroll event
   * @returns {void}
   */
  removeScrollEvents() {
    this.offEvent('scroll.effects-mixin', this.scrollArea);
  }
};

export default IdsScrollEffectMixin;
