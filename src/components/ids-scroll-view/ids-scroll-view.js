// Import Base and Decorators
import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

// Import Mixins
import {
  IdsEventsMixin,
  IdsKeyboardMixin,
  IdsThemeMixin,
} from '../../mixins';

import {
  renderLoop,
  IdsRenderLoopItem
} from '../ids-render-loop';

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
 * @part button - the individual circle buttons in the scroll view
 */
@customElement('ids-scroll-view')
@scss(styles)
class IdsScrollView extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  static get attributes() {
    return [attributes.MODE, attributes.VERSION];
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.controls = this.shadowRoot.querySelector('.ids-scroll-view-controls');
    this.#renderButtons();
    this.#attachEventHandlers();
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-scroll-view-container" part="container">
        <div class="ids-scroll-view" part="scroll-view" role="complementary" tabindex="-1">
          <slot name="scroll-view-item"></slot>
        </div>
        <div class="ids-scroll-view-controls" part="controls" role="tablist">
        </div>
    </div>`;
  }

  /**
   * Handle events in this case set the selected state
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    this.isClick = false;

    // Set selected state on click
    this.onEvent('click', this.controls, (event) => {
      if (event.target.nodeName !== 'A') {
        return;
      }
      this.#activateLink(event.target, true);
      this.#resetIsClick();
    });

    // handle arrow keys
    this.listen(['ArrowLeft', 'ArrowRight', 'Enter'], this.controls, (e) => {
      const selected = this.controls.querySelector('.selected');
      this.#resetIsClick();
      if (e.key === 'ArrowRight' && selected.nextElementSibling) {
        this.container.scrollBy(this.container.offsetWidth, 0);
        this.#activateLink(selected.nextElementSibling, true);
        return;
      }
      if (e.key === 'ArrowLeft' && selected.previousElementSibling) {
        this.container.scrollBy(-this.container.offsetWidth, 0);
        this.#activateLink(selected.previousElementSibling, true);
      }
      /* istanbul ignore next */
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Set selected state on scroll/swipe
    /* istanbul ignore next - cant test IntersectionObserver */
    this.querySelectorAll('[slot]').forEach((elem, i) => {
      elem.scrollViewIndex = i;
      const observer = new IntersectionObserver((entries) => {
        const elemToCheck = entries[0];
        if (elemToCheck.isIntersecting && !this.isClick) {
          this.#activateLink(this.controls.querySelectorAll('a')[elemToCheck.target.scrollViewIndex]);
        }
      },
      { threshold: 0.55 });
      observer.observe(elem);
    });
  }

  /**
   * Mark a flag as interacting with mouse/keyboard vs swiping
   * @private
   */
  #resetIsClick() {
    this.isClick = true;
    /* istanbul ignore next */
    this.timer = renderLoop.register(new IdsRenderLoopItem({
      duration: 800,
      timeoutCallback: () => {
        this.isClick = false;
        this.timer?.destroy(true);
        this.timer = null;
      }
    }));
  }

  /**
   * Activate the circle button
   * @private
   * @param {HTMLElement} elem The next selected element
   * @param {boolean} focus The next selected element
   */
  #activateLink(elem, focus) {
    const selected = this.controls.querySelector('.selected');
    selected.classList.remove('selected');
    selected.setAttribute('tabindex', '-1');
    selected.removeAttribute('aria-selected');

    elem.classList.add('selected');
    elem.setAttribute('tabindex', '0');
    elem.setAttribute('aria-selected', 'true');

    /* istanbul ignore next - cant test private function/IntersectionObserver */
    if (focus) {
      elem.focus();
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
      this.controls.insertAdjacentHTML('beforeend', `<a ${i === 0 ? ' class="selected"' : ''} href="#${id}" part="button" tabindex="${i === 0 ? '0' : '-1'}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="audible">${item.getAttribute('alt')}</span></a>`);
    });
  }
}

export default IdsScrollView;
