// Import Base and Decorators
import {
  IdsElement,
  customElement,
  scss,
  mix
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin,
  IdsRenderLoopMixin
} from '../ids-mixins';

// Import Render Loop
import { IdsRenderLoopItem } from '../ids-mixins/ids-render-loop-mixin';

// Import Sass to be encapsulated in the component shadowRoot
import styles from './ids-scroll-view.scss';

/**
 * IDS Scroll View Component
 * @type {IdsScrollView}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @part container - the parent container element
 * @part scroll-view - the scrolling container
 * @part controls - the control button area
 * @part button - the individual circle buttons in the carousel
 */
@customElement('ids-scroll-view')
@scss(styles)
class IdsScrollView extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin,
    IdsRenderLoopMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.controls = this.shadowRoot.querySelector('.ids-scroll-view-controls');
    this.#renderButtons();
    this.#handleEvents();
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-scroll-view-container" part="container">
        <div class="ids-scroll-view" part="scroll-view">
          <slot name="scroll-view-item"></slot>
        </div>
        <div class="ids-scroll-view-controls" part="controls" tabindex="0">
        </div>
    </div>`;
  }

  /**
   * Handle events in this case set the selected state
   * @private
   * @returns {void}
   */
  #handleEvents() {
    let isClick = false;

    // Set selected state on click
    this.onEvent('click', this.controls, (event) => {
      if (event.target.nodeName !== 'A') {
        return;
      }

      this.controls.querySelector('a.selected')?.classList.remove('selected');
      event.target.classList.add('selected');
      event.target.focus();
      isClick = true;

      this.timer = this.rl?.register(new IdsRenderLoopItem({
        duration: 500,
        timeoutCallback: () => {
          isClick = false;
          this.timer?.destroy(true);
          this.timer = null;
        }
      }));
    });

    // Set selected state on scroll/swipe
    this.querySelectorAll('[slot').forEach((elem, i) => {
      elem.scrollViewIndex = i;
      const observer = new IntersectionObserver((entries) => {
        const elemToCheck = entries[0];
        if (elemToCheck.isIntersecting && !isClick) {
          this.controls.querySelector('a.selected')?.classList.remove('selected');
          this.controls.querySelectorAll('a')[elemToCheck.target.scrollViewIndex]?.classList.add('selected');
        }
      },
      { threshold: 0.51 });
      observer.observe(elem);
    });

    // Handle Keys
    this.listen('ArrowLeft', this.controls, () => {
      this.#activateAdjacent(-1);
    });

    this.listen('ArrowRight', this.controls, () => {
      this.#activateAdjacent(1);
    });
  }

  /**
   * Activate the next/previous slide
   * @param {number} direction The direction to move
   * @private
   */
  #activateAdjacent(direction) {
    const active = this.controls.querySelector('a.selected');
    active.classList.remove('selected');

    if (active.scrollViewIndex + direction >= 0) {
      active.previousElementSibling.click();
    }
    if (active.scrollViewIndex + direction <= this.controls.querySelectorAll('a').length - 1) {
      active.nextElementSibling.click();
    }
  }

  /**
   * Render the circle button
   * @private
   */
  #renderButtons() {
    const items = this.querySelectorAll('[slot]');
    items.forEach((item, i) => {
      const id = `id-${i}`;
      item.id = id;
      this.controls.insertAdjacentHTML('beforeend', `<a ${i === 0 ? ' class="selected"' : ''} href="#${id}" part="button"><span class="audible">${item.getAttribute('alt')}</span></a>`);
    });
  }
}

export default IdsScrollView;
