import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

import { injectTemplate } from '../../utils/ids-string-utils/ids-string-utils';

import styles from './ids-virtual-scroll.scss';
import IdsDataSource from '../../core/ids-data-source';

const DEFAULT_HEIGHT = '100dvh';
const DEFAULT_ITEM_HEIGHT = 50;

type OnAfterVirtualScrollArgs = {
  elem: IdsVirtualScroll;
  startIndex: number;
  endIndex: number;
};

/**
 * IDS Virtual Scroll Component
 * @type {IdsVirtualScroll}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-virtual-scroll')
@scss(styles)
export default class IdsVirtualScroll extends IdsEventsMixin(IdsElement) {
  // Array is a pointer to a datasource in a parent component
  datasource: IdsDataSource | Record<string, any> = {};

  timeout?: number | null;

  initialized = false;

  lastStart = NaN;

  lastEnd = NaN;

  eventTarget: HTMLElement | null = null;

  onAfterVirtualScroll?: (data: OnAfterVirtualScrollArgs) => void;

  // eslint-disable-next-line no-template-curly-in-string
  stringTemplate = '<div class="ids-virtual-scroll-item" part="list-item">${productName}</div>';

  constructor() {
    super();

    Object.defineProperty(this, 'scrollTop', {
      get: () => this.#scrollTop,
      set: (value) => { this.#scrollTop = value; },
      configurable: true,
      enumerable: true
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.applyHeight();
    this.renderItems(false);
    this.#attachEventHandlers();
  }

  /**
   * Establish Internal Event Handlers
   * @returns {void}
   */
  #attachEventHandlers() {
    this.timeout = null;
    this.scrollTarget = this.parentElement;
  }

  /**
   * Handle the scrolling event
   * @private
   * @param {Event} e The scroll event data
   */
  handleScroll(e: Partial<Event>): void {
    if (this.timeout) {
      cancelAnimationFrame(this.timeout);
    }

    const target: any = e.target;
    this.timeout = requestAnimationFrame(() => {
      if (target) {
        this.scrollTop = target.scrollTop;
      }
    });
  }

  /**
   * Render the visible section plus the cached data
   * @private
   * @param {boolean} allowZero Allow a zero length dataset (render empty)
   */
  renderItems(allowZero: boolean) {
    if (!this.data || (!allowZero && this.data.length === 0)) {
      return;
    }

    requestAnimationFrame(() => {
      const startIndex = this.startIndex;
      const endIndex = this.startIndex + this.visibleItemCount();

      const indexesChanged = this.lastStart !== startIndex || this.lastEnd !== endIndex;
      if (!indexesChanged) return;

      this.lastStart = startIndex;
      this.lastEnd = endIndex;

      const visibleItems = this.data.slice(startIndex, endIndex);

      let html = '';
      visibleItems.map((item: any, index: number) => {
        const node = this.itemTemplate(item, index, startIndex + index);
        html += node;
        return node;
      });

      const offset = this.container?.querySelector<HTMLElement>('.offset');
      offset?.style.setProperty('transform', `translateY(${this.offsetY}px)`);

      // work-around for outside components to style contents inside this shadowroot
      const wrapper = this.querySelector('[part="contents"]');
      if (wrapper) wrapper.innerHTML = html;

      this.triggerEvent('aftervirtualscroll', this, { detail: { elem: this, startIndex, endIndex } });
      if (this.onAfterVirtualScroll) this.onAfterVirtualScroll({ elem: this, startIndex, endIndex });
    });
  }

  /**
   * Set the height of the containers
   * @private
   * @returns {void}
   */
  applyHeight(): void {
    if (!this.initialized) {
      return;
    }
    const content = this.container?.querySelector<HTMLElement>('.ids-virtual-scroll-content');

    if (typeof this.height === 'string' && this.height?.includes('vh')) {
      const spaceFromTop = this.getBoundingClientRect().y;
      this.style.height = `calc(${this.height} - ${spaceFromTop + 16}px)`; // the actual viewport
    } else {
      this.style.height = `${this.height}`;
    }

    content?.style.setProperty('height', `${this.contentHeight}px`);

    const offset = this.container?.querySelector<HTMLElement>('.offset');
    offset?.style.setProperty('transform', `translateY(${this.offsetY}px)`);
  }

  /**
   * Render the visible section plus the cached data
   * @private
   * @returns {number} The array of visible data
   */
  visibleItemCount(): number {
    const viewportHeight = this.getBoundingClientRect().height;
    let count = Math.ceil(viewportHeight / this.itemHeight) + (2 * this.bufferSize);
    count = Math.min(Number(this.itemCount) - this.startIndex, count);
    return count;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      attributes.HEIGHT,
      attributes.ITEM_HEIGHT,
      attributes.BUFFER_SIZE,
      attributes.DATA,
      attributes.SCROLL_TOP,
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-virtual-scroll">
        <div class="ids-virtual-scroll-content">
          <div class="offset">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * The height of the virtual scroll container
   * @param {number|string|null} value the height for css
   */
  set height(value: number | string | null) {
    if (value) {
      this.setAttribute(attributes.HEIGHT, value.toString());
      this.applyHeight();
      return;
    }

    this.removeAttribute(attributes.HEIGHT);
  }

  get height(): number | string {
    return this.getAttribute(attributes.HEIGHT) || DEFAULT_HEIGHT;
  }

  /**
   * The height of each item in the scroller. TODO: support dynamic heights
   * @param {number|string} value the height of each item in pixels
   */
  set itemHeight(value: number | null) {
    if (value) {
      this.setAttribute(attributes.ITEM_HEIGHT, value.toString());
      this.applyHeight();
      this.renderItems(false);
      return;
    }

    this.removeAttribute(attributes.ITEM_HEIGHT);
  }

  get itemHeight(): number {
    const value = parseFloat(this.getAttribute(attributes.ITEM_HEIGHT) ?? '');
    return Number.isNaN(value) ? DEFAULT_ITEM_HEIGHT : value;
  }

  /**
   * Extra padding at the top and bottom so that the data transition smoothly
   * @param {number} value The number of extra top and bottom elements
   */
  set bufferSize(value: number | null) {
    if (value) {
      this.setAttribute(attributes.BUFFER_SIZE, value.toString());
      return;
    }

    this.removeAttribute(attributes.BUFFER_SIZE);
  }

  get bufferSize(): number {
    const value = parseFloat(this.getAttribute(attributes.BUFFER_SIZE) ?? '');
    return Number.isNaN(value) ? 10 : value;
  }

  /**
   * Set the scroll top position and scroll down to that location
   * @param {number | string} value The number of pixels from the top
   */
  set #scrollTop(value: number | string | any) {
    const val = parseFloat(value);
    if (!(Number.isNaN(val))) {
      this.setAttribute(attributes.SCROLL_TOP, val.toString());
      if (this.container) this.container.scrollTop = val;
      this.renderItems(false);
      return;
    }

    this.removeAttribute(attributes.SCROLL_TOP);
  }

  get #scrollTop(): number {
    const value = parseFloat(this.getAttribute(attributes.SCROLL_TOP) ?? '');
    return Number.isNaN(value) ? 0 : value;
  }

  /**
   * Scroll to a indexed item bring it into center view.
   * @param {number} value The index to scroll to
   */
  scrollToIndex(value: number) {
    this.scrollTop = Number(value) * Number(this.itemHeight);
  }

  /**
   * The height of the content behind the viewport
   * @returns {number} The calculated content height
   */
  get contentHeight(): number { return Number(this.itemCount) * Number(this.itemHeight); }

  get itemCount(): number { return this.data?.length; }

  get offsetY(): number {
    return Number(this.startIndex) * Number(this.itemHeight);
  }

  get startIndex(): number {
    let startNode = Math.floor(Number(this.scrollTop) / Number(this.itemHeight)) - Number(this.bufferSize);
    startNode = Math.max(0, startNode);

    return startNode;
  }

  /**
   * Return a item's html injecting any values from the dataset as needed.
   * @param {object} item The item to generate
   * @param {number} index the index for the template
   * @param {number} ariaIndex the aria index for the template (not used here but used in some implementations)
   * @returns {string} The html for this item
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemTemplate(item: any, index: number, ariaIndex?: number): string {
    return injectTemplate(this.stringTemplate, item);
  }

  /**
   * Set the data array of the listview
   * @param {Array|null} array The array to use
   */
  set data(array: Array<any> | null) {
    if (array && this.datasource) {
      this.datasource.data = array;
      this.lastStart = NaN;
      this.lastEnd = NaN;
      this.scrollTop = 0;
      this.initialized = true;
      this.applyHeight();
      this.renderItems(true);
      return;
    }

    if (this.datasource) this.datasource.data = null;
  }

  get data(): Array<any> {
    return this?.datasource?.data;
  }

  /**
   * Set the scroll target to a external parent
   * @param {HTMLElement|null} value The array to use
   */
  set scrollTarget(value: HTMLElement | undefined | null) {
    if (value) {
      // first, unset old scrollTarget
      this.offEvent('scroll', this.eventTarget);

      this.eventTarget = value;
      this.onEvent('scroll', this.eventTarget, (e: any) => {
        this.handleScroll(e);
      }, { passive: true });
    }
  }

  get scrollTarget(): HTMLElement | null {
    return this.eventTarget;
  }
}
