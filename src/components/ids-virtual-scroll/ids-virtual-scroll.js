import {
  IdsElement,
  customElement,
  mix,
  scss,
  IdsDataSource,
  attributes
} from '../../core';

import { IdsEventsMixin } from '../../mixins';
import { IdsStringUtils } from '../../utils';
import styles from './ids-virtual-scroll.scss';

const DEFAULT_HEIGHT = 310;
const DEFAULT_ITEM_HEIGHT = 50;

/**
 * IDS Virtual Scroll Component
 * @type {IdsVirtualScroll}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 */
@customElement('ids-virtual-scroll')
@scss(styles)
class IdsVirtualScroll extends mix(IdsElement).with(IdsEventsMixin) {
  constructor() {
    super();
    this.state = { itemCount: 0 };
  }

  connectedCallback() {
    this.datasource = new IdsDataSource();
    this.stringTemplate = '<div class="ids-virtual-scroll-item">${productName}</div>'; //eslint-disable-line
    this.applyHeight();
    this.renderItems(false);
    this.#attachEventHandlers();
  }

  /**
   * Establish Internal Event Handlers
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers() {
    this.timeout = null;

    this.onEvent('scroll', this.container, (e) => {
      this.handleScroll(e);
    }, { passive: true });

    return this;
  }

  /**
   * Handle the scrolling event
   * @private
   * @param {Event} e The scroll event data
   */
  handleScroll(e) {
    if (this.timeout) {
      cancelAnimationFrame(this.timeout);
    }

    const target = e.target;
    this.timeout = requestAnimationFrame(() => {
      this.scrollTop = target.scrollTop;
    });
  }

  /**
   * Render the visible section plus the cached data
   * @private
   * @param {boolean} allowZero Allow a zero length dataset (render empty)
   */
  renderItems(allowZero) {
    if (!this.data || (!allowZero && this.data.length === 0)) {
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
      const node = this.itemTemplate(item, index);
      html += node;
      return node;
    });

    const offset = this.container.querySelector('.offset');
    offset.style.transform = `translateY(${this.offsetY}px)`;

    // work-around for outside components to style contents inside this shadowroot
    const wrapper = this.querySelector('[part="style-wrapper"]') ?? offset;
    wrapper.innerHTML = html;

    const elem = this;
    console.log('render()')
    this.triggerEvent('ids-virtual-scroll-afterrender', elem, { detail: { elem: this, startIndex, endIndex } });
  }

  /**
   * Set the height of the containers
   * @private
   */
  applyHeight() {
    const viewport = this.container.querySelector('.ids-virtual-scroll-viewport');

    this.container.style.height = `${this.height}px`;
    viewport.style.height = `${this.viewPortHeight}px`;

    const offset = this.container.querySelector('.offset');
    offset.style.transform = `translateY(${this.offsetY}px)`;
  }

  /**
   * Render the visible section plus the cached data
   * @private
   * @returns {number} The array of visible data
   */
  visibleItemCount() {
    let count = Math.ceil(this.height / this.itemHeight) + (2 * this.bufferSize);
    count = Math.min(Number(this.itemCount) - this.startIndex, count);
    return count;
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
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
  template() {
    return `
      <div class="ids-virtual-scroll">
        <div class="ids-virtual-scroll-viewport">
          <div class="offset">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * The height of the virtual scroll container
   * @param {number|string|undefined} value the height in pixels
   */
  set height(value) {
    if (value) {
      this.setAttribute(attributes.HEIGHT, value.toString());
      this.applyHeight();
      return;
    }

    this.removeAttribute(attributes.HEIGHT);
  }

  get height() { return this.getAttribute(attributes.HEIGHT) || DEFAULT_HEIGHT; }

  /**
   * The height of each item in the scroller. TODO: support dynamic heights
   * @param {number|string} value the height of each item in pixels
   */
  set itemHeight(value) {
    if (value) {
      this.setAttribute(attributes.ITEM_HEIGHT, value.toString());
      this.applyHeight();
      this.renderItems(false);
      return;
    }

    this.removeAttribute(attributes.ITEM_HEIGHT);
  }

  get itemHeight() {
    const result = this.getAttribute(attributes.ITEM_HEIGHT) || DEFAULT_ITEM_HEIGHT;
    return result;
  }

  /**
   * Extra padding at the top and bottom so that the data transition smoothly
   * @param {number|string} value The number of extra top and bottom elements
   */
  set bufferSize(value) {
    if (value) {
      this.setAttribute(attributes.BUFFER_SIZE, value.toString());
      return;
    }

    this.removeAttribute(attributes.BUFFER_SIZE);
  }

  get bufferSize() { return this.getAttribute(attributes.BUFFER_SIZE) || 20; }

  /**
   * Set the scroll top position and scroll down to that location
   * @param {number|string} value The number of pixels from the top
   */
  set scrollTop(value) {
    const val = parseFloat(value);
    if (!(Number.isNaN(val))) {
      this.setAttribute(attributes.SCROLL_TOP, val.toString());
      this.container.scrollTop = val;
      this.renderItems(false);
      return;
    }

    this.removeAttribute(attributes.SCROLL_TOP);
  }

  get scrollTop() { return this.getAttribute(attributes.SCROLL_TOP) || 0; }

  /**
   * Scroll to a indexed item bring it into center view.
   * @param {number} value The index to scroll to
   */
  scrollToIndex(value) {
    this.scrollTop = Number(value) * Number(this.itemHeight);
  }

  /**
   * The height of the inner viewport
   * @returns {number} The calculated viewport height
   */
  get viewPortHeight() { return Number(this.itemCount) * Number(this.itemHeight); }

  /**
   * The number of data items being rendered
   * @param {number} value The number of pixels from the top
   */
  set itemCount(value) {
    if (value) {
      this.state.itemCount = value;
      return;
    }

    this.state.itemCount = 0;
  }

  get itemCount() { return this.state.itemCount; }

  get offsetY() {
    return Number(this.startIndex) * Number(this.itemHeight);
  }

  get startIndex() {
    let startNode = Math.floor(Number(this.scrollTop) / Number(this.itemHeight))
      - Number(this.bufferSize);
    startNode = Math.max(0, startNode);

    return startNode;
  }

  /**
   * Return a item's html injecting any values from the dataset as needed.
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item) {
    return IdsStringUtils.injectTemplate(this.stringTemplate, item);
  }

  /**
   * Set the data array of the listview
   * @param {Array|undefined} value The array to use
   */
  set data(value) {
    if (value && this.datasource) {
      this.datasource.data = value;
      this.itemCount = value.length;
      this.lastStart = null;
      this.lastEnd = null;
      this.scrollTop = 0;
      this.applyHeight();
      this.renderItems(true);
      return;
    }

    this.datasource.data = null;
  }

  get data() {
    return this?.datasource?.data;
  }

  /**
   * Set the scroll target to a external parent
   * @param {object|undefined} value The array to use
   */
  set scrollTarget(value) {
    if (value) {
      this.eventTarget = value;
      this.onEvent('scroll', this.eventTarget, (e) => {
        this.handleScroll(e);
      }, { passive: true });
    }
  }

  get scrollTarget() {
    return this?.eventTarget;
  }
}

export default IdsVirtualScroll;
