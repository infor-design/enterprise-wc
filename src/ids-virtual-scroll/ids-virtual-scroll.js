import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsDataSourceMixin } from '../ids-base/ids-data-source-mixin';
import { IdsRenderLoopMixin, IdsRenderLoopItem } from '../ids-render-loop/ids-render-loop-mixin';
import styles from './ids-virtual-scroll.scss';

/**
 * IDS Virtual Scroll Component
 */
@customElement('ids-virtual-scroll')
@scss(styles)
@mixin(IdsRenderLoopMixin)
class IdsVirtualScroll extends IdsElement {
  constructor() {
    super();
  }

  connectedCallBack() {
    this.datasource = new IdsDataSourceMixin();
    this.stringTemplate = '<div class="ids-virtual-scroll-item">${productName}</div>'; //eslint-disable-line

    this
      .init()
      .handleEvents();
  }

  /**
   * Init the scroll
   * @private
   * @returns {object} This API as used for joining
   */
  init() {
    this.applyHeight();
    this.renderItems();
    return this;
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  handleEvents() {
    this.timeout = null;

    this.eventHandlers = new IdsEventsMixin();
    this.eventHandlers.addEventListener('scroll', this.container, (e) => {
      this.handleScroll(e);
    }, { passive: true });

    return this;
  }

  handleScroll(e) {
    if (this.timeout) {
      cancelAnimationFrame(this.timeout);
    }

    const target = e.target;
    this.timeout = requestAnimationFrame(() => {
      this.scrollTop = target.scrollTop;
      this.renderItems(this.scrollTop);
    });
  }

  /**
   * Render the visible section plus the cached data
   * @private
   */
  renderItems() {
    if (!this.data || this.data.length === 0) {
      return;
    }

    const startIndex = this.startIndex;
    const endIndex = this.startIndex + this.visibleItemCount();

    if (this.lastStart === startIndex && this.lastEnd === endIndex) {
      return;
    }

    this.lastStart = startIndex;
    this.lastEnd = endIndex;

    const data = this.data.slice(
      startIndex,
      endIndex
    );

    let html = '';
    data.map((item, index) => {
      const node = this.itemTemplate(item, index + startIndex);
      html += node;
      return node;
    });

    this.itemContainer.style.transform = `translateY(${this.offsetY}px)`;
    this.itemContainer.innerHTML = html;
  }

  /**
   * Set the height of the containers
   * @private
   */
  applyHeight() {
    this.container.style.height = `${this.height}px`;
    this.container.querySelector('.ids-virtual-scroll-viewport').style.height = `${this.viewPortHeight}px`;
    this.itemContainer = this.querySelector('[slot="contents"]');
    this.itemContainer.style.transform = `translateY(${this.offsetY}px)`;

    this.isTable = this.querySelectorAll('.ids-data-grid-container').length > 0;
    if (this.isTable) {
      this.shadowRoot.querySelector('.ids-virtual-scroll').style.overflow = 'inherit';
    }
  }

  /**
   * Render the visible section plus the cached data
   * @private
   * @returns {Array} The array of visible data
   */
  visibleItemCount() {
    let count = Math.ceil(this.height / this.itemHeight) + 2 * this.bufferSize;
    count = Math.min(this.itemCount - this.startIndex, count);
    return count;
  }

  /**
   * Return the properties we handle as getters/setters
   * @returns {Array} The properties in an array
   */
  static get properties() {
    return ['height', 'item-height', 'buffer-size', 'data', 'scroll-top'];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-virtual-scroll" tabindex="0"><div class="ids-virtual-scroll-viewport"><slot></slot></div></div>`;
  }

  /**
   * The height of the virtual scroll container
   * @param {number} value the height in pixels
   */
  set height(value) {
    const hasProp = this.hasAttribute('height');

    if (value) {
      this.setAttribute('height', value);
      this.applyHeight();
      return;
    }

    this.removeAttribute('height');
  }

  get height() { return this.getAttribute('height'); }

  /**
   * The height of each item in the scroller. TODO: support dynamic heights
   * @param {number} value the height of each item in pixels
   */
  set itemHeight(value) {
    if (value) {
      this.setAttribute('item-height', value);
      this.applyHeight();
      this.renderItems();
      return;
    }

    this.removeAttribute('item-height');
  }

  get itemHeight() { return this.getAttribute('item-height'); }

  /**
   * Extra padding at the top and bottom so that the data transition smoothly
   * @param {number} value The number of extra top and bottom elements
   */
  set bufferSize(value) {
    const hasProp = this.hasAttribute('buffer-size');

    if (value) {
      this.setAttribute('buffer-size', value);
      return;
    }

    this.removeAttribute('buffer-size');
  }

  get bufferSize() { return this.getAttribute('buffer-size') || 20; }

  /**
   * Set the scroll top position and scroll down to that location
   * @param {number} value The number of pixels from the top
   */
  set scrollTop(value) {
    const hasProp = this.hasAttribute('scroll-top');

    if (value) {
      this.setAttribute('scroll-top', value);
      this.container.scrollTop = value;
      return;
    }

    this.removeAttribute('scroll-top');
  }

  get scrollTop() { return this.getAttribute('scroll-top') || 0; }

  /**
   * The height of the inner viewport
   * @private
   * @returns {number} The calculated viewport height
   */
  get viewPortHeight() { return this.itemCount * this.itemHeight; }

  /**
   * The (dynamic sometimes) total number of data being rendered
   * @private
   */
  set itemCount(value) {
    const hasProp = this.hasAttribute('item-count');

    if (value) {
      this.setAttribute('item-count', value);
      return;
    }

    this.removeAttribute('item-count');
  }

  get itemCount() { return parseInt(this.getAttribute('item-count'), 10); }

  get offsetY() {
    return this.startIndex * this.itemHeight;
  }

  get startIndex() {
    let startNode = Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize;
    startNode = Math.max(0, startNode);
    return startNode;
  }

  /**
   * Return a item's html injecting any values from the dataset as needed.
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item) {
    return this.injectTemplate(this.stringTemplate, item);
  }

  /**
   * Set the data array of the listview
   * @param {Array} value The array to use
   */
  set data(value) {
    if (value) {
      this.datasource.data = value;
      this.itemCount = value.length;
      this.renderItems();
      return;
    }

    this.datasource.data = null;
  }

  get data() {
    return this?.datasource?.data;
  }

  /**
   * Set the scroll target to a external parent
   * @param {object} value The array to use
   */
  set scrollTarget(value) {
    if (value) {
      this.eventTarget = value;
      /* istanbul ignore next */
      this.eventHandlers.addEventListener('scroll', this.eventTarget, (e) => {
        this.handleScroll(e);
      }, { passive: true });
    }
  }

  get scrollTarget() {
    return this?.eventTarget;
  }
}

export default IdsVirtualScroll;
