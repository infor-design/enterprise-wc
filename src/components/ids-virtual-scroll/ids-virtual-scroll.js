import {
  IdsElement,
  customElement,
  mix,
  scss,
  IdsDataSource
} from '../../core';

import { IdsEventsMixin } from '../../mixins';
import { IdsStringUtils } from '../../utils';
import styles from './ids-virtual-scroll.scss';

/**
 * IDS Virtual Scroll Component
 * @type {IdsVirtualScroll}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsRenderLoopMixin
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
    data.map((item) => {
      const node = this.itemTemplate(item);
      html += node;
      return node;
    });

    /* istanbul ignore next */
    if (this.itemContainer) {
      this.itemContainer.style.transform = `translateY(${this.offsetY}px)`;
      this.itemContainer.innerHTML = html;
    }
    const elem = this;
    this.triggerEvent('afterrender', elem, { detail: { elem: this, startIndex, endIndex } });
  }

  /**
   * Set the height of the containers
   * @private
   */
  applyHeight() {
    const viewport = this.container.querySelector('.ids-virtual-scroll-viewport');

    this.container.style.height = `${this.height}px`;
    viewport.style.height = `${this.viewPortHeight}px`;

    this.itemContainer = this.querySelector('[slot="contents"]');
    /* istanbul ignore next */
    if (this.itemContainer) {
      this.itemContainer.style.transform = `translateY(${this.offsetY}px)`;
    }

    this.isTable = this.querySelectorAll('.ids-data-grid-container').length > 0;
    if (this.isTable) {
      const scroll = this.shadowRoot.querySelector('.ids-virtual-scroll');
      scroll.style.overflow = 'inherit';
    }
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
   * @param {number|string|undefined} value the height in pixels
   */
  set height(value) {
    if (value) {
      this.setAttribute('height', value.toString());
      this.applyHeight();
      return;
    }

    this.removeAttribute('height');
  }

  get height() { return this.data?.length === 0 ? 0 : this.getAttribute('height'); }

  /**
   * The height of each item in the scroller. TODO: support dynamic heights
   * @param {number|string} value the height of each item in pixels
   */
  set itemHeight(value) {
    if (IdsStringUtils.stringToBool(value)) {
      this.setAttribute('item-height', value.toString());
      this.applyHeight();
      this.renderItems(false);
      return;
    }

    this.removeAttribute('item-height');
  }

  get itemHeight() { return this.getAttribute('item-height'); }

  /**
   * Extra padding at the top and bottom so that the data transition smoothly
   * @param {number|string} value The number of extra top and bottom elements
   */
  set bufferSize(value) {
    if (value) {
      this.setAttribute('buffer-size', value.toString());
      return;
    }

    this.removeAttribute('buffer-size');
  }

  get bufferSize() { return this.getAttribute('buffer-size') || 20; }

  /**
   * Set the scroll top position and scroll down to that location
   * @param {number|string} value The number of pixels from the top
   */
  set scrollTop(value) {
    if (value !== null && value !== undefined) {
      this.setAttribute('scroll-top', value.toString());
      this.container.scrollTop = Number(value);
      this.renderItems(false);
      return;
    }

    this.removeAttribute('scroll-top');
  }

  get scrollTop() { return this.getAttribute('scroll-top') || 0; }

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
      /* istanbul ignore next */
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
