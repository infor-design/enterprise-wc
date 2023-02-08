import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-scroll-view.scss';

const Base = IdsThemeMixin(
  IdsKeyboardMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

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
export default class IdsScrollView extends Base {
  controls?: HTMLElement | null = null;

  constructor() {
    super();
    this.isClick = false;
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.MODE
    ];
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.controls = this.shadowRoot?.querySelector('.ids-scroll-view-controls');
    this.#renderButtons();
    this.#attachEventHandlers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-scroll-view-container" part="container">
        <div class="ids-scroll-view" part="scroll-view" role="complementary" tabindex="-1">
          <slot name="scroll-view-item"></slot>
        </div>
        <div class="ids-scroll-view-controls" part="controls" role="tablist">
        </div>
    </div>`;
  }

  isClick: boolean;

  /**
   * Handle events in this case set the selected state
   * @private
   * @returns {void}
   */
  #attachEventHandlers() {
    // Set selected state on click
    this.onEvent('click', this.controls, (event: any) => {
      if (event.target.nodeName !== 'A') {
        return;
      }
      this.#activateLink(event.target, true);
      this.isClick = true;
    });

    // handle arrow keys
    this.listen(['ArrowLeft', 'ArrowRight', 'Enter'], this.controls, (e: any) => {
      const selected = this.controls?.querySelector('.selected');
      this.isClick = false;

      if (e.key === 'ArrowRight' && selected?.nextElementSibling) {
        this.container?.scrollBy(this.container.offsetWidth, 0);
        this.#activateLink(<HTMLElement>selected.nextElementSibling, true);
        return;
      }
      if (e.key === 'ArrowLeft' && selected?.previousElementSibling) {
        this.container?.scrollBy(-this.container.offsetWidth, 0);
        this.#activateLink(<HTMLElement>selected.previousElementSibling, true);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    this.offEvent('touchstart.scroll-view-touch');
    this.onEvent('touchstart.scroll-view-touch', this.container, () => {
      // Reset the property so the controls can be updated when swipe
      this.isClick = false;
    });

    // Set selected state on scroll/swipe
    this.querySelectorAll('[slot]').forEach((elem: any, i: any) => {
      const scrollViewIndex = i;
      const observer = new IntersectionObserver(
        (entries) => {
          const elemToCheck: IntersectionObserverEntry = entries[0];
          if (elemToCheck.isIntersecting && !this.isClick) {
            this.#activateLink(this.controls?.querySelectorAll('a')[scrollViewIndex] as HTMLElement, true);
          }
        },
        { threshold: 0.55 }
      );
      observer.observe(elem);
    });
  }

  /**
   * Activate the circle button
   * @private
   * @param {HTMLElement} elem The next selected element
   * @param {boolean} focus The next selected element
   */
  #activateLink(elem: HTMLElement, focus = false) {
    const selected = this.controls?.querySelector('.selected');
    selected?.classList.remove('selected');
    selected?.setAttribute('tabindex', '-1');
    selected?.removeAttribute('aria-selected');

    elem.classList.add('selected');
    elem.setAttribute('tabindex', '0');
    elem.setAttribute('aria-selected', 'true');

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
    items.forEach((item: any, i: number) => {
      const id = `id-${i}`;
      item.id = id;
      this.controls?.insertAdjacentHTML('beforeend', `<a ${i === 0 ? ' class="selected"' : ''} href="#${id}" part="button" tabindex="${i === 0 ? '0' : '-1'}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="audible">${item.getAttribute('alt')}</span></a>`);
    });
  }
}
